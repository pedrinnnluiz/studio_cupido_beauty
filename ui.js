/* Studio Cupido · comportamento compartilhado.
   Lê js/config.js para: links de agendamento externo, contato/horários e fotografias. */
(function(){
  var CFG=window.CUPIDO_CONFIG||{};
  var AG=CFG.agendamento||{}, CT=CFG.contato||{}, FN=CFG.funcionamento||{}, FT=CFG.fotos||{};
  function isUrl(v){return typeof v==='string'&&/^https?:\/\/\S+$/i.test(v.trim())}
  function pick(v){return isUrl(v)?v.trim():''}

  /* ---------- agendamento externo ---------- */
  function resolve(el){
    var area=el.getAttribute('data-book'),svc=el.getAttribute('data-book-svc'),pro=el.getAttribute('data-book-pro');
    return (svc&&pick((AG.servicos||{})[svc]))||(pro&&pick((AG.profissionais||{})[pro]))||pick(AG[area])||'';
  }
  var toast;
  function say(msg){
    if(!toast){toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast)}
    toast.textContent=msg;toast.classList.add('on');clearTimeout(say.t);say.t=setTimeout(function(){toast.classList.remove('on')},4200);
  }
  document.querySelectorAll('[data-book]').forEach(function(a){
    var u=resolve(a);
    if(u){a.setAttribute('href',u);a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer');a.removeAttribute('aria-disabled')}
    else{
      a.classList.add('is-pending');a.setAttribute('role','link');a.setAttribute('aria-disabled','true');a.setAttribute('tabindex','0');
      a.setAttribute('title','Endereço de agendamento ainda não configurado');
      if(!a.classList.contains('bk-item')){var t=document.createElement('small');t.className='pend-tag';t.textContent='Em breve';a.appendChild(t)}
    }
  });
  document.addEventListener('click',function(e){
    var a=e.target.closest('a.is-pending');
    if(a){e.preventDefault();say('O endereço de agendamento ainda não foi configurado. Em breve este botão levará ao aplicativo de agendamento.')}
  });
  document.addEventListener('keydown',function(e){
    if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('a.is-pending')){e.preventDefault();say('O endereço de agendamento ainda não foi configurado.')}
    if(e.key==='Escape'){closePop()}
  });

  /* ---------- menu móvel e menu de agendamento ---------- */
  function closePop(){document.querySelectorAll('.bk-menu.open').forEach(function(m){m.classList.remove('open');m.querySelector('[data-act="bk"]').setAttribute('aria-expanded','false')})}
  document.addEventListener('click',function(e){
    var m=e.target.closest('[data-act="menu"]');
    if(m){var h=document.getElementById('hd');h.classList.toggle('open');m.setAttribute('aria-expanded',h.classList.contains('open'));return}
    var b=e.target.closest('[data-act="bk"]');
    if(b){var w=b.closest('.bk-menu'),o=!w.classList.contains('open');closePop();w.classList.toggle('open',o);b.setAttribute('aria-expanded',o);return}
    if(!e.target.closest('.bk-menu'))closePop();
    var f=e.target.closest('[data-filter]');
    if(f)filter(f.getAttribute('data-filter'));
  });

  /* ---------- resultados (vídeos do Drive, tocam dentro do site) ---------- */
  var RS=CFG.resultados||{};
  function driveId(u){var m=/\/file\/d\/([\w-]+)/.exec(u||'')||/[?&]id=([\w-]+)/.exec(u||'');return m?m[1]:''}
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var PLAY='<svg class="vc-ic" width="60" height="60" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="29" fill="rgba(255,255,255,.2)" stroke="#fff" stroke-width="1.5"/><path d="M25 19l17 11-17 11z" fill="#fff"/></svg>';
  document.querySelectorAll('[data-res-list]').forEach(function(el){
    var area=el.getAttribute('data-res-list');
    var list=(RS[area]||[]).filter(function(v){return driveId(v.video)});
    if(!list.length){el.innerHTML='<div class="vc-empty"><b>Em breve</b><span>Os resultados '+(area==='feminino'?'femininos':'masculinos')+' serão incluídos aqui.</span></div>';return}
    el.className='vc-grid '+(RS.formato==='horizontal'?'h':'v');
    el.innerHTML=list.map(function(v,i){
      var id=driveId(v.video),t=esc(v.titulo||'Resultado');
      return '<article class="vc"><button type="button" class="vc-play" data-vid="'+id+'" aria-label="Assistir: '+t+'">'
        +'<img class="vc-img" alt="" loading="lazy" src="https://drive.google.com/thumbnail?id='+id+'&sz=w640" onerror="this.remove()">'
        +'<span class="vc-shade"></span>'+PLAY
        +'<span class="vc-cap"><small>'+(area==='feminino'?'Mulher':'Homem')+'</small>'+t+'</span></button></article>';
    }).join('');
  });
  document.addEventListener('click',function(e){
    var p=e.target.closest('.vc-play');
    if(p){var f=document.createElement('iframe');f.src='https://drive.google.com/file/d/'+p.getAttribute('data-vid')+'/preview';f.allow='autoplay; fullscreen';f.allowFullscreen=true;f.title='Vídeo de resultado';p.closest('.vc').classList.add('playing');p.replaceWith(f);return}
    var t=e.target.closest('[data-res-tab]');
    if(t)resTab(t.getAttribute('data-res-tab'));
  });
  function resTab(k){
    var w=document.getElementById('res');if(!w)return;
    w.querySelectorAll('[data-res-tab]').forEach(function(b){var on=b.getAttribute('data-res-tab')===k;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
    w.querySelectorAll('[data-res-list]').forEach(function(l){l.hidden=l.getAttribute('data-res-list')!==k});
    var sg=w.querySelector('.seg');if(sg)sg.setAttribute('data-k',k);
    w.classList.toggle('theme-f',k==='feminino');ftTheme(k==='feminino');
    try{history.replaceState(null,'','#'+k)}catch(x){}
  }
  if((location.hash||'')==='#feminino')resTab('feminino');

  /* ---------- Home: alternância Masculino / Feminino (muda a paleta do hero) ---------- */
  var hz=document.getElementById('hz');
  function heroMode(k){
    if(!hz)return;
    hz.setAttribute('data-mode',k);hz.classList.toggle('is-f',k==='f');
    hz.querySelectorAll('[data-slide]').forEach(function(s){s.hidden=s.getAttribute('data-slide')!==k});
    hz.querySelectorAll('[data-hero-tab]').forEach(function(t){var on=t.getAttribute('data-hero-tab')===k;t.classList.toggle('on',on);t.setAttribute('aria-pressed',on)});
    var sg=hz.querySelector('.seg');if(sg)sg.setAttribute('data-k',k);ftTheme(k==='f');
    document.body.classList.toggle('theme-f',k==='f');
    document.querySelectorAll('[data-hz-show]').forEach(function(x){var on=x.getAttribute('data-hz-show')===k;x.hidden=!on;if(on)x.querySelectorAll('.rv:not(.in)').forEach(function(r){r.classList.remove('rv')})});
  }
  document.addEventListener('click',function(e){var t=e.target.closest('[data-hero-tab]');if(t)heroMode(t.getAttribute('data-hero-tab'))});
  /* ---------- Home: título letra por letra, entrada da foto e parallax ---------- */
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function split(h){
    if(h.getAttribute('data-done'))return;h.setAttribute('data-done',1);var i=0;
    h.querySelectorAll('.ln').forEach(function(ln){
      var words=ln.textContent.trim().split(/\s+/);ln.textContent='';ln.setAttribute('aria-hidden','true');
      words.forEach(function(w,wi){
        var ws=document.createElement('span');ws.className='w';
        Array.from(w).forEach(function(ch){var c=document.createElement('span');c.className='c';c.textContent=ch;c.style.setProperty('--i',i++);ws.appendChild(c)});
        ln.appendChild(ws);if(wi<words.length-1)ln.appendChild(document.createTextNode(' '));
      });
    });
  }
  function measure(){ /* posição de cada letra do itálico, para o brilho correr pela frase inteira */
    if(!hz)return;hz.querySelectorAll('.h2-title em').forEach(function(em){
      var r=em.getBoundingClientRect();if(!r.width)return;em.style.setProperty('--emw',r.width+'px');
      em.querySelectorAll('.c').forEach(function(c){c.style.setProperty('--ox',(c.getBoundingClientRect().left-r.left)+'px')});
    });
  }
  function play(){if(!hz)return;hz.classList.remove('play');void hz.offsetWidth;hz.classList.add('play');measure()}
  if(hz){
    hz.querySelectorAll('[data-split]').forEach(split);
    var go=function(){measure();play()};
    if(document.fonts&&document.fonts.ready){var t0=setTimeout(go,900);document.fonts.ready.then(function(){clearTimeout(t0);go()})}else go();
    window.addEventListener('resize',measure);
    hz.addEventListener('click',function(e){if(e.target.closest('[data-hero-tab]'))setTimeout(play,0)});
    var img=hz.querySelector('.h2-photo');
    if(img&&!RM){
      var mx=0,my=0,sy=0,raf=0;
      var tick=function(){raf=0;img.style.setProperty('--px',(mx*-14)+'px');img.style.setProperty('--py',(my*-10+sy*.18)+'px')};
      var req=function(){if(!raf)raf=requestAnimationFrame(tick)};
      if(matchMedia('(pointer:fine)').matches)hz.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;req()});
      window.addEventListener('scroll',function(){sy=Math.min(scrollY,1200);req()},{passive:true});
    }
  }


  /* ---------- filtro do catálogo ---------- */
  function filter(k){
    var bs=document.querySelectorAll('[data-filter]');if(!bs.length)return;
    bs.forEach(function(b){var on=b.getAttribute('data-filter')===k;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
    document.querySelectorAll('[data-area]').forEach(function(s){s.hidden=!(k==='all'||s.getAttribute('data-area')===k)});ftTheme(k==='feminino');
    document.body.classList.toggle('theme-f',k==='feminino');
  }
  var hv=(location.hash||'').replace('#','');if(hv==='masculino'||hv==='feminino')filter(hv);

  /* ---------- horários e contato ---------- */
  function link(href,txt){var a=document.createElement('a');a.href=href;a.textContent=txt;a.target='_blank';a.rel='noopener noreferrer';return a}
  var ICO={wa:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.2-.4.700-1.300.1-.2 0-.3 0-.4l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4.100c1.700.7 2.400.8 3.200.7a2.700 2.700 0 0 0 1.800-1.300 2.200 2.200 0 0 0 .2-1.300c-.1-.1-.3-.2-.5-.3z"/></svg>',
   ig:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.800 2h8.400A5.800 5.800 0 0 1 22 7.800v8.400a5.800 5.800 0 0 1-5.800 5.800H7.800A5.800 5.800 0 0 1 2 16.200V7.800A5.800 5.800 0 0 1 7.800 2zm-.2 2A3.600 3.600 0 0 0 4 7.600v8.800A3.600 3.600 0 0 0 7.600 20h8.800a3.600 3.600 0 0 0 3.600-3.600V7.600A3.600 3.600 0 0 0 16.400 4zm9.600 1.500a1.300 1.300 0 1 1 0 2.600 1.300 1.300 0 0 1 0-2.600zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>'};
  function put(el,node){el.classList.remove('ph-txt');el.textContent='';el.appendChild(typeof node==='string'?document.createTextNode(node):node);
    var ic=el.getAttribute('data-icon');if(ic&&ICO[ic]&&node.tagName==='A'){node.classList.add('soc');node.setAttribute('aria-label',node.textContent);node.insertAdjacentHTML('afterbegin','<span class="soc-ico">'+ICO[ic]+'</span>')}}
  function ftTheme(f){document.querySelectorAll('.ft').forEach(function(x){x.classList.toggle('theme-f',!!f)})}
  var digits=function(s){return String(s).replace(/\D/g,'')};
  document.querySelectorAll('[data-cfg]').forEach(function(el){
    var k=el.getAttribute('data-cfg'),v=CT[k];
    if(k==='horario'){
      var d=FN.dias||'Segunda a sábado';
      if(FN.abertura&&FN.fechamento)put(el,d+' · '+FN.abertura+' às '+FN.fechamento);
      else{el.classList.remove('ph-txt');el.textContent=d+' · ';var s=document.createElement('span');s.className='ph-txt';s.textContent='[horários a confirmar]';el.appendChild(s)}
      return;
    }
    if(k==='outros'){
      var list=(CT.outros||[]).filter(function(o){return o&&o.nome&&isUrl(o.url)});
      if(!list.length){var p=el.closest('[data-hide-empty]')||el;p.hidden=true;return}
      el.textContent='';list.forEach(function(o,i){if(i)el.appendChild(document.createTextNode(' · '));el.appendChild(link(o.url,o.nome))});return;
    }
    if(!v)return;
    if(k==='whatsapp')put(el,link(isUrl(v)?v:'https://wa.me/'+digits(v),isUrl(v)?'Falar no WhatsApp':v));
    else if(k==='instagram')put(el,link(isUrl(v)?v:'https://instagram.com/'+String(v).replace(/^@/,''),isUrl(v)?'Instagram':'@'+String(v).replace(/^@/,'')));
    else if(k==='telefone')put(el,link('tel:'+digits(v),v));
    else if(k==='email')put(el,link('mailto:'+v,v));
    else put(el,v);
  });

  /* ---------- fotografias reais ---------- */
  document.querySelectorAll('[data-photo]').forEach(function(el){
    var src=FT[el.getAttribute('data-photo')];if(!src)return;
    var img=new Image();img.className='real';img.alt=el.getAttribute('data-alt')||'';img.src=src;
    img.onload=function(){
      el.classList.add('has-img');
      el.querySelectorAll('.ph-tag,svg.pp').forEach(function(n){n.remove()});
      el.insertBefore(img,el.firstChild);
    };
  });
})();

/* ---------- Botões: onda no clique, efeito magnético e entrada ao rolar ---------- */
(function(){
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(RM)return;
  var SEL='.btn,.chip-f,.seg button,.bk-item,.ft-bk,.burger,.nav a';
  document.addEventListener('pointerdown',function(e){
    var b=e.target.closest(SEL);if(!b||b.classList.contains('is-pending'))return;
    var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2.4,rp=document.createElement('span');rp.className='rp';
    rp.style.cssText='--s:'+s+'px;--x:'+(e.clientX-r.left)+'px;--y:'+(e.clientY-r.top)+'px';
    b.appendChild(rp);setTimeout(function(){rp.remove()},700);
  });
  if(matchMedia('(pointer:fine)').matches){
    document.addEventListener('pointermove',function(e){
      var b=e.target.closest('.btn');if(!b||b.classList.contains('is-pending'))return;
      var r=b.getBoundingClientRect();
      b.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*10+'px');b.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*8+'px');
    });
    document.addEventListener('pointerout',function(e){var b=e.target.closest('.btn');if(b&&!b.contains(e.relatedTarget)){b.style.removeProperty('--mx');b.style.removeProperty('--my')}});
  }
  if(!('IntersectionObserver' in window))return;
  var els=[].slice.call(document.querySelectorAll('.btn,.link,.chip-f')).filter(function(el){return !el.closest('.hz,.hd,.bk-pop')});
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;var el=en.target;io.unobserve(el);
    var sib=el.parentElement?[].indexOf.call(el.parentElement.children,el):0;el.style.setProperty('--d',Math.min(sib,4)*.09+'s');el.classList.add('in');
    el.addEventListener('animationend',function f(ev){if(ev.animationName!=='fadeUp')return;el.classList.remove('rv','in');el.removeEventListener('animationend',f)});
  })},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){el.classList.add('rv');io.observe(el)});
})();
/* ---------- Visagismo: linhas de análise desenham ao entrar na tela ---------- */
(function(){
  var f=document.querySelectorAll('.hsi-face');if(!f.length)return;
  if(!('IntersectionObserver' in window)){f.forEach(function(x){x.classList.add('in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.35});
  f.forEach(function(x){io.observe(x)});
})();

/* ---------- WhatsApp flutuante, mapa, categorias e busca de serviços ---------- */
(function(){
  var CFG=window.CUPIDO_CONFIG||{};
  var CT=CFG.contato||{};
  var digits=function(s){return String(s||'').replace(/\D/g,'')};
  var wa=CT.whatsapp?(/^https?:/.test(CT.whatsapp)?CT.whatsapp:'https://wa.me/'+digits(CT.whatsapp)):'';
  document.querySelectorAll('[data-cfg="email"]').forEach(function(el){var row=el.closest('[data-hide-empty]');var v=String(CT.email||'').trim();
    if(!v){if(row)row.hidden=true;return}if(row)row.hidden=false;var a=document.createElement('a');a.href='mailto:'+v;a.textContent=v;el.textContent='';el.appendChild(a)});
  document.querySelectorAll('[data-wa],[data-wa-link]').forEach(function(a){if(wa){a.href=wa;a.hidden=false}else a.hidden=true});

  /* mapa da página Contato, montado a partir do endereço em config.js */
  var mb=document.querySelector('[data-map]');
  if(mb){
    var end=(CT.endereco||'').replace(/\s*·\s*/g,', ');
    if(end){
      var q=encodeURIComponent(end),fr=document.createElement('iframe');
      fr.src='https://www.google.com/maps?q='+q+'&z=16&output=embed';fr.title='Mapa: '+end;fr.loading='lazy';fr.referrerPolicy='no-referrer-when-downgrade';fr.allowFullscreen=true;
      mb.querySelector('.map-fr').appendChild(fr);
      mb.querySelector('[data-map-link]').href='https://www.google.com/maps/search/?api=1&query='+q;
    }else mb.hidden=true;
  }

  /* categorias do catálogo feminino: abrir e fechar */
  function setAcc(blk,open){blk.classList.toggle('open',open);var b=blk.querySelector('.acc-b');if(b)b.setAttribute('aria-expanded',open)}
  document.addEventListener('click',function(e){var b=e.target.closest('.acc-b');if(!b)return;var blk=b.closest('.acc');setAcc(blk,!blk.classList.contains('open'))});

  /* busca */
  var box=document.querySelector('[data-search]');if(!box)return;
  var inp=box.querySelector('input'),pop=box.querySelector('.ss-pop'),clr=box.querySelector('.ss-x'),cnt=box.querySelector('.ss-count'),empty=document.querySelector('.ss-empty');
  var rows=[].slice.call(document.querySelectorAll('.svc[data-q]'));
  var norm=function(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]+/g,' ').trim()};
  var SYN={unha:'manicure pedicure esmaltacao',unhas:'manicure pedicure esmaltacao',cilio:'lash cilios',cilios:'lash cilios',sobrancelha:'design brow sobrancelhas henna',
    pe:'pedicure pes',pes:'pedicure pes',cabelo:'cabelo corte escova coloracao',luzes:'luzes',loiro:'luzes coloracao tonalizacao',alisamento:'progressiva selagem botox',
    maquiagem:'maquiagem penteado',make:'maquiagem',depilacao:'epilacao buco',pele:'pele limpeza facial glow',barba:'barba',careca:'protese',protese:'protese'};
  var POP={masculino:['Corte masculino','Degradê','Barba','Visagismo','Prótese capilar'],feminino:['Progressiva','Coloração','Cílios','Sobrancelha','Manicure','Mega hair','Limpeza de pele']};
  function area(){var on=document.querySelector('[data-filter].on');return on?on.getAttribute('data-filter'):'all'}
  function match(row,terms){var t=row.getAttribute('data-q');return terms.every(function(w){if(t.indexOf(w)>=0)return true;var s=SYN[w];return !!s&&s.split(' ').some(function(x){return t.indexOf(x)>=0})})}
  function inArea(row){var a=area();return a==='all'||row.getAttribute('data-ar')===a}
  var act=-1,items=[];
  function apply(){
    var q=norm(inp.value),terms=q?q.split(/\s+/):[],n=0;
    clr.hidden=!q;
    rows.forEach(function(r){var ok=!terms.length||match(r,terms);r.classList.toggle('ss-off',!ok);if(ok&&inArea(r))n++});
    document.querySelectorAll('.grp-blk').forEach(function(g){var vis=g.querySelectorAll('.svc:not(.ss-off)').length;g.classList.toggle('ss-off',!!terms.length&&!vis);g.classList.toggle('force',!!terms.length&&vis>0)});
    document.querySelectorAll('.area-block').forEach(function(b){b.classList.toggle('ss-off',!!terms.length&&!b.querySelector('.svc:not(.ss-off)'))});
    cnt.textContent=terms.length?(n?n+(n===1?' serviço encontrado':' serviços encontrados'):''):'';
    if(empty)empty.hidden=!(terms.length&&!n);
    document.querySelectorAll('.demo-note').forEach(function(d){d.classList.toggle('ss-off',!!terms.length&&!n)});
  }
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function render(){
    var q=norm(inp.value),terms=q?q.split(/\s+/):[],a=area(),h='';items=[];act=-1;
    if(!terms.length){
      var list=a==='all'?POP.masculino.slice(0,3).concat(POP.feminino.slice(0,4)):POP[a];
      h='<div class="ss-h">Buscas populares</div><div class="ss-chips">'+list.map(function(t,i){return '<button type="button" class="ss-chip" role="option" id="ss-o'+i+'" data-term="'+esc(t)+'">'+esc(t)+'</button>'}).join('')+'</div>';
    }else{
      var hits=rows.filter(function(r){return inArea(r)&&match(r,terms)}).slice(0,7);
      h=hits.length?'<div class="ss-h">Serviços</div>'+hits.map(function(r,i){var ar=r.getAttribute('data-ar');return '<button type="button" class="ss-it" role="option" id="ss-o'+i+'" data-go="'+r.getAttribute('data-svc')+'"><span>'+esc(r.getAttribute('data-name'))+'</span><small class="'+(ar==='feminino'?'f':'')+'">'+(ar==='feminino'?'Feminino':'Masculino')+'</small></button>'}).join('')
        :'<div class="ss-none">Nenhum serviço com “'+esc(inp.value.trim())+'”.</div>';
    }
    pop.innerHTML=h;items=[].slice.call(pop.querySelectorAll('[role=option]'));
  }
  function show(){render();pop.hidden=false;inp.setAttribute('aria-expanded','true');box.classList.add('is-open')}
  function hide(){pop.hidden=true;inp.setAttribute('aria-expanded','false');inp.removeAttribute('aria-activedescendant');box.classList.remove('is-open')}
  function go(id){
    var r=document.querySelector('.svc[data-svc="'+id+'"]');if(!r)return;
    inp.value=r.getAttribute('data-name');apply();hide();
    var acc=r.closest('.acc');if(acc&&!acc.classList.contains('open'))setAcc(acc,true);
    setTimeout(function(){r.scrollIntoView({behavior:'smooth',block:'center'});r.classList.remove('flash');void r.offsetWidth;r.classList.add('flash')},60);
  }
  function pick(el){if(!el)return;if(el.getAttribute('data-go'))go(el.getAttribute('data-go'));else{inp.value=el.getAttribute('data-term');apply();render();inp.focus()}}
  inp.addEventListener('focus',show);
  inp.addEventListener('input',function(){apply();show()});
  inp.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(pop.hidden)show();if(!items.length)return;e.preventDefault();act=(act+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
      items.forEach(function(x,i){x.classList.toggle('on',i===act)});inp.setAttribute('aria-activedescendant',items[act].id);items[act].scrollIntoView({block:'nearest'})}
    else if(e.key==='Enter'){e.preventDefault();if(act>=0)pick(items[act]);else{var f=pop.querySelector('[data-go]');if(f)pick(f);else hide()}}
    else if(e.key==='Escape'){if(!pop.hidden)hide();else{inp.value='';apply()}}
  });
  pop.addEventListener('mousedown',function(e){e.preventDefault()});
  pop.addEventListener('click',function(e){pick(e.target.closest('[role=option]'))});
  clr.addEventListener('click',function(){inp.value='';apply();inp.focus();show()});
  document.addEventListener('click',function(e){if(!box.contains(e.target))hide();if(e.target.closest('[data-filter]')){apply();if(!pop.hidden)render()}});
  apply();
})();
