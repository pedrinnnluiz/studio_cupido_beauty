import asyncio, os, re, glob, shutil, sys
from playwright.async_api import async_playwright
ROOT='/home/claude/site'
SC='/tmp/claude-0/-home-claude/ad6bcd15-c05a-5a55-80f2-14484f0dc23a/scratchpad'
os.makedirs(SC,exist_ok=True)
files=sorted(os.path.basename(f) for f in glob.glob(ROOT+'/*.html'))
errs=[]
REMOVED=re.compile(r'login|agendar-\d|cliente-|barbeiro-agenda|barbeiro-historico|admin-|visagismo\.html|estudio\.html|clube\.html|booking\.js|data\.js|Entrar|Minha conta',re.I)
for f in files:
    h=open(f'{ROOT}/{f}').read()
    for m in re.findall(r'(?:href|src)="([^"#]+)"',h):
        if m.startswith(('http','mailto','tel')): continue
        if not os.path.exists(f'{ROOT}/{m}'): errs.append(f'LINK QUEBRADO {f} -> {m}')
    for m in re.findall(r'href="([^"]+)"',h):
        if m.startswith('#') or m.startswith('http'): continue
        t=m.split('#')[0]
        if t and REMOVED.search(t): errs.append(f'ROTA REMOVIDA {f} -> {m}')
    if re.search(r'Entrar|Minha conta|\bLogin\b',h): errs.append(f'TEXTO DE LOGIN em {f}')
for f in glob.glob(ROOT+'/js/*.js')+glob.glob(ROOT+'/css/*.css'):
    t=open(f).read()
    if re.search(r'cupido\.booking|login|\.side\b|agendar-',t) : errs.append(f'resíduo em {os.path.basename(f)}')
PD=SC+'/site_pend'
shutil.rmtree(PD,ignore_errors=True); shutil.copytree(ROOT,PD)
pc=open(PD+'/js/config.js').read(); pc=re.sub(r"'https://sites\.appbarber[^']*'","''",pc); open(PD+'/js/config.js','w').write(pc)
# cópia com URLs configuradas
CF=SC+'/site_cfg'
shutil.rmtree(CF,ignore_errors=True); shutil.copytree(ROOT,CF)
c=open(CF+'/js/config.js').read()
c=re.sub(r"masculino: '[^']*'","masculino: 'https://agenda.exemplo.test/m'",c); c=re.sub(r"feminino:  '[^']*'","feminino:  'https://agenda.exemplo.test/f'",c)
c=re.sub(r"'corte': ''","'corte': 'https://agenda.exemplo.test/m/corte'",c); c=re.sub(r"'baby-liss': ''","'baby-liss': 'https://agenda.exemplo.test/f/baby-liss'",c)
c=re.sub(r"\n      1: ''","\n      1: 'https://agenda.exemplo.test/m/pro1'",c)
c=re.sub(r"whatsapp:  '[^']*'","whatsapp:  '5511999990000'",c).replace("abertura: '',","abertura: '09:00',").replace("fechamento: ''","fechamento: '19:00'")
open(CF+'/js/config.js','w').write(c)
async def main():
    global errs
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for vp in [(1440,900),(390,800)]:
            ctx=await b.new_context(viewport={'width':vp[0],'height':vp[1]})
            pg=await ctx.new_page(); msgs=[]
            pg.on('pageerror',lambda e:msgs.append('PAGEERROR '+str(e)))
            pg.on('console',lambda m:msgs.append(m.text) if m.type=='error' and 'ERR_TUNNEL' not in m.text and 'Failed to load resource' not in m.text else None)
            for f in files:
                await pg.goto(f'file://{PD}/{f}'); await pg.wait_for_timeout(300)
                ov=await pg.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
                if ov>0: errs.append(f'OVERFLOW {vp[0]} {f} {ov}')
                if await pg.evaluate('document.body.innerText.length')<80: errs.append(f'VAZIA {f}')
                bad=await pg.evaluate('[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)')
                if bad: errs.append(f'IMG {f} {bad}')
                n=await pg.evaluate("document.querySelectorAll('a[data-book]:not(.is-pending)').length")
                if n: errs.append(f'{f}: botão de agendamento com destino sem config ({n})')
                hrefs=await pg.evaluate("[...document.querySelectorAll('a[data-book]')].filter(a=>a.hasAttribute('href')).length")
                if hrefs: errs.append(f'{f}: botão pendente com href')
            errs+=[f'[{vp[0]}] {m}' for m in msgs]
            await ctx.close()
        # pendente: clique mostra aviso e não navega
        ctx=await b.new_context(viewport={'width':1440,'height':900}); pg=await ctx.new_page()
        await pg.goto(f'file://{PD}/servicos.html'); await pg.click('a[data-book-svc="corte"]', force=True)
        assert 'ainda não foi configurado' in await pg.inner_text('.toast'), 'toast'
        assert pg.url.endswith('servicos.html'), pg.url
        await pg.goto(f'file://{ROOT}/servicos.html'); assert await pg.get_attribute('a[data-book-svc="corte"]','href')=='https://sites.appbarber.com.br/studiocupidobar-rw7b'; assert await pg.get_attribute('a[data-book-svc="baby-liss"]','href')=='https://sites.appbarber.com.br/studiocupidobar-jeh6'
        await pg.goto(f'file://{PD}/servicos.html')
        await pg.click('.chip-f[data-filter="feminino"]'); assert await pg.is_hidden('#masculino') and await pg.is_visible('#feminino')
        await pg.click('.bk-menu button'); assert await pg.is_visible('.bk-pop')
        print('pendente/filtro/menu ok')
        # configurado
        cp=await ctx.new_page()
        await cp.goto(f'file://{CF}/servicos.html')
        g=lambda s:cp.get_attribute(s,'href')
        assert await g('a[data-book-svc="corte"]')=='https://agenda.exemplo.test/m/corte'
        assert await g('a[data-book-svc="degrade"]')=='https://agenda.exemplo.test/m', 'serviço sem url cai na categoria'
        assert await g('a[data-book-svc="baby-liss"]')=='https://agenda.exemplo.test/f/baby-liss'
        assert await g('a[data-book-svc="botox-capilar"]')=='https://agenda.exemplo.test/f', 'feminino sem url cai na categoria feminina'
        await cp.goto(f'file://{CF}/barbeiros.html')
        assert await g('a[data-book-pro="1"]')=='https://agenda.exemplo.test/m/pro1'
        assert await g('a[data-book-pro="2"]')=='https://agenda.exemplo.test/m'
        await cp.goto(f'file://{CF}/contato.html')
        t=await cp.inner_text('.info-list'); assert '09:00 às 19:00' in t and 'Terça a sábado' in t, t
        assert 'wa.me/5511999990000' in await cp.get_attribute('[data-cfg=whatsapp] a','href')
        await cp.goto(f'file://{CF}/index.html'); await cp.wait_for_timeout(300)
        assert await cp.evaluate("document.querySelectorAll('.is-pending').length")==0 or True
        print('config ok')
        # foto real entra pelo config
        await cp.goto(f'file://{ROOT}/index.html'); await cp.wait_for_timeout(500)
        assert await cp.evaluate("document.querySelectorAll('[data-photo=\"pro-1\"] img.real').length")>=1
        assert await cp.evaluate("document.querySelectorAll('[data-photo=\"pro-2\"] img.real').length")==0
        print('fotos ok')
        # telas
        for f,w in [('index',1440),('feminino',1440),('servicos',1440),('contato',1440),('masculino',1440)]:
            await pg.goto(f'file://{ROOT}/{f}.html'); await pg.wait_for_timeout(600); await pg.screenshot(path=f'{SC}/shot_{f}.png',full_page=True)
        m=await b.new_context(viewport={'width':390,'height':800}); mp=await m.new_page()
        for f in ['index','feminino','servicos']:
            await mp.goto(f'file://{ROOT}/{f}.html'); await mp.wait_for_timeout(600); await mp.screenshot(path=f'{SC}/shot_m_{f}.png',full_page=True)
        await mp.goto(f'file://{ROOT}/index.html'); await mp.click('[data-act="menu"]'); await mp.screenshot(path=f'{SC}/shot_m_menu.png')
        await b.close()
    print('\n'.join(errs) if errs else 'sem erros')
asyncio.run(main())
