'use strict';
(()=>{
 document.documentElement.classList.add('js');
 const CFG=window.ATELIER_CONFIG,D=window.ATELIER_DEFAULT,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const RM=matchMedia('(prefers-reduced-motion: reduce)'),FINE=matchMedia('(hover:hover) and (pointer:fine)'),MOBILE=matchMedia('(max-width:760px)');
 const el=(tag,text,cls)=>{let e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
 const safe=(value,image=false)=>{try{let u=new URL(value,location.href);if(image)return (u.origin===location.origin&&u.pathname.includes('/assets/'))||(u.origin===CFG.url&&u.pathname.startsWith('/storage/v1/object/public/'+CFG.bucket+'/'))?u.href:null;return u.protocol==='https:'?u.href:null}catch{return null}};
 const SVC_IMG=['vidange','entretien','pont-elevateur','outils'];
 const ICONS=['M32 5C30 16 13 31 13 41a19 19 0 0 0 38 0C51 30 34 15 32 5ZM22 41Q22 51 32 51M9 59H55','M21 8L27 19 23 30 14 35 8 28Q5 43 18 47L40 59 49 51 36 31Q45 21 34 10L32 23 23 23Z'];
 let io;
 function splitHeadline(){const h=$('h1[data-bind="headline"]');const lines=h.textContent.split('\n').filter(Boolean);h.setAttribute('aria-label',lines.join(' '));h.replaceChildren(...lines.map(t=>{let l=el('span',undefined,'line'),i=el('span',t);i.setAttribute('aria-hidden','true');l.append(i);return l}))}
 function mins(t){let m=/^(\d{1,2}):(\d{2})$/.exec(t||'');return m?(+m[1])*60+(+m[2]):null}
 function render(raw){const c={...D,...raw};document.title='Démo indépendante — '+c.name+' '+c.city;$$('[data-bind]').forEach(e=>e.textContent=String(c[e.dataset.bind]||''));
  splitHeadline();
  const p=/^\+?\d[\d ()-]{5,20}$/.test(c.phone||'')?c.phone:null;$$('.phone-link').forEach(a=>{a.hidden=!p;if(p)a.href='tel:'+p.replace(/[^+\d]/g,'')});if(p)$('#phoneText').textContent=p.startsWith('+213')?'0'+p.slice(4).replace(/(\d{3})(\d{2})(\d{2})(\d{2})/,'$1 $2 $3 $4'):p;
  phone=p?p.replace(/[^+\d]/g,''):null;
  for(const [cls,v]of [['maps-link',c.maps],['facebook-link',c.facebook]])$$('.'+cls).forEach(a=>{let u=v&&safe(v);a.hidden=!u;if(u)a.href=u});
  let mail=$('#emailLink');mail.hidden=!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email||'');if(!mail.hidden){mail.href='mailto:'+c.email;mail.textContent=c.email}
  const services=(Array.isArray(c.services)?c.services:[]).filter(s=>s.enabled).slice(0,8);
  $('#servicesGrid').replaceChildren();services.forEach((s,i)=>{let a=el('article',undefined,'service-card reveal');a.style.setProperty('--d',(i%2)*0.12+'s');
   let box=el('div',undefined,'svc-img'),im=el('img'),n=SVC_IMG[i%SVC_IMG.length];im.src='assets/img/'+n+'-800.webp';im.srcset='assets/img/'+n+'-800.webp 800w, assets/img/'+n+'.webp 1600w';im.sizes='(max-width:760px) 92vw, 46vw';im.alt='';im.loading='lazy';im.width=800;im.height=533;box.append(im);
   a.append(box,el('span',String(i+1).padStart(2,'0'),'service-number'));let svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 64 64');svg.classList.add('service-icon');svg.setAttribute('aria-hidden','true');let path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',ICONS[i%2]);svg.append(path);a.append(svg,el('h3',s.title),el('p',s.text),el('span','Photo d’illustration · pas l’atelier','svc-tag'));$('#servicesGrid').append(a)});
  const sel=$('#quoteService');sel.replaceChildren(...services.map(s=>el('option',s.title)),el('option','Autre besoin'));
  const hours=(Array.isArray(c.hours)?c.hours:[]).slice(0,7),today=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][new Date().getDay()];
  $('#hours').replaceChildren();hours.forEach(d=>{let r=el('div',undefined,'hour-row'+(d.day===today?' today':''));r.append(el('span',d.day+(d.day===today?' · aujourd’hui':'')),el('span',d.closed?'Fermé':d.open+' — '+d.close));$('#hours').append(r)});
  const open=hours.filter(d=>!d.closed),durs=open.map(d=>(mins(d.close)-mins(d.open))/60).filter(x=>x>0);
  setStat('#statDays',open.length);setStat('#statHours',durs.length&&durs.every(x=>x===durs[0])?durs[0]:null);setStat('#statServices',services.length);
  const f=open[0];if(f)$('#statHours').nextElementSibling.replaceChildren('heures par jour',el('br'),'('+f.open+' — '+f.close+')*');
  let photos=(Array.isArray(c.photos)?c.photos:[]).filter(p=>p.rights&&safe(p.url,true)).slice(0,12);$('#galerie').hidden=!photos.length;$('#galleryGrid').replaceChildren();photos.forEach((p,i)=>{let f=el('figure',undefined,'reveal'),im=el('img');f.style.setProperty('--d',(i%3)*0.1+'s');im.src=safe(p.url,true);im.alt=p.caption||'Photographie de l’atelier';im.loading='lazy';im.width=800;im.height=600;f.append(im,el('figcaption',[p.caption,p.credit].filter(Boolean).join(' — ')));$('#galleryGrid').append(f)});
  observe();
 }
 function setStat(sel,v){const b=$(sel);if(!b)return;const box=b.closest('.stat');box.hidden=!(v>0);if(v>0){b.dataset.to=String(v);if(b.dataset.done)b.textContent=String(v)}}
 let phone='+213549762446';

 /* reveal + counters */
 function countUp(b){const to=+b.dataset.to||0;b.dataset.done='1';if(RM.matches||document.body.classList.contains('paused')){b.textContent=String(to);return}const t0=performance.now(),dur=1400;const step=t=>{let k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);b.textContent=String(Math.round(to*e));if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
 function observe(){
  if(!('IntersectionObserver' in window)){$$('.reveal,.draw,.steps,.service-card').forEach(e=>e.classList.add('in'));$$('.count').forEach(countUp);return}
  io=io||new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');t.querySelectorAll?.('.count').forEach(b=>{if(!b.dataset.done)countUp(b)});if(t.classList.contains('count')&&!t.dataset.done)countUp(t);io.unobserve(t)}),{rootMargin:'0px 0px -12% 0px',threshold:.12});
  $$('.reveal:not(.in),.draw:not(.in),.steps:not(.in),.stat').forEach((e,i)=>{if(!e.style.getPropertyValue('--d')&&e.classList.contains('reveal')){const sib=[...e.parentElement.children].filter(x=>x.classList.contains('reveal'));e.style.setProperty('--d',Math.min(sib.indexOf(e),5)*0.09+'s')}io.observe(e)});
 }

 /* scroll: header, progress, parallax, mobile bar */
 const header=$('.site-header'),prog=$('.progress i'),bar=$('.mobile-bar'),hero=$('.hero');let ticking=false,px=[];
 function collect(){px=$$('[data-parallax]').map(e=>({e,f:+e.dataset.parallax,box:e.closest('section,figure')||e.parentElement}))}
 function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('scrolled',y>30);prog.style.setProperty('--p',h>0?(y/h).toFixed(4):'0');
   if(RM.matches||document.body.classList.contains('paused'))return;const k=MOBILE.matches?0.5:1;
   for(const p of px){const r=p.box.getBoundingClientRect();if(r.bottom<-100||r.top>innerHeight+100)continue;const off=(r.top+r.height/2-innerHeight/2)*p.f*k;p.e.style.transform='translate3d(0,'+(-off).toFixed(1)+'px,0)'}
 })}
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});

 /* magnetic + ripple */
 function interactions(){$$('.magnetic').forEach(b=>{b.addEventListener('pointermove',e=>{if(!FINE.matches||RM.matches)return;const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px)'});b.addEventListener('pointerleave',()=>b.style.transform='')});
  $$('.btn,.mobile-bar a').forEach(b=>b.addEventListener('pointerdown',e=>{if(RM.matches)return;const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2.2,i=el('span',undefined,'ripple');i.style.width=i.style.height=s+'px';i.style.left=(e.clientX-r.left-s/2)+'px';i.style.top=(e.clientY-r.top-s/2)+'px';b.append(i);setTimeout(()=>i.remove(),700)}))}

 /* quote form → SMS (nothing stored or sent by the site) */
 function quoteText(f){const d=new FormData(f);return ['Bonjour, demande de devis :','Prénom : '+d.get('nom'),'Véhicule : '+d.get('vehicule'),'Prestation : '+d.get('prestation'),d.get('km')?'Kilométrage : '+d.get('km'):'',d.get('message')?'Besoin : '+d.get('message'):''].filter(Boolean).join('\n')}
 function valid(f){let ok=true;f.querySelectorAll('[required]').forEach(i=>{const bad=!i.value.trim();i.setAttribute('aria-invalid',String(bad));if(bad)ok=false});if(!ok)$('#quoteStatus').textContent='Merci d’indiquer votre prénom et votre véhicule.';return ok}
 const qf=$('#quoteForm');qf.addEventListener('submit',e=>{e.preventDefault();if(!valid(qf))return;if(!phone){$('#quoteStatus').textContent='Numéro de l’atelier indisponible.';return}const sep=/iPhone|iPad|Mac/.test(navigator.userAgent)?'&':'?';$('#quoteStatus').textContent='Votre application SMS s’ouvre : vérifiez le message puis envoyez-le.';location.href='sms:'+phone+sep+'body='+encodeURIComponent(quoteText(qf))});
 $('#quoteCopy').addEventListener('click',async()=>{if(!valid(qf))return;try{await navigator.clipboard.writeText(quoteText(qf));$('#quoteStatus').textContent='Message copié. Collez-le dans un SMS ou lisez-le au téléphone.'}catch{$('#quoteStatus').textContent='Copie impossible sur cet appareil.'}});

 render(D);collect();interactions();onScroll();
 const heroImg=$('.hero-media img'),go=()=>requestAnimationFrame(()=>{document.body.classList.add('loaded');setTimeout(()=>bar.classList.add('show'),900)});if(heroImg.complete)go();else{heroImg.addEventListener('load',go,{once:true});setTimeout(go,1200)}
 if(new URLSearchParams(location.search).get('preview')==='1'){$('#previewNote').hidden=false;$('#syncState').textContent='Aperçu non enregistré';window.addEventListener('message',e=>{if(e.source===window.opener&&e.origin===location.origin&&e.data?.type==='atelier-preview')render(e.data.content)});window.opener?.postMessage({type:'atelier-preview-ready'},location.origin)}
 else{fetch(CFG.url+'/rest/v1/'+CFG.table+'?id=eq.main&select=content,revision',{headers:{apikey:CFG.key},signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(rows=>{if(!rows[0]?.content)throw Error();render(rows[0].content);$('#syncState').textContent='Contenu synchronisé · version '+rows[0].revision}).catch(()=>{$('#syncState').textContent='Version locale · dernières modifications non chargées';$('#syncState').classList.add('offline')})}
 let paused=RM.matches;function motion(v){paused=v;document.body.classList.toggle('paused',v);$('#motionToggle').textContent=v?'Activer les animations':'Mettre en pause les animations';$('#motionToggle').setAttribute('aria-pressed',String(v))}motion(paused);$('#motionToggle').addEventListener('click',()=>motion(!paused));document.addEventListener('visibilitychange',()=>document.body.classList.toggle('paused',document.hidden||paused));
})();
