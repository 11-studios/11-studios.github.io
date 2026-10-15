(()=>{
  const VERSION='20261015-20';
  const PORTRAIT_DATA=`assets/ataturk-final-inline.txt?v=${VERSION}`;

  const addStyle=(href,id)=>{
    if(id&&document.getElementById(id))return;
    const l=document.createElement('link');
    l.rel='stylesheet';l.href=href;if(id)l.id=id;document.head.appendChild(l);
  };
  const addScript=(src,onload)=>{
    const s=document.createElement('script');
    s.src=src;s.async=false;if(onload)s.addEventListener('load',onload,{once:true});document.head.appendChild(s);
  };

  const stylePortrait=img=>{
    const wrap=document.querySelector('.orbit-wrap');
    if(!img)return;
    img.removeAttribute('srcset');
    img.style.setProperty('display','block','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('opacity','1','important');
    img.style.setProperty('width','520px','important');
    img.style.setProperty('height','auto','important');
    img.style.setProperty('max-width','100%','important');
    img.style.setProperty('max-height','620px','important');
    img.style.setProperty('object-fit','contain','important');
    img.style.setProperty('object-position','center bottom','important');
    img.style.setProperty('border-radius','0','important');
    img.style.setProperty('background','transparent','important');
    img.style.setProperty('box-shadow','none','important');
    img.style.setProperty('animation','none','important');
    img.style.setProperty('filter','drop-shadow(0 14px 30px rgba(137,101,255,.10))','important');
    if(wrap){
      wrap.style.setProperty('background','none','important');
      wrap.style.setProperty('background-image','none','important');
      wrap.style.setProperty('overflow','visible','important');
    }
  };

  let portraitData='';
  const applyPortrait=()=>{
    const img=document.querySelector('.hero-portrait');
    if(!img)return false;
    stylePortrait(img);
    if(portraitData){
      const wanted=`data:image/webp;base64,${portraitData}`;
      if(img.src!==wanted)img.src=wanted;
      return true;
    }
    return false;
  };

  const loadPortrait=()=>fetch(PORTRAIT_DATA,{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error(`portrait ${r.status}`);return r.text();})
    .then(text=>{
      portraitData=String(text||'').replace(/\s+/g,'');
      if(!portraitData.startsWith('UklG'))throw new Error('invalid portrait data');
      applyPortrait();
      return portraitData;
    })
    .catch(err=>console.error('[11_ Studios] Ataturk portrait load failed',err));

  addStyle(`assets/site-enhancements.css?v=${VERSION}`,'siteEnhancementsCss');
  addStyle(`assets/plugin-files.css?v=${VERSION}`,'pluginFilesCss');
  addStyle(`assets/store-search.css?v=${VERSION}`,'storeSearchCss');

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{applyPortrait();loadPortrait();},{once:true});
  }else{
    applyPortrait();loadPortrait();
  }

  addScript(`assets/app-media.js?v=${VERSION}`,()=>{
    addScript(`assets/site-enhancements.js?v=${VERSION}`);
    addScript(`assets/plugin-files.js?v=${VERSION}`);
    addScript(`assets/store-search.js?v=${VERSION}`);
    applyPortrait();
  });

  window.addEventListener('load',applyPortrait,{once:true});
  setTimeout(applyPortrait,400);
  setTimeout(applyPortrait,1400);
})();
