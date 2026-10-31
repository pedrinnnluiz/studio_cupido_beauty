#!/usr/bin/env python3
"""Gera o site do Studio Cupido: um arquivo HTML por tela. Agendamento é externo (js/config.js)."""
import json, os, re, html
OUT = os.environ.get('OUT', '/home/claude/site')
HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- dados
import unicodedata
def _slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')
# Masculino. Preço/duração só onde a gestão informou; os demais ficam "a confirmar" (None).
SERVICES = [
 dict(id='corte', area='masculino', group='Barbearia', name='Corte masculino', desc='Corte na tesoura ou na máquina, finalizado com o estilo que combina com você.', min=None, price=None, tbc=True),
 dict(id='degrade', area='masculino', group='Barbearia', name='Degradê', desc='Transições precisas e acabamento limpo, no nível de contraste que você escolher.', min=None, price=None, tbc=True),
 dict(id='barba', area='masculino', group='Barbearia', name='Barba premium', desc='Modelagem com toalha quente e acabamento na navalha.', min=None, price=None, tbc=True),
 dict(id='combo', area='masculino', group='Barbearia', name='Corte e barba', desc='O atendimento completo em uma única visita.', min=None, price=None, tbc=True),
 dict(id='trat', area='masculino', group='Barbearia', name='Tratamento capilar', desc='Cuidado para fios e couro cabeludo, indicado conforme a sua necessidade.', min=None, price=None, tbc=True),
 dict(id='protese', area='masculino', group='Barbearia', name='Manutenção de Prótese Capilar', desc='', min=90, price=None),
 dict(id='visag', area='masculino', group='Barbearia', name='Consultoria Visagismo', desc='Análise de traços e proporções para definir a imagem que valoriza a sua identidade.', min=150, price=None),
]
# Feminino: lista do aplicativo de agendamento (nome | preço, None = "Consultar" | minutos | descrição opcional)
_FEM = {
 'Cabelo': [('Coloração - Retoque de Raiz', None, 105), ('Coloração Global', None, 120), ('Tonalização', None, 75), ('Luzes Curto', None, 240, 'até 70g de pó descolorante'),
            ('Luzes Médio', None, 255, 'de 71 até 100g de pó descolorante'), ('Corte Feminino', None, 60), ('Combo Corte e Escova', None, 60), ('CORTE HIDRATACAO ESCOVA PROMOCIONAL', 150, 75),
            ('Escova Curta', None, 45), ('Escova Média', None, 60), ('Escova Longa', None, 75), ('Escova Extra Longa', None, 90), ('Baby Liss', None, 45), ('Prancha', None, 30), ('Efeito Sirena', None, 105),
            ('Lavagem e Secagem', None, 60), ('Hidratação', None, 60), ('Nutrição', None, 60), ('Reconstrução', None, 60), ('Cauterização', None, 90), ('Botox Capilar', None, 120), ('Selagem', None, 120),
            ('Progressiva Curta', None, 120), ('Progressiva Média', None, 150), ('Progressiva Longa', None, 180), ('Progressiva Extra Longa', None, 195), ('Cronograma Capilar Completo', 600, 240)],
 'Mega hair': [('Manutenção Meha Hair até 10 fitas', None, 150), ('Manutenção Mega Hair 20 fitas', None, 150), ('Manutenção Mega Hair 30 fitas', None, 150)],
 'Sobrancelhas': [('Design Personalizado', None, 45), ('Design e Buço', None, 45), ('Design + Buço + Queixo', None, 60), ('Design com Henna', None, 60), ('Design com Tintura', None, 60),
                  ('Henna somente', None, 30), ('Tintura Sobrancelha somente', None, 30), ('Brow Lamination', None, 90), ('Fort Brows', None, 30), ('SPA das Sobrancelhas', None, 60)],
 'Cílios': [('Lash Lifting', None, 60), ('Classico Fio a Fio', None, 90), ('Volume Brasileiro', None, 90), ('Mega Volume Brasileiro', None, 105), ('Volume Egípcio', None, 105), ('Volume Inglês', None, 105),
            ('Volume Luxo', None, 120), ('Fox Eyes', None, 105), ('Manutenção Lash', None, 105), ('Lash, + Brow + Hidra', None, 210)],
 'Micropigmentação': [('Micro Sobrancelha', None, 120), ('Micro Sobrancelha Retoque', None, 90), ('Micro Labial', None, 120), ('Micro Labial Retoque', None, 90)],
 'Pele e epilação': [('Limpeza de Pele', None, 60), ('Revitalização Facial', None, 60), ('Glow U', None, 90), ('Buço', None, 30), ('Epilação Facial', None, 45), ('Epilação Partes', None, 30)],
 'Unhas e pés': [('Manicure', None, 60), ('Pedicure', None, 60), ('Manicure e Pedicure', None, 120), ('Esmaltação Comum', None, 30), ('Esmaltação em Gel', None, 45), ('SPA dos Pés', None, 30)],
 'Maquiagem e penteado': [('Maquiagem', None, 90), ('Penteado', None, 90), ('Penteado e Maquiagem', None, 150)],
 'Avaliação': [('AVALIAÇÃO', 0, 30)],
}
GROUPS_F = list(_FEM)
for g, items in _FEM.items():
    for it in items:
        SERVICES.append(dict(id=_slug(it[0]), area='feminino', group=g, name=it[0], desc=it[3] if len(it) > 3 else '', min=it[2], price=it[1]))
assert len({s['id'] for s in SERVICES}) == len(SERVICES), 'ids duplicados'
SVC = {s['id']: s for s in SERVICES}

_TBD = 'Apresentação a incluir. A gestão enviará a formação, a experiência e as especialidades.'
PROS = [
 dict(id=1, team='barbeiros', name='Amadeu Diaz', role='Atendimento e visagismo', real=True,
      spec=['Atendimento ao cliente', 'Visagismo'],
      bio='Veio do Nordeste em busca de uma vida melhor e, ao longo do caminho, aperfeiçoou suas habilidades no atendimento ao cliente e no visagismo. Cada corte nasce da conversa e do estudo do rosto de quem está na cadeira.',
      svc=['corte', 'combo', 'visag']),
 dict(id=2, team='barbeiros', name='Dom Bigode', role='Barbeiro', bio=_TBD, svc=[]),
 dict(id=3, team='barbeiros', name='Gustavo Adrian', role='Barbeiro', bio=_TBD, svc=[]),
 dict(id=4, team='barbeiros', name='Matheus', role='Barbeiro', bio=_TBD, svc=[]),
 dict(id=5, team='barbeiros', name='Barbeiro 05', role='Barbeiro · nome a definir', bio=_TBD, svc=[], tbd=True),
 dict(id=6, team='beauty', name='Chrys Gerbo', role='Especialista em loiros, corte e cor', real=True, spec=['Loiros', 'Corte', 'Cor'],
      bio='Cabeleireiro com mais de 30 anos de experiência, Chrystiano Gerbovitch já atuou com grandes nomes do mercado e já trabalhou com as maiores marcas mundiais do segmento. Hoje residente de Sorocaba, se destaca por sua expertise em loiros, cor e corte, dominando técnicas e ajudando mulheres de todas as idades a encontrarem seu brilho próprio e autenticidade.',
      svc=['coloracao-global', 'luzes-curto', 'luzes-medio', 'tonalizacao', 'corte-feminino']),
 dict(id=7, team='beauty', name='Carolina', role='Studio Cupido Beauty', bio=_TBD, svc=[]),
 dict(id=8, team='beauty', name='Cinthia', role='Studio Cupido Beauty', bio=_TBD, svc=[]),
]
BARBERS = [p for p in PROS if p['team'] == 'barbeiros']
BEAUTY = [p for p in PROS if p['team'] == 'beauty']
TEAM_AREA = {'barbeiros': 'masculino', 'beauty': 'feminino'}
def price(s):
    if s.get('tbc'): return '—'
    return 'Consultar' if s['price'] is None else 'R$ ' + ('%.2f' % s['price']).replace('.', ',')
def dur(s): return '—' if not s['min'] else f"{s['min']} min"
AREA = {'masculino': 'Masculino', 'feminino': 'Feminino'}

# ---------------------------------------------------------------- ícones
IC = {
 'arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
 'gem': '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l-2 6 5 12M15 3l2 6-5 12"/>',
 'face': '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="11" r="3.2"/><path d="M6.8 17c1.2-2 3-3 5.2-3s4 1 5.2 3"/>',
 'sparkle': '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
 'crown': '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
 'pin': '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 'cafe': '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"/>',
 'wifi': '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
 'shield': '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
 'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6M16 5a3 3 0 0 1 0 6M18 14c2.5.5 4 2.5 4 6"/>',
 'sym': '<path d="M12 3v18"/><path d="M8 6c-3 1-5 4-5 6s2 5 5 6M16 6c3 1 5 4 5 6s-2 5-5 6"/>',
 'harm': '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
 'list': '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L6.8 5M3.5 12l1.2 1.2L6.8 11M3.5 18l1.2 1.2L6.8 17"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
}
def icon(n, size=24, sw=1.6):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{IC[n]}</svg>'
ARW = icon('arrow', 18, 2)
PERSON = '<svg class="pp" viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="52" r="32" fill="rgba(255,255,255,.16)"/><path d="M20 150c0-38 32-60 80-60s80 22 80 60z" fill="rgba(255,255,255,.12)"/></svg>'

# rótulos curtos dos espaços de fotografia (as imagens reais entram por js/config.js)
SLOTS = {'fachada': 'Fachada', 'interior': 'Interior', 'cadeiras': 'Cadeiras', 'decoracao': 'Decoração', 'ferramentas': 'Ferramentas',
         'equipe': 'Equipe', 'atendimentos': 'Atendimentos', 'cat-masculino': 'Masculino', 'cat-feminino': 'Feminino'}
def ph(cls='', style='', label='', person=False, tag=True, slot=None, alt=''):
    """Quadro de imagem. Com `slot`, a foto real é trocada apenas em js/config.js; sem foto, aparece o placeholder."""
    lab = label or SLOTS.get(slot, '')
    t = f'<span class="ph-tag">{lab}</span>' if (lab and tag) else ''
    sl = f' data-photo="{slot}" data-alt="{html.escape(alt or lab, quote=True)}"' if slot else ''
    return f'<div class="ph {cls}{" noov" if person else ""}" style="{style}"{sl}>{PERSON if person else ""}{t}</div>'

# ---------------------------------------------------------------- estrutura comum
FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap'
NAV = [('index.html', 'Início'), ('masculino.html', 'Masculino'), ('feminino.html', 'Feminino'), ('servicos.html', 'Serviços'),
       ('barbeiros.html', 'Equipe'), ('resultados.html', 'Resultados'), ('historia.html', 'Nossa história'), ('contato.html', 'Contato')]
PAGES = {}   # nome do arquivo -> html completo
CHEV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'

def book(area, label=None, cls='btn btn-p', svc=None, pro=None, arrow=True):
    """Botão de agendamento EXTERNO. O destino vem de js/config.js (nenhum endereço fica no HTML)."""
    label = label or f'Agendamento {AREA[area]}'
    a = f'data-book="{area}"' + (f' data-book-svc="{svc}"' if svc else '') + (f' data-book-pro="{pro}"' if pro else '')
    return f'<a class="{cls}" {a}>{label}{" " + ARW if arrow else ""}</a>'

def doc(title, body, body_cls=''):
    bc = f' class="{body_cls}"' if body_cls else ''
    return (f'<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            f'<title>{title}</title><meta name="description" content="Studio Cupido, barbearia e estética. Protótipo visual.">'
            f'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            f'<link rel="stylesheet" href="{FONTS}"><link rel="stylesheet" href="css/style.css">'
            f'<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}</style></head>'
            f'<body{bc}>\n{body}\n<script src="js/config.js"></script><script src="js/ui.js"></script></body></html>\n')

def header(active, over=False):
    links = ''.join(f'<a href="{h}"{" class=\"on\" aria-current=\"page\"" if h == active else ""}>{t}</a>' for h, t in NAV)
    pop = book('masculino', cls='bk-item', arrow=False) + book('feminino', cls='bk-item f', arrow=False)
    return (f'<header class="hd{" over" if over else ""}" id="hd"><div class="wrap hd-in">'
            f'<a class="brand" href="index.html" aria-label="Studio Cupido, página inicial"><img src="images/logo.png" alt="Studio Cupido Beauty"></a>'
            f'<nav class="nav" aria-label="Principal">{links}</nav>'
            f'<div class="hd-act"><div class="bk-menu"><button class="btn btn-p btn-s" type="button" data-act="bk" aria-expanded="false" aria-haspopup="true">Agendar {CHEV}</button>'
            f'<div class="bk-pop">{pop}</div></div>'
            f'<button class="burger" type="button" data-act="menu" aria-label="Abrir menu" aria-expanded="false">{icon("menu", 22, 2)}</button></div></div></header>')

def footer():
    nav = ''.join(f'<li><a href="{h}">{t}</a></li>' for h, t in NAV[1:])
    return ('<footer class="ft"><div class="wrap"><div class="ft-grid">'
            '<div><span class="logo-tile"><img src="images/logo.png" alt="Studio Cupido Beauty"></span><p style="margin-top:18px;max-width:30ch;font-size:14px">Studio Cupido, barbearia e estética. Premium na apresentação, humano no atendimento.</p></div>'
            f'<div><h4>Navegação</h4><ul>{nav}</ul></div>'
            '<div><h4>Contato</h4><ul><li><span class="ph-txt" data-cfg="endereco">[Endereço a confirmar]</span></li>'
            '<li><span class="ph-txt" data-cfg="whatsapp" data-icon="wa">[WhatsApp a confirmar]</span></li><li><span class="ph-txt" data-cfg="instagram" data-icon="ig">[Instagram oficial a confirmar]</span></li>'
            '<li data-hide-empty><span data-cfg="outros"></span></li></ul></div>'
            '<div><h4>Funcionamento</h4><ul><li><span data-cfg="horario">Terça a sábado · <span class="ph-txt">[horários a confirmar]</span></span></li></ul>'
            '<h4 style="margin-top:28px">Agendamento</h4><ul>'
            f'<li>{book("masculino", "Agendamento Masculino", "ft-bk", arrow=False)}</li><li>{book("feminino", "Agendamento Feminino", "ft-bk", arrow=False)}</li></ul></div>'
            '</div><div class="ft-bot"><span>Protótipo visual. Textos, preços, nomes e imagens são demonstrativos até a validação da gestão.</span><span>Agendamentos são feitos em aplicativo externo.</span></div></div></footer>')

def public(fname, title, content, active=None, over=False, theme=''):
    PAGES[fname] = doc(title, header(active or fname, over) + content + footer(), body_cls=theme)

def page_hero(eyebrow, h1, lead, cls='', extra='', fig=None):
    f = f'<div class="ph-fig" aria-hidden="false">{ph(cls="cutout", slot=fig, alt="Studio Cupido", label="")}</div>' if fig else ''
    return f'<section class="page-hero on-dark {cls}{" has-fig" if fig else ""}"><div class="wrap"><span class="eyebrow">{eyebrow}</span><h1>{h1}</h1><p class="lead">{lead}</p>{extra}</div>{f}</section>'

def svc_row(s):
    return (f'<div class="svc"><div><h3>{s["name"]}</h3><span class="cap-area">{AREA[s["area"]]}</span></div><p class="muted">{s["desc"]}</p><div class="dur">{dur(s)}</div><div class="price">{price(s)}</div>'
            f'{book(s["area"], "Agendar este serviço", "btn btn-o btn-s", svc=s["id"], arrow=False)}</div>')
def svc_list(area):
    out = ''
    groups = GROUPS_F if area == 'feminino' else ['Barbearia']
    for g in groups:
        rows = ''.join(svc_row(s) for s in SERVICES if s['area'] == area and s['group'] == g)
        head = f'<h3 class="grp-h">{g}</h3>' if area == 'feminino' else ''
        out += f'<div class="grp-blk">{head}<div class="svc-list">{rows}</div></div>'
    return out
DEMO_PRICES = '<div class="demo-note" style="margin-top:32px"><span class="prov" style="flex:none">Valores</span><span>Preços e durações conforme a lista do aplicativo de agendamento. "Consultar" indica valor informado no atendimento; "—" aguarda confirmação da gestão. O agendamento é concluído no aplicativo externo.</span></div>'

def cta_final(title='Seu próximo corte começa aqui.', text='Conheça o Studio Cupido e agende no aplicativo de agendamento.', areas=('masculino', 'feminino')):
    btns = ''.join(book(a, cls='btn btn-p' if i == 0 else 'btn btn-o') for i, a in enumerate(areas))
    return (f'<section class="sec deep cta on-dark"><div class="wrap stack" style="gap:28px"><span class="eyebrow">Studio Cupido</span><h2>{title}</h2><p class="lead">{text}</p>'
            f'<div class="btn-row">{btns}</div></div></section>')

def pro_card(b):
    img = ph(slot=f'pro-{b["id"]}', alt=b['name'], label='', person=True, style=f'--cx:{30+b["id"]*9}%;--cy:{18+b["id"]*4}%')
    first = b['bio'].split('. ')[0].rstrip('.') + '.'
    return (f'<article class="bc">{img}<span class="role">{b["role"]}</span><h3>{b["name"]}</h3><p>{first}</p><div class="acts"><a class="link" href="perfil-{b["id"]}.html">Ver perfil</a>'
            f'{book("masculino", "Agendar", "btn btn-p btn-s", pro=b["id"], arrow=False)}</div></article>')

AMEN = [('cafe', 'Café especial para nossos clientes'), ('wifi', 'Ambiente confortável'), ('shield', 'Higiene e biossegurança'),
        ('users', 'Profissionais especializados'), ('sparkle', 'Atendimento único para cada cliente'), ('pin', 'Localização privilegiada')]
def amen(light=False):
    return f'<div class="amen{" light" if light else ""}">' + ''.join(f'<div>{icon(i, 28)}<span>{t}</span></div>' for i, t in AMEN) + '</div>'

CHECK = '<svg class="ck" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
# ================================================================ HOME
def choice(area, h2, lead, cls, theme=''):
    nome = AREA[area]
    return (f'<div class="pan {cls} {theme}"><div class="pan-in"><div class="stack" style="gap:0"><span class="eyebrow">{nome}</span><h2>{h2}</h2><p class="lead">{lead}</p>'
            f'<div class="pan-btns"><a class="btn btn-p" href="{area}.html">Conheça o {nome} {ARW}</a>{book(area, cls="btn btn-o")}</div></div>'
            f'<div class="pan-art">{ph(cls="arch cutout", slot="cat-" + area, alt="Área " + nome.lower(), person=True, style="--cx:60%")}</div></div></div>')

home = f'''
<div class="hz" id="hz" data-mode="m">
<section class="hero2 on-dark"><div class="h2-bg"></div><div class="h2-shade"></div><div class="h2-fade" aria-hidden="true"></div>
 <div class="wrap h2-in">
  <div class="res-pick h2-pick"><span class="res-pick-l">Escolha sua experiência</span><div class="seg" data-k="m" role="group" aria-label="Escolha sua experiência"><span class="seg-ind" aria-hidden="true"></span>
   <button type="button" class="on" data-hero-tab="m" aria-pressed="true">{CHECK}{icon("sym", 18, 1.8)}<span>Masculino</span></button><button type="button" class="f" data-hero-tab="f" aria-pressed="false">{CHECK}{icon("sparkle", 18, 1.8)}<span>Feminino</span></button></div></div>
  <div class="h2-slide" data-slide="m">
   <div class="h2-ovwrap"><div class="h2-mir a"><img src="images/owner-retrato.jpg" alt="Proprietário do Studio Cupido na barbearia"></div>
    <a class="h2-circle" href="#experiencias" aria-label="Escolher entre as áreas masculina e feminina"><span>Masculino</span><span>Feminino</span>{icon("arrow", 18, 2)}</a></div>
   <span class="eyebrow">Studio Cupido · Barbearia &amp; Estética</span>
   <h1>Muito mais<br>que um corte.<em>É um posicionamento.</em></h1>
   <p class="h2-sub">Barbearia premium, consultoria de visagismo e estética completa em um só lugar.</p>
   <div class="h2-btns"><a class="btn btn-p" href="#experiencias">Escolha sua experiência {ARW}</a><a class="btn btn-o" href="historia.html">Nossa história</a></div>
  </div>
  <div class="h2-slide" data-slide="f" hidden>
   <div class="h2-ovwrap"><div class="h2-mir a">{ph(cls="cutout", slot="cat-feminino", person=True, label="", alt="Studio Cupido feminino", style="--cx:60%")}</div>
    <a class="h2-circle" href="feminino.html" aria-label="Conheça o Feminino"><span>Conheça</span><span>o Feminino</span>{icon("arrow", 18, 2)}</a></div>
   <span class="eyebrow">Studio Cupido · Estética &amp; Beleza</span>
   <h1>Muito mais<br>que beleza.<em>É identidade.</em></h1>
   <p class="h2-sub">Estética completa, com escuta, técnica e espaço para você ser você.</p>
   <div class="h2-btns">{book("feminino")}<a class="btn btn-o" href="feminino.html">Conheça o Feminino</a></div>
  </div>
 </div></section>
<div class="feat-wrap"><div class="wrap"><div class="feat">
 <div>{icon("gem",30)}<span>Atendimento premium</span></div><div>{icon("face",30)}<span>Consultoria de visagismo</span></div>
 <div>{icon("sparkle",30)}<span>Ala feminina completa</span></div><div>{icon("users",30)}<span>Profissionais especializados</span></div><div>{icon("pin",30)}<span>Localização privilegiada</span></div>
</div></div></div>
</div>

<section class="duo on-dark" id="experiencias" aria-label="Escolha sua experiência">
 {choice("masculino", "Estilo, técnica e identidade.", "Barbearia premium e consultoria de visagismo, com atendimento feito sob medida.", "m")}
 {choice("feminino", "Beleza, cuidado e autoestima.", "Estética completa para o seu bem-estar e para realçar a sua beleza natural.", "f", "theme-f")}
</section>

<section class="sec mist"><div class="wrap hsi"><div class="stack"><span class="eyebrow">Consultoria de visagismo</span><h2>Descubra a sua melhor versão.</h2>
 <p class="lead">Analisamos traços, proporções e estilo de vida para criar uma imagem que valorize a sua identidade.</p>
 <a class="btn btn-o" href="masculino.html#visagismo">Conheça a consultoria {ARW}</a></div>
 <div class="hsi-card"><span class="eyebrow">Método H·S·I</span><h3>Harmonia. Simetria. Individualidade.</h3>
  <div class="hsi-grid"><div><i>{icon("face",24)}</i>Análise facial completa</div><div><i>{icon("list",24)}</i>Recomendações personalizadas</div><div><i>{icon("sparkle",24)}</i>Estilo que valoriza</div><div><i>{icon("clock",24)}</i>Resultados mais duradouros</div></div>
  <a class="link" href="masculino.html#visagismo">Saiba mais sobre o método</a></div></div></section>

<section class="sec navy on-dark"><div class="wrap split hist-home"><div class="stack" style="gap:32px"><span class="eyebrow">Nossa história</span>
 <p class="quote">Uma barbearia feita de <em>pessoas</em>, não de fórmulas.</p>
 <p class="lead">Aqui, ninguém é um corte repetido. Cada cliente chega com uma história, um estilo e uma identidade que só ele tem, e é atendido de forma única: a gente escuta, entende quem você é e transforma isso em um visual que é seu.</p>
 <a class="btn btn-p" href="historia.html">Ler a história completa {ARW}</a></div>
 <div class="hist-art cut"><span class="ring"></span><div class="cut-arch"><img src="images/owner-terno.png" alt="Proprietário do Studio Cupido, de terno azul, de braços abertos" loading="lazy"></div></div></div></section>

<section class="sec deep dark on-dark"><div class="wrap"><div class="head-row"><div class="stack"><span class="eyebrow">A equipe</span><h2>Os cinco barbeiros<br>do Studio Cupido.</h2></div><a class="link" href="barbeiros.html">Conhecer a equipe</a></div>
 <div class="bar-row">{"".join(pro_card(b) for b in BARBERS)}</div><p class="cap" style="color:#8FA0B5;margin-top:28px">Apresentações e fotos dos profissionais serão incluídas conforme forem enviadas pela gestão.</p></div></section>

<section class="sec"><div class="wrap"><div class="split"><div class="stack"><span class="eyebrow">O espaço</span><h2>Um ambiente pensado para você se sentir bem.</h2>
 <p class="lead">Estrutura moderna, atendimento humanizado e uma experiência premium em cada detalhe.</p><a class="btn btn-o" href="historia.html#espaco">Conheça o espaço {ARW}</a></div>
 <div class="est-tiles">{ph(slot="interior", alt="Parede e janelas do estúdio")}{ph(slot="fachada", alt="Fachada do primeiro endereço")}{ph(slot="cadeiras", cls="t2", tag=False)}{ph(slot="atendimentos", cls="t3", tag=False)}</div></div>
 {amen(True)}
 <p class="cap" style="margin-top:20px">Itens de estrutura conforme o documento de identidade; confirmar o que está disponível antes da versão final.</p></div></section>
{cta_final()}
'''
PAGES['index.html'] = doc('Início | Studio Cupido', header('index.html', True) + home + footer())

# ================================================================ SERVIÇOS
def area_block(area, h2):
    th = ' theme-f' if area == 'feminino' else ''
    return (f'<div class="area-block{th}" data-area="{area}" id="{area}"><div class="head-row" style="margin-bottom:24px"><div class="stack"><span class="eyebrow">{AREA[area]}</span><h2>{h2}</h2></div>'
            f'<a class="link" href="{area}.html">Conhecer o {AREA[area]}</a></div>{svc_list(area)}'
            f'<div class="area-cta">{book(area, cls="btn btn-p")}</div></div>')
FILTERS = ('<div class="filters" role="group" aria-label="Filtrar serviços"><button type="button" class="chip-f on" data-filter="all" aria-pressed="true">Todos</button>'
           '<button type="button" class="chip-f" data-filter="masculino" aria-pressed="false">Masculino</button><button type="button" class="chip-f f" data-filter="feminino" aria-pressed="false">Feminino</button></div>')
public('servicos.html', 'Serviços | Studio Cupido',
    page_hero('Serviços', 'Escolha o seu.', 'Barbearia, estética e visagismo. Explore o catálogo e, quando decidir, agende no aplicativo de agendamento.') +
    f'<section class="sec" style="padding-top:48px"><div class="wrap">{FILTERS}{area_block("masculino", "Estilo, técnica e identidade.")}<div class="gap-b"></div>{area_block("feminino", "Beleza, cuidado e autoestima.")}{DEMO_PRICES}</div></section>' + cta_final())

# ================================================================ MASCULINO / FEMININO
pillars = [('harm', 'Harmonia', 'O equilíbrio entre os seus traços, as suas proporções e o estilo que você quer comunicar.'),
           ('sym', 'Simetria', 'A leitura das proporções do rosto, para que cada corte e cada detalhe trabalhem a favor delas.'),
           ('sparkle', 'Individualidade', 'O que há de único em você, que nenhuma fórmula pronta consegue copiar.')]
public('masculino.html', 'Masculino | Studio Cupido',
    page_hero('Studio Cupido · Masculino', 'Estilo, técnica<br>e identidade.', 'Serviços completos para o seu visual, bem-estar e confiança.', 'navy',
              f'<div class="btn-row" style="margin-top:28px">{book("masculino")}<a class="btn btn-o" href="barbeiros.html">Conhecer os barbeiros</a></div>', fig='cat-masculino') +
    f'<section class="sec" style="padding-top:56px"><div class="wrap"><div class="head-row" style="margin-bottom:24px"><div class="stack"><span class="eyebrow">Serviços masculinos</span><h2>O que oferecemos.</h2></div><a class="link" href="servicos.html#masculino">Ver no catálogo</a></div>{svc_list("masculino")}{DEMO_PRICES}</div></section>'
    f'<section class="sec mist" id="visagismo"><div class="wrap"><div class="head-row"><div class="stack"><span class="eyebrow">Consultoria de visagismo · Método H·S·I</span><h2>Antes do corte,<br>a conversa.</h2></div><span class="prov muted">Textos a validar com a gestão</span></div>'
    f'<div class="plans">' + ''.join(f'<div class="plan" style="border-style:solid;border-color:var(--line)"><span style="color:var(--royal)">{icon(i, 34)}</span><h3>{t}</h3><p class="muted">{d}</p></div>' for i, t, d in pillars) + '</div>'
    f'<div class="btn-row" style="margin-top:36px">{book("masculino", "Agendar consultoria", "btn btn-p", svc="visag")}</div></div></section>'
    f'<section class="sec"><div class="wrap split"><div class="stack"><span class="eyebrow">No dia a dia</span><h2>O trabalho em detalhe.</h2><p class="lead">Espaço para as fotografias reais dos atendimentos, das ferramentas e das cadeiras do Studio Cupido.</p></div>'
    f'<div class="est-tiles">{ph(slot="atendimentos", tag=True)}{ph(slot="ferramentas", cls="t2")}{ph(slot="cadeiras", cls="t3")}{ph(slot="decoracao")}</div></div></section>' + cta_final('Pronto para o seu próximo corte?', 'Agende no aplicativo de agendamento masculino.', ('masculino',)))

public('feminino.html', 'Feminino | Studio Cupido',
    page_hero('Studio Cupido · Feminino', 'Beleza, cuidado<br>e autoestima.', 'Estética completa para o seu bem-estar e para realçar a sua beleza natural.', 'wine',
              f'<div class="btn-row" style="margin-top:28px">{book("feminino")}<a class="btn btn-o" href="servicos.html#feminino">Ver no catálogo</a></div>', fig='cat-feminino') +
    f'<section class="sec" style="padding-top:56px"><div class="wrap"><div class="head-row" style="margin-bottom:24px"><div class="stack"><span class="eyebrow">Serviços femininos</span><h2>O que oferecemos.</h2></div></div>{svc_list("feminino")}{DEMO_PRICES}'
    f'<p class="muted" style="margin-top:20px;font-size:14px">Os nomes e as apresentações das profissionais da ala feminina serão incluídos quando forem enviados pela gestão.</p></div></section>'
    f'<section class="sec mist"><div class="wrap split"><div class="stack"><span class="eyebrow">Ambiente</span><h2>Cuidado em cada detalhe.</h2><p class="lead">Espaço para as fotografias reais da ala feminina: ambiente, atendimentos e detalhes.</p><span class="prov muted">Fotografias a incluir</span></div>'
    f'<div class="est-tiles">{ph(slot="cat-feminino", person=True, style="--cx:60%")}{ph(slot="cadeiras")}{ph(slot="decoracao", cls="t2")}{ph(slot="atendimentos", cls="t3")}</div></div></section>' +
    cta_final('Cuide de você, sem pressa.', 'Agende no aplicativo de agendamento feminino.', ('feminino',)), theme='theme-f')

# ================================================================ CONTATO
public('contato.html', 'Contato | Studio Cupido',
    page_hero('Contato', 'Fale com o<br>Studio Cupido.', 'Endereço, canais de atendimento e horários de funcionamento.') +
    f'<section class="sec"><div class="wrap info-grid"><div class="info-list">'
    f'<div><b>Endereço</b><span class="ph-txt" data-cfg="endereco">[Endereço a confirmar]</span></div>'
    f'<div><b>Funcionamento</b><span data-cfg="horario">Terça a sábado · <span class="ph-txt">[horários a confirmar]</span></span></div>'
        f'<div><b>WhatsApp</b><span class="ph-txt" data-cfg="whatsapp">[WhatsApp oficial a confirmar]</span></div>'
    f'<div><b>Instagram</b><span class="ph-txt" data-cfg="instagram">[Instagram oficial a confirmar]</span></div>'
    f'<div><b>E-mail</b><span class="ph-txt" data-cfg="email">[E-mail a confirmar]</span></div>'
    f'<div data-hide-empty><b>Outros canais</b><span data-cfg="outros"></span></div></div>'
    f'<div class="stack" style="gap:28px"><div class="pn bk-card" id="agendamento"><span class="eyebrow">Agendamento</span><h2>Agende no aplicativo.</h2>'
    f'<p class="muted" style="margin-bottom:20px">O site apresenta o Studio Cupido. O agendamento acontece em um aplicativo externo; escolha a área para continuar.</p>'
    f'<div class="btn-row">{book("masculino")}{book("feminino", cls="btn btn-wine")}</div></div>'
    f'<div class="map-ph">{ph(cls="t3", label="Mapa · a incluir")}</div></div></div></section>')


# ================================================================ RESULTADOS
RES_TABS = (f'<div class="res-pick"><span class="res-pick-l">Ver resultados</span><div class="seg" data-k="masculino" role="group" aria-label="Escolha o tipo de resultado"><span class="seg-ind" aria-hidden="true"></span>'
            f'<button type="button" class="on" data-res-tab="masculino" aria-pressed="true">{CHECK}{icon("sym", 18, 1.8)}<span>Homem</span></button>'
            f'<button type="button" class="f" data-res-tab="feminino" aria-pressed="false">{CHECK}{icon("sparkle", 18, 1.8)}<span>Mulher</span></button></div></div>')
PAGES['resultados.html'] = doc('Resultados | Studio Cupido', header('resultados.html') + '<div id="res">'
    '<section class="page-hero on-dark navy res-hero"><div class="wrap res-hero-in"><div><span class="eyebrow">Resultados</span><h1>Veja o que fazemos.</h1>'
    '<p class="lead">Escolha se quer ver os resultados masculinos ou femininos.</p></div>' + RES_TABS + '</div></section>'
    '<section class="res-body"><div class="wrap"><div data-res-list="masculino"></div><div data-res-list="feminino" hidden></div></div></section>'
    + cta_final('Quer o seu resultado?', 'Agende no aplicativo de agendamento.') + '</div>' + footer())

# ================================================================ HISTÓRIA
chap = [('Origem', 'Como tudo começou', 'Espaço para contar como nasceu o Studio Cupido, o momento e o lugar em que a ideia surgiu.'),
        ('O proprietário', 'Trajetória de quem criou', 'Espaço para a trajetória profissional do proprietário.'),
        ('Motivação', 'Por que abrir uma barbearia', 'Espaço para a motivação do negócio e a ideia de atendimento que o orientou.'),
        ('Valores', 'No que acreditamos', 'Espaço para os princípios que a gestão confirmar. Nenhum valor foi definido até agora.'),
        ('Evolução', 'Como o estúdio cresceu', 'Espaço para marcos do estabelecimento, como mudanças de espaço e chegada de novos profissionais.'),
        ('Clientes', 'A relação com quem nos visita', 'Cada cliente chega com uma história e uma identidade, e é atendido de forma única. Espaço para detalhar a relação da equipe com os clientes.'),
        ('Futuro', 'Para onde vamos', 'Espaço para a visão de futuro da barbearia.')]
def chap_art(i):
    if i == 0: return ph(slot='fachada', alt='Fachada do local onde o Studio Cupido começou', label='Onde tudo começou')
    if i == 1: return '<div class="ph has-img o"><img class="real" src="images/owner-bemvindo.jpg" alt="Proprietário do Studio Cupido" loading="lazy"></div>'
    return ph(cls=('t2' if i % 3 == 1 else ('' if i % 2 else 't3')) + (' o' if i % 3 == 0 else ''), label='Foto demonstrativa', style=f'--cx:{40+i*6}%')
public('historia.html', 'Nossa história | Studio Cupido',
    page_hero('Studio Cupido · desde 2026', 'Nossa história', 'Origem, trajetória e visão de futuro do estúdio e de quem o criou.', '', '<div style="margin-top:20px"><span class="prov" style="color:#9FB3D6">Os textos desta página são provisórios</span></div>') +
    '<section class="sec" style="padding-top:40px"><div class="wrap">' + ''.join(
        f'<div class="chap"><div class="chap-art">{chap_art(i)}</div><div><span class="eyebrow">{e}</span><h2>{t}</h2><p class="lead">{d}</p><p class="muted">Texto demonstrativo para validar a composição editorial. Será substituído pela história verdadeira, fornecida pela gestão.</p></div></div>'
        for i, (e, t, d) in enumerate(chap)) + '</div></section>'
    f'<section class="sec mist" id="espaco"><div class="wrap"><div class="head-row"><div class="stack"><span class="eyebrow">O espaço</span><h2>Um ambiente pensado<br>para você se sentir bem.</h2></div><span class="prov muted">Fotografias reais a incluir</span></div>'
    f'<div class="gal">{ph(slot="interior", cls="g1", alt="Parede e janelas do estúdio")}{ph(slot="cadeiras", cls="g2 t2 oval", tag=False)}{ph(slot="decoracao", cls="g3 t3")}{ph(slot="fachada", cls="g4", tag=False)}{ph(slot="ferramentas", cls="g5 t2")}{ph(slot="equipe", cls="g6 t3 oval", tag=False)}</div>{amen(True)}'
    f'<p class="cap" style="margin-top:20px">Cada quadro é um espaço para uma fotografia real (fachada, interior, cadeiras, decoração, ferramentas, equipe). A troca é feita em js/config.js.</p></div></section>' + cta_final())

# ================================================================ BARBEIROS
def team_block(team, eyebrow, h2, theme=''):
    area = TEAM_AREA[team]
    rows = ''.join(
        f'<article class="bl"><div class="bl-art">{ph(slot=f"pro-{p["id"]}", alt=p["name"], label="", person=True, cls="" if p["id"] % 2 else "t2", style=f"--cx:{30+p["id"]*8}%")}</div><div><span class="eyebrow">{p["role"]}</span><h2>{p["name"]}</h2><p class="lead">{p["bio"]}</p>'
        + (f'<div class="chips" style="margin-top:20px">' + ''.join(f'<span class="chip">{x}</span>' for x in p["spec"]) + '</div>' if p.get('spec') else '')
        + f'<div class="acts"><a class="btn btn-o" href="perfil-{p["id"]}.html">Ver perfil</a>{book(area, "Agendar com " + p["name"], "btn btn-p", pro=p["id"])}</div></div></article>'
        for p in PROS if p['team'] == team)
    return f'<section class="sec {theme}" style="padding-top:56px"><div class="wrap"><div class="head-row"><div class="stack"><span class="eyebrow">{eyebrow}</span><h2>{h2}</h2></div></div>{rows}</div></section>'

public('barbeiros.html', 'Equipe | Studio Cupido',
    page_hero('Nossa equipe', 'Quem cuida<br>de você.', 'Barbeiros e profissionais do Studio Cupido Beauty. Conheça cada um e, quando quiser, agende no aplicativo de agendamento.') +
    team_block('barbeiros', 'Barbearia', 'Os cinco barbeiros.') +
    team_block('beauty', 'Studio Cupido Beauty', 'Beleza, cabelo e estética.', 'theme-f beauty-sec') +
    '<section class="sec" style="padding:0 0 56px"><div class="wrap"><p class="cap">Apresentações e fotos dos profissionais serão incluídas conforme forem enviadas pela gestão.</p></div></section>' + cta_final())

for b in PROS:
    area = TEAM_AREA[b['team']]; th = 'theme-f' if area == 'feminino' else ''
    team = [p for p in PROS if p['team'] == b['team']]
    others = ''.join(f'<a class="btn btn-o btn-s" href="perfil-{x["id"]}.html">{x["name"]}</a>' for x in team if x['id'] != b['id'])
    spec = b.get('spec') or [b['role']]
    if b['svc']:
        lst = ''.join(f'<div class="mini-svc"><div><h3>{SVC[s]["name"]}</h3><span class="muted" style="font-size:14px">{dur(SVC[s])} · {price(SVC[s])}</span></div>{book(area, "Agendar este serviço", "btn btn-o btn-s", svc=s, pro=b["id"], arrow=False)}</div>' for s in b['svc'])
        side = f'<div><span class="eyebrow">Serviços relacionados</span>{lst}</div>'
    else:
        side = (f'<div class="stack"><span class="eyebrow">Serviços</span><p class="muted">Os serviços deste profissional serão indicados pela gestão. Enquanto isso, consulte o catálogo completo.</p>'
                f'<a class="btn btn-o" href="servicos.html#{area}">Ver o catálogo {ARW}</a></div>')
    tbd = '' if b.get('real') else '<span class="prov">Apresentação a incluir</span>'
    photo = ph(slot=f'pro-{b["id"]}', alt=b['name'], label='', person=True, style='--cx:60%;--cy:20%')
    sub = 'Conheça os outros profissionais' if area == 'feminino' else 'Conheça os outros barbeiros'
    public(f'perfil-{b["id"]}.html', f'{b["name"]} | Studio Cupido',
        f'<section class="page-hero on-dark"><div class="wrap prof-hero"><div><div class="crumbs"><a href="barbeiros.html">Equipe</a><span>/</span><span>{b["name"]}</span></div><h1>{b["name"]}</h1><span class="eyebrow">{b["role"]}</span><p class="lead" style="margin-top:20px">{b["bio"]}</p>'
        f'<div style="margin-top:28px">{book(area, "Agendar com " + b["name"], "btn btn-p", pro=b["id"])}</div></div>{photo}</div></section>'
        f'<section class="sec"><div class="wrap split top"><div class="stack"><span class="eyebrow">Apresentação</span><h2>Sobre o profissional</h2><p class="lead">{b["bio"]}</p>{tbd}'
        f'<div><div class="eyebrow" style="margin-bottom:12px">Especialidades</div><div class="chips">' + ''.join(f'<span class="chip">{x}</span>' for x in spec) + f'</div></div></div>'
        f'{side}</div></section>'
        f'<section class="sec mist" style="padding:64px 0"><div class="wrap"><span class="eyebrow">Equipe</span><h3 style="font-size:2.2rem;margin:12px 0 20px">{sub}</h3><div class="others">{others}</div></div></section>', active='barbeiros.html', theme=th)

# ---------------------------------------------------------------- saída
os.makedirs(OUT + '/js', exist_ok=True); os.makedirs(OUT + '/css', exist_ok=True)
svc_cfg = '\n'.join(f"      '{s['id']}': '',{' ' * max(1, 34 - len(s['id']))}// {AREA[s['area']]} · {s['name']}" for s in SERVICES)
pro_cfg = '\n'.join(f"      {p['id']}: '',{' ' * 4}// {p['name']} ({'Barbearia' if p['team'] == 'barbeiros' else 'Studio Cupido Beauty'})" for p in PROS)
open(OUT + '/js/config.js', 'w').write(open(HERE + '/config.js').read().replace('/*@@SERVICOS@@*/', svc_cfg).replace('/*@@PROFISSIONAIS@@*/', pro_cfg))
open(OUT + '/js/ui.js', 'w').write(open(HERE + '/ui.js').read())
open(OUT + '/css/style.css', 'w').write(open(HERE + '/style_base.css').read() + open(HERE + '/style_extra.css').read())
for f, h in PAGES.items(): open(f'{OUT}/{f}', 'w').write(h)
print(len(PAGES), 'páginas')
