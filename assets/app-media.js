(()=>{
  const loadParts=(base,count)=>Promise.all(
    Array.from({length:count},(_,i)=>
      fetch(`${base}/part${i+1}.txt?v=20261015-8`,{cache:'force-cache'})
        .then(r=>{if(!r.ok) throw new Error(`${base} part ${i+1}: ${r.status}`); return r.text();})
    )
  ).then(parts=>parts.join('').replace(/\s+/g,''));

  const heroPromise=loadParts('assets/final-wordmark',8);
  const faviconPromise=loadParts('assets/final-favicon',4);

  let heroData='';
  let pendingImageData='';
  let pendingImagePromise=Promise.resolve('');

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

  const installMediaUI=()=>{
    const pUrl=document.getElementById('pUrl');
    if(pUrl && !document.getElementById('pImage')){
      const imageField=document.createElement('div');
      imageField.className='field plugin-image-field';
      imageField.innerHTML=`
        <label id="pImageLabel" for="pImage">Ürün fotoğrafı</label>
        <input id="pImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
        <div id="pImagePreviewWrap" class="plugin-image-preview-wrap" hidden>
          <img id="pImagePreview" class="plugin-image-preview" alt="Ürün fotoğrafı önizleme">
          <button id="pImageRemove" class="btn small ghost" type="button">Fotoğrafı kaldır</button>
        </div>`;
      pUrl.closest('.field')?.insertAdjacentElement('afterend',imageField);
    }

    if(pUrl && !document.getElementById('pVideo')){
      const field=document.createElement('div');
      field.className='field';
      field.innerHTML='<label id="pVideoLabel" for="pVideo">Tanıtım videosu</label><input id="pVideo" type="url" maxlength="700" inputmode="url" placeholder="YouTube, Vimeo veya direkt video linki">';
      const imageField=document.querySelector('.plugin-image-field');
      (imageField||pUrl.closest('.field'))?.insertAdjacentElement('afterend',field);
    }

    const detailGrid=document.querySelector('.plugin-detail-content .detail-grid');
    if(detailGrid && !document.getElementById('detailImagePanel')){
      const panel=document.createElement('section');
      panel.className='detail-panel detail-image-panel';
      panel.id='detailImagePanel';
      panel.hidden=true;
      panel.innerHTML='<img id="detailProductImage" class="detail-product-image" alt="Plugin görseli">';
      detailGrid.insertAdjacentElement('beforebegin',panel);
    }

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

  const setMediaLabels=()=>{
    const en=document.getElementById('languageSelect')?.value==='en';
    const imageLabel=document.getElementById('pImageLabel');
    const imageRemove=document.getElementById('pImageRemove');
    const videoLabel=document.getElementById('pVideoLabel');
    const videoInput=document.getElementById('pVideo');
    const videoTitle=document.getElementById('detailVideoTitle');
    const videoLink=document.getElementById('detailVideoLink');
    if(imageLabel) imageLabel.textContent=en?'Product image':'Ürün fotoğrafı';
    if(imageRemove) imageRemove.textContent=en?'Remove image':'Fotoğrafı kaldır';
    if(videoLabel) videoLabel.textContent=en?'Promo video':'Tanıtım videosu';
    if(videoInput) videoInput.placeholder=en?'YouTube, Vimeo or direct video URL':'YouTube, Vimeo veya direkt video linki';
    if(videoTitle) videoTitle.textContent=en?'Promo video':'Tanıtım videosu';
    if(videoLink) videoLink.textContent=en?'Open video':'Videoyu aç';
  };

  const setImagePreview=data=>{
    const wrap=document.getElementById('pImagePreviewWrap');
    const img=document.getElementById('pImagePreview');
    if(!wrap||!img) return;
    if(data){img.src=data;wrap.hidden=false;}
    else{img.removeAttribute('src');wrap.hidden=true;}
  };

  const compressImage=file=>new Promise((resolve,reject)=>{
    if(!file || !file.type.startsWith('image/')) return reject(new Error('invalid-image'));
    if(file.size>12*1024*1024) return reject(new Error('too-large'));
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error('read-failed'));
    reader.onload=()=>{
      const img=new Image();
      img.onerror=()=>reject(new Error('decode-failed'));
      img.onload=()=>{
        const maxW=1400,maxH=900;
        const scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight);
        const w=Math.max(1,Math.round(img.naturalWidth*scale));
        const h=Math.max(1,Math.round(img.naturalHeight*scale));
        const canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        const ctx=canvas.getContext('2d',{alpha:true});
        ctx.imageSmoothingEnabled=true;
        ctx.imageSmoothingQuality='high';
        ctx.drawImage(img,0,0,w,h);
        let data=canvas.toDataURL('image/webp',.84);
        if(!data.startsWith('data:image/webp')) data=canvas.toDataURL('image/jpeg',.84);
        resolve(data);
      };
      img.src=String(reader.result||'');
    };
    reader.readAsDataURL(file);
  });

  const bindImageInput=()=>{
    const input=document.getElementById('pImage');
    if(!input || input.dataset.bound==='1') return;
    input.dataset.bound='1';
    input.addEventListener('change',()=>{
      const file=input.files?.[0];
      if(!file) return;
      const save=document.getElementById('savePluginBtn');
      if(save) save.disabled=true;
      pendingImagePromise=compressImage(file).then(data=>{
        pendingImageData=data;
        setImagePreview(data);
        return data;
      }).catch(err=>{
        input.value='';
        const en=document.getElementById('languageSelect')?.value==='en';
        if(typeof toast==='function') toast(err.message==='too-large'?(en?'Image must be smaller than 12 MB.':'Fotoğraf 12 MB’dan küçük olmalı.'):(en?'Image could not be processed.':'Fotoğraf işlenemedi.'));
        return pendingImageData;
      }).finally(()=>{if(save) save.disabled=false;});
    });
    document.getElementById('pImageRemove')?.addEventListener('click',()=>{
      pendingImageData='';
      pendingImagePromise=Promise.resolve('');
      input.value='';
      setImagePreview('');
    });
  };

  const parseVideoUrl=value=>{
    const raw=String(value||'').trim();
    if(!raw) return null;
    let u;try{u=new URL(raw,location.href);}catch{return null;}
    if(u.protocol!=='https:'&&u.protocol!=='http:') return null;
    const host=u.hostname.toLowerCase().replace(/^www\./,'');
    let id='';
    if(host==='youtu.be') id=u.pathname.split('/').filter(Boolean)[0]||'';
    if(host==='youtube.com'||host.endsWith('.youtube.com')){
      if(u.pathname==='/watch') id=u.searchParams.get('v')||'';
      else{const m=u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/);if(m) id=m[1];}
    }
    if(id && /^[A-Za-z0-9_-]{6,}$/.test(id)) return {type:'iframe',src:`https://www.youtube-nocookie.com/embed/${id}`};
    if(host==='vimeo.com'||host.endsWith('.vimeo.com')){const m=u.pathname.match(/\/(\d{5,})/);if(m) return {type:'iframe',src:`https://player.vimeo.com/video/${m[1]}`};}
    if(/\.(mp4|webm|ogg)$/i.test(u.pathname)) return {type:'video',src:u.href};
    return {type:'link',src:u.href};
  };

  const renderVideoForPlugin=p=>{
    const panel=document.getElementById('detailVideoPanel');
    const frame=document.getElementById('detailVideoFrame');
    const video=document.getElementById('detailVideoFile');
    const link=document.getElementById('detailVideoLink');
    if(!panel||!frame||!video||!link) return;
    frame.hidden=true;frame.removeAttribute('src');
    video.hidden=true;video.pause();video.removeAttribute('src');video.load();
    link.hidden=true;link.removeAttribute('href');
    const info=parseVideoUrl(p?.video);panel.hidden=!info;if(!info)return;
    if(info.type==='iframe'){frame.src=info.src;frame.hidden=false;}
    else if(info.type==='video'){video.src=info.src;video.hidden=false;}
    else{link.href=info.src;link.hidden=false;}
  };

  const renderImageForPlugin=p=>{
    const panel=document.getElementById('detailImagePanel');
    const img=document.getElementById('detailProductImage');
    if(!panel||!img) return;
    const data=typeof p?.image==='string'&&p.image.startsWith('data:image/')?p.image:'';
    panel.hidden=!data;
    if(data) img.src=data; else img.removeAttribute('src');
  };

  const decoratePluginCards=()=>{
    document.querySelectorAll('.plugin-card').forEach(card=>{
      card.querySelector('.plugin-cover')?.remove();
      const button=[...card.querySelectorAll('[onclick]')].find(el=>String(el.getAttribute('onclick')||'').includes('openPlugin('));
      const m=String(button?.getAttribute('onclick')||'').match(/openPlugin\(['\"]([^'\"]+)['\"]\)/);
      if(!m) return;
      const p=plugins.find(x=>x.id===m[1]);
      if(!p?.image || !String(p.image).startsWith('data:image/')) return;
      const cover=document.createElement('div');
      cover.className='plugin-cover';
      const img=document.createElement('img');
      img.src=p.image;img.alt=`${p.name} görseli`;img.loading='lazy';
      cover.appendChild(img);
      card.prepend(cover);
    });
  };

  installFooterCredit();installMediaUI();setMediaLabels();bindImageInput();
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(setMediaLabels,0));

  faviconPromise.then(data=>{
    let favicon=document.querySelector('link[rel~="icon"]');
    if(!favicon){favicon=document.createElement('link');favicon.rel='icon';document.head.appendChild(favicon);}
    favicon.type='image/png';favicon.href=`data:image/png;base64,${data}`;
  }).catch(err=>console.error('[11_ Studios] favicon load failed',err));

  heroPromise.then(data=>{
    heroData=data;installHero();
    const eyebrow=document.querySelector('.eyebrow');
    if(eyebrow){const observer=new MutationObserver(()=>{if(!eyebrow.querySelector('.hero-wordmark-img'))queueMicrotask(installHero);});observer.observe(eyebrow,{childList:true,subtree:true,characterData:true});}
  }).catch(err=>console.error('[11_ Studios] hero wordmark load failed',err));

  const app=document.createElement('script');
  app.src='assets/app-original.js?v=20261015-8';
  app.async=false;
  app.addEventListener('load',()=>{
    installHero();installFooterCredit();installMediaUI();setMediaLabels();bindImageInput();
    try{
      const baseRenderPlugins=renderPlugins;
      renderPlugins=function(){baseRenderPlugins();decoratePluginCards();};
      window.renderPlugins=renderPlugins;

      const baseRenderPluginDetail=renderPluginDetail;
      renderPluginDetail=function(id){
        baseRenderPluginDetail(id);
        const p=plugins.find(x=>x.id===id);
        renderImageForPlugin(p);
        renderVideoForPlugin(p);
      };
      window.renderPluginDetail=renderPluginDetail;

      const baseEditPlugin=editPlugin;
      editPlugin=function(id){
        baseEditPlugin(id);
        const p=plugins.find(x=>x.id===id);
        const video=document.getElementById('pVideo');if(video)video.value=p?.video||'';
        pendingImageData=(typeof p?.image==='string'&&p.image.startsWith('data:image/'))?p.image:'';
        pendingImagePromise=Promise.resolve(pendingImageData);
        const file=document.getElementById('pImage');if(file)file.value='';
        setImagePreview(pendingImageData);
      };
      window.editPlugin=editPlugin;

      const baseClearPluginForm=clearPluginForm;
      clearPluginForm=function(){
        baseClearPluginForm();
        pendingImageData='';pendingImagePromise=Promise.resolve('');
        const file=document.getElementById('pImage');if(file)file.value='';
        const video=document.getElementById('pVideo');if(video)video.value='';
        setImagePreview('');
      };
      window.clearPluginForm=clearPluginForm;

      const form=document.getElementById('pluginForm');
      form?.addEventListener('submit',async e=>{
        if(!session?.admin)return;
        e.preventDefault();e.stopImmediatePropagation();
        await pendingImagePromise;
        const id=(document.getElementById('editId').value||'p'+Date.now()).replace(/[^a-zA-Z0-9_-]/g,'');
        const rawUrl=document.getElementById('pUrl').value.trim();
        const rawVideo=document.getElementById('pVideo')?.value.trim()||'';
        if(rawUrl&&!safeExternalUrl(rawUrl)){toast(t('urlProtocol'));return;}
        if(rawVideo&&!safeExternalUrl(rawVideo)){toast(document.getElementById('languageSelect')?.value==='en'?'Video URL must start with http:// or https://.':'Video linki http:// veya https:// ile başlamalı.');return;}
        const rawPrice=Number(document.getElementById('pPrice').value||0);
        const obj={id,name:document.getElementById('pName').value.trim().slice(0,60),version:document.getElementById('pVersion').value.trim().slice(0,24),category:document.getElementById('pCategory').value,price:Number.isFinite(rawPrice)&&rawPrice>=0?rawPrice:0,desc:document.getElementById('pDesc').value.trim().slice(0,500),url:rawUrl,video:rawVideo.slice(0,700),image:pendingImageData,icon:document.getElementById('pIcon').value};
        const idx=plugins.findIndex(x=>x.id===id);
        const old=idx>=0?plugins[idx]:null;
        if(idx>=0)plugins[idx]=obj;else plugins.unshift(obj);
        try{savePlugins();}
        catch(err){if(idx>=0)plugins[idx]=old;else plugins=plugins.filter(x=>x.id!==id);toast(document.getElementById('languageSelect')?.value==='en'?'Image is too large for browser storage.':'Fotoğraf tarayıcı depolaması için fazla büyük.');return;}
        renderPlugins();clearPluginForm();toast(idx>=0?t('pluginUpdated'):t('pluginAdded'));
      },true);

      document.getElementById('cancelEdit')?.addEventListener('click',()=>setTimeout(clearPluginForm,0));
      renderPlugins();
    }catch(err){console.error('[11_ Studios] media integration failed',err);}
  });
  document.head.appendChild(app);
})();
