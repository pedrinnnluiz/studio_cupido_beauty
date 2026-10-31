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
  }
  document.addEventListener('click',function(e){var t=e.target.closest('[data-hero-tab]');if(t)heroMode(t.getAttribute('data-hero-tab'))});

  /* ---------- filtro do catálogo ---------- */
  function filter(k){
    var bs=document.querySelectorAll('[data-filter]');if(!bs.length)return;
    bs.forEach(function(b){var on=b.getAttribute('data-filter')===k;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
    document.querySelectorAll('[data-area]').forEach(function(s){s.hidden=!(k==='all'||s.getAttribute('data-area')===k)});ftTheme(k==='feminino');
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
