(()=>{
  if(window.__11EditorRuntime41)return;
  window.__11EditorRuntime41=true;
  window.__11EditorRuntime40=true;
  window.__11EditorRuntime39=true;
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const EDITOR_API=`${SUPABASE_URL}/functions/v1/editor-api`;
  const preview=new URLSearchParams(location.search).get('editorPreview')==='1';
  const legacyTargets={hero:'#top .hero',plugins:'#plugins .container',about:'#about .container',footer:'.footer .container'};
  let state={elements:[]};
  let activeDrag=null;
  let globalHost=null;
  let autoScrollFrame=0;

  const clamp=(n,min,max,fallback)=>{n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};
  const post=(name,data={})=>{
    if(!preview)return;
    window.parent.postMessage({type:`11:${name}-v41`,...data},location.origin);
    window.parent.postMessage({type:`11:${name}-v40`,...data},location.origin);
    window.parent.postMessage({type:`11:${name}-v39`,...data},location.origin);
  };

  async function editorApi(action,payload={}){
    const r=await fetch(EDITOR_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload}),cache:'no-store',credentials:'omit'});
    if(!r.ok)throw new Error(`${action}:${r.status}`);
    return r.json();
  }
  function cleanLayers(){document.querySelectorAll('.site-editor-layer').forEach(x=>x.remove());globalHost=null;}
  function pageEnd(){
    const footer=document.querySelector('.footer');
    if(footer){const r=footer.getBoundingClientRect();return Math.max(1,Math.ceil((window.scrollY||0)+r.bottom));}
    const main=document.querySelector('main#top')||document.querySelector('main');
    if(main){const r=main.getBoundingClientRect();return Math.max(1,Math.ceil((window.scrollY||0)+r.bottom));}
    return Math.max(1,Math.ceil(document.body?.getBoundingClientRect().height||document.documentElement.clientHeight||1));
  }
  function globalLayer(){
    if(globalHost?.isConnected)return globalHost;
    const body=document.body;if(!body)return null;
    if(getComputedStyle(body).position==='static')body.style.position='relative';
    const el=document.createElement('div');
    el.className='site-editor-layer site-editor-global-layer';el.dataset.section='page';
    el.style.top='0';el.style.bottom='0';el.style.left='0';el.style.width='100%';el.style.height='auto';
    body.appendChild(el);globalHost=el;syncLayerSize();return el;
  }
  function syncLayerSize(){
    const host=globalHost;if(!host)return;
    host.style.top='0';host.style.bottom='0';host.style.height='auto';host.style.minHeight='0';
  }
  function legacyPosition(item,host){
    const selector=legacyTargets[item.section],target=selector?document.querySelector(selector):null;
    if(!target||!host)return null;
    const tr=target.getBoundingClientRect(),hr=host.getBoundingClientRect();
    if(!hr.width||!hr.height||!tr.width||!tr.height)return null;
    const px=(tr.left-hr.left)+(clamp(item.x,0,96,8)/100)*tr.width;
    const py=(tr.top-hr.top)+(clamp(item.y,0,96,8)/100)*tr.height;
    const pw=(clamp(item.width,4,96,24)/100)*tr.width;
    return {x:clamp(px/hr.width*100,0,96,8),y:clamp(py/hr.height*100,0,98,8),width:clamp(pw/hr.width*100,4,96,24)};
  }
  function render(next){
    if(activeDrag)return;
    state=next&&Array.isArray(next.elements)?{elements:next.elements.map(x=>({...x}))}:{elements:[]};
    cleanLayers();
    const host=globalLayer();if(!host)return;
    const migrations=[];
    state.elements.forEach(item=>{
      const legacy=item.section?legacyPosition(item,host):null,view=legacy?{...item,...legacy}:{...item};
      if(legacy)migrations.push({id:item.id,x:legacy.x,y:legacy.y,width:legacy.width});
      let el;
      if(view.type==='text'){
        el=document.createElement('div');el.className='site-editor-element site-editor-text';el.textContent=String(view.text||'');
        el.style.color=/^#[0-9a-f]{6}$/i.test(String(view.color||''))?view.color:'#cba7ff';
        el.style.fontSize=`${Math.max(10,Math.min(120,Number(view.fontSize)||32))}px`;
        el.style.fontWeight=['400','500','600','700','800'].includes(String(view.weight))?String(view.weight):'600';
        el.style.textAlign=['left','center','right'].includes(String(view.align))?String(view.align):'left';el.style.lineHeight='1.18';el.style.whiteSpace='pre-wrap';
      }else if(view.type==='image'&&/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(String(view.image||''))){
        el=document.createElement('img');el.className='site-editor-element site-editor-image';el.src=view.image;el.alt=String(view.alt||'');el.decoding='async';el.draggable=false;
      }else return;
      el.dataset.editorId=String(view.id||'');
      el.style.left=`${clamp(view.x,0,96,0)}%`;el.style.top=`${clamp(view.y,0,98,0)}%`;el.style.width=`${clamp(view.width,4,96,20)}%`;
      el.style.opacity=String(clamp(view.opacity,.05,1,1));el.style.zIndex=String(Math.round(clamp(view.z,1,100,10)));
      host.appendChild(el);if(preview)enableDrag(el,view,host);
    });
    if(preview&&migrations.length)queueMicrotask(()=>post('editor-normalize',{items:migrations}));
    postViewport();
  }
  function postViewport(){
    if(!preview)return;
    post('editor-viewport',{scrollY:Math.max(0,window.scrollY||0),viewportHeight:Math.max(1,window.innerHeight||1),docHeight:Math.max(1,pageEnd())});
  }
  function applyDragPosition(d,clientX,clientY){
    const hostRect=d.host.getBoundingClientRect(),elRect=d.el.getBoundingClientRect();
    const maxX=Math.max(0,hostRect.width-elRect.width),maxY=Math.max(0,hostRect.height-elRect.height);
    const px=Math.max(0,Math.min(maxX,clientX-hostRect.left-d.offsetX));
    const py=Math.max(0,Math.min(maxY,clientY-hostRect.top-d.offsetY));
    d.item.x=Number((hostRect.width?px/hostRect.width*100:0).toFixed(2));
    d.item.y=Number((hostRect.height?py/hostRect.height*100:0).toFixed(2));
    d.el.style.left=`${d.item.x}%`;d.el.style.top=`${d.item.y}%`;
  }
  function autoScrollTick(){
    autoScrollFrame=0;
    const d=activeDrag;if(!d)return;
    const edge=Math.min(90,Math.max(55,window.innerHeight*.1));
    let dy=0;
    if(d.lastY<edge)dy=-Math.ceil((edge-d.lastY)/edge*24);
    else if(d.lastY>window.innerHeight-edge)dy=Math.ceil((d.lastY-(window.innerHeight-edge))/edge*24);
    if(dy){
      const before=window.scrollY||0;window.scrollBy(0,dy);const after=window.scrollY||0;
      if(after!==before)applyDragPosition(d,d.lastX,d.lastY);
    }
    autoScrollFrame=requestAnimationFrame(autoScrollTick);
  }
  function startAutoScroll(){if(!autoScrollFrame)autoScrollFrame=requestAnimationFrame(autoScrollTick);}
  function stopAutoScroll(){if(autoScrollFrame){cancelAnimationFrame(autoScrollFrame);autoScrollFrame=0;}}
  function endDrag(pointerId){
    if(!activeDrag)return;
    const d=activeDrag;activeDrag=null;stopAutoScroll();d.el.classList.remove('is-dragging');
    window.removeEventListener('pointermove',dragMove,true);window.removeEventListener('pointerup',dragUp,true);window.removeEventListener('pointercancel',dragUp,true);
    try{if(pointerId!=null&&d.el.hasPointerCapture?.(pointerId))d.el.releasePointerCapture(pointerId);}catch{}
    post('editor-move',{id:d.item.id,x:d.item.x,y:d.item.y});postViewport();
  }
  function dragMove(e){
    const d=activeDrag;if(!d||e.pointerId!==d.pointerId)return;e.preventDefault();
    d.lastX=e.clientX;d.lastY=e.clientY;applyDragPosition(d,e.clientX,e.clientY);
  }
  function dragUp(e){if(activeDrag&&e.pointerId===activeDrag.pointerId){e.preventDefault();endDrag(e.pointerId);}}
  function enableDrag(el,item,host){
    el.style.pointerEvents='auto';el.style.cursor='grab';el.style.touchAction='none';el.setAttribute('draggable','false');
    el.addEventListener('pointerdown',e=>{
      if(activeDrag||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();e.stopPropagation();syncLayerSize();
      const elRect=el.getBoundingClientRect();
      activeDrag={el,item,host,pointerId:e.pointerId,offsetX:e.clientX-elRect.left,offsetY:e.clientY-elRect.top,lastX:e.clientX,lastY:e.clientY};
      el.classList.add('is-dragging');try{el.setPointerCapture(e.pointerId);}catch{}
      post('editor-select',{id:item.id});
      window.addEventListener('pointermove',dragMove,true);window.addEventListener('pointerup',dragUp,true);window.addEventListener('pointercancel',dragUp,true);startAutoScroll();
    });
    el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();post('editor-select',{id:item.id});});
  }
  function installAdminEditorButton(){
    const notice=document.getElementById('adminNotice');if(!notice)return;
    notice.textContent='Pluginler, hesaplar ve site düzenleri buluta kaydedilir. Kaydettiğin değişiklikler tüm cihazlarda görünür.';
    if(document.getElementById('openEditorBtn'))return;
    const row=document.createElement('div');row.className='admin-editor-row';row.innerHTML='<a class="btn purple" id="openEditorBtn" href="editor.html">Editor</a><span>Yazı ve görselleri sayfanın istediğin yerine sürükleyip kaydet.</span>';notice.insertAdjacentElement('afterend',row);
  }
  async function load(){try{const data=await editorApi('get');render(data?.data||{elements:[]});}catch(err){console.warn('[11_ Studios] editor state load failed',err);}}
  function init(){
    installAdminEditorButton();document.getElementById('adminBtn')?.addEventListener('click',()=>setTimeout(installAdminEditorButton,20));
    if(preview){
      document.documentElement.classList.add('site-editor-preview-mode');
      document.addEventListener('click',e=>{if(!e.target.closest('.site-editor-element')){e.preventDefault();e.stopPropagation();}},true);
      document.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();},true);
      window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data)return;if(['11:editor-state-v41','11:editor-state-v40','11:editor-state-v39'].includes(e.data.type))render(e.data.state||{elements:[]});});
      window.addEventListener('scroll',postViewport,{passive:true});window.addEventListener('resize',()=>{syncLayerSize();postViewport();},{passive:true});
      window.addEventListener('load',()=>{syncLayerSize();postViewport();setTimeout(()=>{syncLayerSize();postViewport();},400);},{once:true});
      post('editor-ready');
    }else{
      load();window.addEventListener('resize',syncLayerSize,{passive:true});window.addEventListener('load',()=>setTimeout(syncLayerSize,300),{once:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();