(()=>{
  const loadParts=(base,count)=>Promise.all(
    Array.from({length:count},(_,i)=>
      fetch(`${base}/part${i+1}.txt?v=20261015-7`,{cache:'force-cache'})
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

  const installFooterCredit=()=>{
    const footer=document.querySelector('.footer');
    if(!footer || footer.querySelector('.made-by-sems')) return;
    const credit=document.createElement('div');
    credit.className='made-by-sems';
    credit.textContent='made by sems11_';
    footer.appendChild(credit);
  };

  const installVideoUI=()=>{
    const pUrl=document.getElementById('pUrl');
    if(pUrl && !document.getElementById('pVideo')){
      const field=document.createElement('div');
      field.className='field';
      field.innerHTML='<label id="pVideoLabel" for="pVideo">Tanıtım videosu</label><input id="pVideo" type="url" maxlength="700" inputmode="url" placeholder="YouTube, Vimeo veya direkt video linki">';
      pUrl.closest('.field')?.insertAdjacentElement('afterend',field);
    }

    const detailGrid=document.querySelector('.plugin-detail-content .detail-grid');
    if(detailGrid && !document.getElementById('detailVideoPanel')){
      const panel=document.createElement('section');
      panel.className='detail-panel detail-video-panel';
      panel.id='detailVideoPanel';
      panel.hidden=true;
      panel.innerHTML=`
        <h3 id="detailVideoTitle">Tanıtım videosu</h3>
        <div class="plugin-video-shell">
          <iframe id="detailVideoFrame" class="plugin-video-frame" title="Plugin videosu" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen hidden></iframe>
          <video id="detailVideoFile" class="plugin-video-file" controls playsinline preload="metadata" hidden></video>
          <a id="detailVideoLink" class="btn purple plugin-video-link" target="_blank" rel="noopener noreferrer" hidden>Videoyu aç</a>
        </div>`;
      detailGrid.insertAdjacentElement('afterend',panel);
    }
  };

  const setVideoLabels=()=>{
    const en=document.getElementById('languageSelect')?.value==='en';
    const label=document.getElementById('pVideoLabel');
    const input=document.getElementById('pVideo');
    const title=document.getElementById('detailVideoTitle');
    const link=document.getElementById('detailVideoLink');
    if(label) label.textContent=en?'Promo video':'Tanıtım videosu';
    if(input) input.placeholder=en?'YouTube, Vimeo or direct video URL':'YouTube, Vimeo veya direkt video linki';
    if(title) title.textContent=en?'Promo video':'Tanıtım videosu';
    if(link) link.textContent=en?'Open video':'Videoyu aç';
  };

  const parseVideoUrl=value=>{
    const raw=String(value||'').trim();
    if(!raw) return null;
    let u;
    try{u=new URL(raw,location.href);}catch{return null;}
    if(u.protocol!=='https:'&&u.protocol!=='http:') return null;
    const host=u.hostname.toLowerCase().replace(/^www\./,'');
    let id='';

    if(host==='youtu.be') id=u.pathname.split('/').filter(Boolean)[0]||'';
    if(host==='youtube.com'||host.endsWith('.youtube.com')){
      if(u.pathname==='/watch') id=u.searchParams.get('v')||'';
      else{
        const m=u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/);
        if(m) id=m[1];
      }
    }
    if(id && /^[A-Za-z0-9_-]{6,}$/.test(id)){
      return {type:'iframe',src:`https://www.youtube-nocookie.com/embed/${id}`};
    }

    if(host==='vimeo.com'||host.endsWith('.vimeo.com')){
      const m=u.pathname.match(/\/(\d{5,})/);
      if(m) return {type:'iframe',src:`https://player.vimeo.com/video/${m[1]}`};
    }

    if(/\.(mp4|webm|ogg)(?:$)/i.test(u.pathname)) return {type:'video',src:u.href};
    return {type:'link',src:u.href};
  };

  const renderVideoForPlugin=p=>{
    const panel=document.getElementById('detailVideoPanel');
    const frame=document.getElementById('detailVideoFrame');
    const video=document.getElementById('detailVideoFile');
    const link=document.getElementById('detailVideoLink');
    if(!panel||!frame||!video||!link) return;

    frame.hidden=true; frame.removeAttribute('src');
    video.hidden=true; video.pause(); video.removeAttribute('src'); video.load();
    link.hidden=true; link.removeAttribute('href');

    const info=parseVideoUrl(p?.video);
    panel.hidden=!info;
    if(!info) return;

    if(info.type==='iframe'){
      frame.src=info.src;
      frame.hidden=false;
    }else if(info.type==='video'){
      video.src=info.src;
      video.hidden=false;
    }else{
      link.href=info.src;
      link.hidden=false;
    }
  };

  installFooterCredit();
  installVideoUI();
  setVideoLabels();

  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(setVideoLabels,0));

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
  app.src='assets/app-original.js?v=20261015-7';
  app.async=false;
  app.addEventListener('load',()=>{
    installHero();
    installFooterCredit();
    installVideoUI();
    setVideoLabels();

    try{
      const baseRenderPluginDetail=renderPluginDetail;
      renderPluginDetail=function(id){
        baseRenderPluginDetail(id);
        const p=plugins.find(x=>x.id===id);
        renderVideoForPlugin(p);
      };
      window.renderPluginDetail=renderPluginDetail;

      const baseEditPlugin=editPlugin;
      editPlugin=function(id){
        baseEditPlugin(id);
        const p=plugins.find(x=>x.id===id);
        const input=document.getElementById('pVideo');
        if(input) input.value=p?.video||'';
      };
      window.editPlugin=editPlugin;

      const form=document.getElementById('pluginForm');
      form?.addEventListener('submit',e=>{
        if(!session?.admin) return;
        e.preventDefault();
        e.stopImmediatePropagation();

        const id=(document.getElementById('editId').value||'p'+Date.now()).replace(/[^a-zA-Z0-9_-]/g,'');
        const rawUrl=document.getElementById('pUrl').value.trim();
        const rawVideo=document.getElementById('pVideo')?.value.trim()||'';
        if(rawUrl&&!safeExternalUrl(rawUrl)){toast(t('urlProtocol'));return;}
        if(rawVideo&&!safeExternalUrl(rawVideo)){
          toast(document.getElementById('languageSelect')?.value==='en'?'Video URL must start with http:// or https://.':'Video linki http:// veya https:// ile başlamalı.');
          return;
        }

        const rawPrice=Number(document.getElementById('pPrice').value||0);
        const obj={
          id,
          name:document.getElementById('pName').value.trim().slice(0,60),
          version:document.getElementById('pVersion').value.trim().slice(0,24),
          category:document.getElementById('pCategory').value,
          price:Number.isFinite(rawPrice)&&rawPrice>=0?rawPrice:0,
          desc:document.getElementById('pDesc').value.trim().slice(0,500),
          url:rawUrl,
          video:rawVideo.slice(0,700),
          icon:document.getElementById('pIcon').value
        };
        const idx=plugins.findIndex(x=>x.id===id);
        if(idx>=0) plugins[idx]=obj; else plugins.unshift(obj);
        savePlugins();
        renderPlugins();
        clearPluginForm();
        toast(idx>=0?t('pluginUpdated'):t('pluginAdded'));
      },true);
    }catch(err){
      console.error('[11_ Studios] video integration failed',err);
    }
  });
  document.head.appendChild(app);
})();
