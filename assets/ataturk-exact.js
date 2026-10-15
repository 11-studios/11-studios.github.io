(()=>{
  const HERO_SRC='assets/ataturk-hero-new.png?v=20261015-16';

  const apply=()=>{
    const img=document.querySelector('.hero-portrait');
    const wrap=document.querySelector('.orbit-wrap');
    if(wrap){
      wrap.style.setProperty('background-image','none','important');
      wrap.style.setProperty('background','none','important');
    }
    if(!img) return false;

    if(img.getAttribute('src')!==HERO_SRC) img.setAttribute('src',HERO_SRC);
    img.removeAttribute('srcset');
    img.style.setProperty('display','block','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('opacity','1','important');
    img.style.setProperty('width','390px','important');
    img.style.setProperty('height','390px','important');
    img.style.setProperty('max-width','100%','important');
    img.style.setProperty('object-fit','cover','important');
    img.style.setProperty('object-position','center center','important');
    img.style.setProperty('border-radius','24px','important');
    img.style.setProperty('animation','none','important');
    img.style.setProperty('filter','drop-shadow(0 0 34px rgba(137,101,255,.18))','important');
    return true;
  };

  const watch=()=>{
    const img=document.querySelector('.hero-portrait');
    if(!img) return;
    const observer=new MutationObserver(()=>{
      if(img.getAttribute('src')!==HERO_SRC) apply();
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
