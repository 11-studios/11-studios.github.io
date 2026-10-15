(()=>{
  let favicon=document.querySelector('link[rel~="icon"]');
  if(!favicon){
    favicon=document.createElement('link');
    favicon.rel='icon';
    document.head.appendChild(favicon);
  }
  favicon.type='image/png';
  favicon.href='assets/site-icon.png?v=20261015-2';

  const app=document.createElement('script');
  app.src='assets/app-original.js?v=20261015-2';
  app.async=false;
  document.head.appendChild(app);

  const chunks=[1,2,3,4,5].map(i=>
    fetch(`assets/wordmark-hq/part${i}.txt?v=20261015-2`,{cache:'force-cache'})
      .then(r=>{if(!r.ok) throw new Error(`wordmark part ${i}: ${r.status}`); return r.text();})
  );

  Promise.all(chunks).then(parts=>{
    const wordmark=document.querySelector('.eyebrow');
    if(!wordmark) return;
    const b64=parts.join('').replace(/\s+/g,'');
    wordmark.style.setProperty('background-image',`url("data:image/webp;base64,${b64}")`,'important');
  }).catch(err=>console.error('[11_ Studios] HQ wordmark load failed',err));
})();
