/* AIProps: Meta Pixel con consentimiento previo, sin envio de datos personales. */
(function () {
  'use strict';
  const PIXEL_ID = '830304682058779';
  const STORAGE_KEY = 'aiprops_meta_tracking_consent_v1';
  let granted = false;
  let loaded = false;
  const pageIsSolution = /^\/soluciones\//.test(window.location.pathname);
  function loadPixel() {
    if (loaded || !granted) return;
    loaded = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    if (pageIsSolution) fbq('track', 'ViewContent', {content_type:'product',content_name:document.title});
  }
  function track(eventName) {
    if (granted && loaded && typeof window.fbq === 'function') window.fbq('track', eventName);
  }
  window.AIPropsMeta = {trackLead:()=>track('Lead'),trackContact:()=>track('Contact'),consentGranted:()=>granted};
  function css(){const s=document.createElement('style');s.textContent=`
  #aiprops-privacy-banner{position:fixed;z-index:20000;left:12px;right:12px;bottom:12px;max-width:680px;margin:auto;padding:18px 20px;border:1px solid #3d6a80;border-radius:16px;background:#071c30;color:#fff;box-shadow:0 15px 60px #000b;font:14px/1.5 system-ui,sans-serif}
  #aiprops-privacy-banner[hidden]{display:none!important}
  #aiprops-privacy-banner p{margin:7px 0 14px;color:#d2e4f0;font-size:14px;line-height:1.5}
  #aiprops-privacy-banner a{color:#7be6f2;text-decoration:underline}
  .aiprops-privacy-controls{display:flex;flex-wrap:wrap;gap:10px}
  .aiprops-privacy-controls button{min-height:44px;padding:10px 15px;border-radius:10px;font-weight:700;cursor:pointer;border:1px solid #4e7187;color:white;background:#14324c}
  .aiprops-privacy-controls button.accept{background:#ff7820;border-color:#ff7820;color:#071422}
  #aiprops-privacy-reopen{position:fixed;z-index:20000;left:10px;bottom:10px;border:1px solid #567489;border-radius:10px;padding:7px 11px;background:#092338;color:#d7edf4;font-size:12px;cursor:pointer}
  @media(max-width:640px){#aiprops-privacy-banner{bottom:80px;left:8px;right:8px;padding:14px}#aiprops-privacy-reopen{bottom:75px}}
  `;document.head.append(s);}
  function interfaceReady(){
    css();
    const banner=document.createElement('aside');banner.id='aiprops-privacy-banner';banner.setAttribute('role','dialog');banner.setAttribute('aria-label','Preferencias de privacidad');banner.hidden=true;
    banner.innerHTML='<strong>Tu privacidad importa</strong><p>Utilizamos seguimiento publicitario de Meta solo con tu permiso, para medir visitas y solicitudes. Puedes rechazarlo sin afectar el formulario ni el resto del sitio. <a href="/politica-de-privacidad/" target="_blank" rel="noopener">Política de privacidad</a>.</p><div class="aiprops-privacy-controls"><button type="button" data-choice="reject">Rechazar</button><button type="button" class="accept" data-choice="accept">Aceptar seguimiento</button></div>';
    document.body.append(banner);
    const reopen=document.createElement('button');reopen.type='button';reopen.id='aiprops-privacy-reopen';reopen.textContent='Privacidad';reopen.setAttribute('aria-label','Cambiar preferencias de privacidad');document.body.append(reopen);
    const choice=localStorage.getItem(STORAGE_KEY);
    granted=choice==='accept';
    if (granted) loadPixel();
    if (choice!=='accept'&&choice!=='reject') banner.hidden=false;
    banner.querySelectorAll('button[data-choice]').forEach(b=>b.addEventListener('click',()=>{
      const value=b.dataset.choice;
      localStorage.setItem(STORAGE_KEY,value);
      banner.hidden=true;
      if(value==='accept'){granted=true;loadPixel()}
      else {granted=false; if(loaded){window.location.reload();}}
    }));
    reopen.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('button').focus()});
    document.addEventListener('click',ev=>{const link=ev.target.closest('a[href="#agenda"],a[href*="wa.me/"]');if(link)track('Contact')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',interfaceReady);else interfaceReady();
})();
