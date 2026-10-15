(()=>{
  const apply=async()=>{
    const img=document.querySelector('.hero-portrait');
    const wrap=document.querySelector('.orbit-wrap');
    if(wrap) wrap.style.setProperty('background-image','none','important');
    if(!img) return false;
    try{
      const r=await fetch('assets/ataturk-exact-384.txt?v=20261015-15',{cache:'no-store'});
      if(!r.ok) throw new Error('image data '+r.status);
      const data=(await r.text()).replace(/\s+/g,'');
      img.src='data:image/png;base64,'+data;
      img.removeAttribute('srcset');
      img.style.objectFit='cover';
      img.style.borderRadius='28px';
      img.style.width='360px';
      img.style.height='360px';
      img.style.animation='none';
      img.style.filter='drop-shadow(0 0 36px rgba(137,101,255,.20))';
      return true;
    }catch(e){console.error('[11_ Studios] Ataturk image load failed',e);return false;}
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
  window.addEventListener('load',apply,{once:true});
})();
