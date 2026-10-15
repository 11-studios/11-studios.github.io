(()=>{
  const HERO_SRC='assets/ataturk-hero-new.png?v=20261015-17';

  const apply=()=>{
    const img=document.querySelector('.hero-portrait');
    const wrap=document.querySelector('.orbit-wrap');
    if(wrap){
      wrap.style.setProperty('background-image','none','important');
      wrap.style.setProperty('background','none','important');
      wrap.style.setProperty('overflow','visible','important');
    }
    if(!img) return false;

    if(img.getAttribute('src')!==HERO_SRC) img.setAttribute('src',HERO_SRC);
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
    return true;
  };

  const watch=()=>{
    const img=document.querySelector('.hero-portrait');
    if(!img) return;
    const observer=new MutationObserver(()=>{
      if(img.getAttribute('src')!==HERO_SRC || img.style.borderRadius!=='0px') apply();
    });
    observer.observe(img,{attributes:true,attributeFilter:['src','srcset','style','class']});
    setTimeout(()=>observer.disconnect(),15000);
  };

  const init=()=>{apply();watch();};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.addEventListener('load',apply,{once:true});
  setTimeout(apply,500);
  setTimeout(apply,1500);
  setTimeout(apply,3500);
})();
