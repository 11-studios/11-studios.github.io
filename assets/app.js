(()=>{
  const loadParts=(base,count)=>Promise.all(
    Array.from({length:count},(_,i)=>
      fetch(`${base}/part${i+1}.txt?v=20261015-6`,{cache:'force-cache'})
        .then(r=>{if(!r.ok) throw new Error(`${base} part ${i+1}: ${r.status}`); return r.text();})
    )
  ).then(parts=>parts.join('').replace(/\s+/g,''));

  const heroPromise=loadParts('assets/final-wordmark',8);
  const faviconPromise=loadParts('assets/final-favicon',4);

  let heroData='';
  const installHero=()=>{
    if(!heroData) return;
    const eyebrow=document.querySelector('.eyebrow');
    if(!eyebrow) return;
    const existing=eyebrow.querySelector('.hero-wordmark-img');
    if(existing && existing.dataset.ready==='1') return;

    const img=document.createElement('img');
    img.className='hero-wordmark-img';
    img.alt='11_ Studios';
    img.dataset.ready='1';
    img.decoding='async';
    img.src=`data:image/png;base64,${heroData}`;
    eyebrow.style.removeProperty('background-image');
    eyebrow.setAttribute('aria-label','11_ Studios');
    eyebrow.replaceChildren(img);
  };

  faviconPromise.then(data=>{
    let favicon=document.querySelector('link[rel~="icon"]');
    if(!favicon){
      favicon=document.createElement('link');
      favicon.rel='icon';
      document.head.appendChild(favicon);
    }
    favicon.type='image/png';
    favicon.href=`data:image/png;base64,${data}`;
  }).catch(err=>console.error('[11_ Studios] favicon load failed',err));

  heroPromise.then(data=>{
    heroData=data;
    installHero();
    const eyebrow=document.querySelector('.eyebrow');
    if(eyebrow){
      const observer=new MutationObserver(()=>{
        if(!eyebrow.querySelector('.hero-wordmark-img')) queueMicrotask(installHero);
      });
      observer.observe(eyebrow,{childList:true,subtree:true,characterData:true});
    }
  }).catch(err=>console.error('[11_ Studios] hero wordmark load failed',err));

  const app=document.createElement('script');
  app.src='assets/app-original.js?v=20261015-6';
  app.async=false;
  app.addEventListener('load',installHero);
  document.head.appendChild(app);
})();
