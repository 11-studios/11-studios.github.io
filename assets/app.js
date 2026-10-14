(()=>{
  const app=document.createElement('script');
  app.src='assets/app-original.js?v=20261014-3';
  app.async=false;
  document.head.appendChild(app);

  const parts=[1,2,3,4,5,6].map(i=>
    fetch(`assets/hero-parts/part${i}.txt?v=20261014-3`,{cache:'force-cache'})
      .then(r=>{if(!r.ok) throw new Error(`hero part ${i}: ${r.status}`); return r.text();})
  );

  Promise.all(parts).then(chunks=>{
    const hero=document.querySelector('.orbit-wrap');
    if(!hero) return;
    const b64=chunks.join('').replace(/\s+/g,'');
    hero.style.setProperty('background-image',`url("data:image/webp;base64,${b64}")`,'important');
  }).catch(err=>console.error('[11_ Studios] Hero image load failed',err));
})();
