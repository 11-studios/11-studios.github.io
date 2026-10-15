(()=>{
  let HERO_SRC='';

  const stylePortrait=img=>{
    const wrap=document.querySelector('.orbit-wrap');
    if(wrap){
      wrap.style.setProperty('background-image','none','important');
      wrap.style.setProperty('background','none','important');
      wrap.style.setProperty('overflow','visible','important');
    }
    img.removeAttribute('srcset');
    img.style.setProperty('display','block','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('opacity','1','important');
    img.style.setProperty('width','500px','important');
    img.style.setProperty('height','auto','important');
    img.style.setProperty('max-width','100%','important');
    img.style.setProperty('max-height','600px','important');
    img.style.setProperty('object-fit','contain','important');
    img.style.setProperty('object-position','center bottom','important');
    img.style.setProperty('border-radius','0','important');
    img.style.setProperty('background','transparent','important');
    img.style.setProperty('box-shadow','none','important');
    img.style.setProperty('animation','none','important');
    img.style.setProperty('filter','drop-shadow(0 12px 34px rgba(137,101,255,.14))','important');
  };

  const apply=()=>{
    const img=document.querySelector('.hero-portrait');
    if(!img || !HERO_SRC) return false;
    if(img.src!==HERO_SRC) img.src=HERO_SRC;
    stylePortrait(img);
    return true;
  };

  const load=async()=>{
    try{
      const parts=await Promise.all([1,2,3].map(i=>fetch(`assets/ataturk-parts/part${i}.txt?v=20261015-18`,{cache:'no-store'}).then(r=>{
        if(!r.ok) throw new Error(`part${i}: ${r.status}`);
        return r.text();
      })));
      HERO_SRC='data:image/png;base64,'+parts.join('').replace(/\s+/g,'');
      apply();
      const img=document.querySelector('.hero-portrait');
      if(img){
        const observer=new MutationObserver(()=>{
          if(HERO_SRC && img.src!==HERO_SRC) apply();
        });
        observer.observe(img,{attributes:true,attributeFilter:['src','srcset','style','class']});
        setTimeout(()=>observer.disconnect(),20000);
      }
    }catch(e){
      console.error('[11_ Studios] Atatürk portrait load failed',e);
    }
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load,{once:true});
  else load();
  window.addEventListener('load',()=>{if(HERO_SRC) apply();},{once:true});
})();
