(()=>{
  if(window.__11EditorRuntime48)return;window.__11EditorRuntime48=true;

  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const EDITOR_API=`${SUPABASE_URL}/functions/v1/editor-api`;
  const CACHE_KEY='11_editor_state_cache_v2';
  const preview=new URLSearchParams(location.search).get('editorPreview')==='1';
  let state={elements:[]};
  let globalHost=null;
  let activeDrag=null;
  let parentStateReceived=false;
  let autoScrollRaf=0;
  let autoScrollDir=0;

  const clamp=(n,min,max,fallback)=>{n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};
  const isPx=item=>String(item?.coord||'')==='px'&&Number.isFinite(Number(item?.xPx))&&Number.isFinite(Number(item?.yPx));

  async function editorApi(action,payload={}){
    const r=await fetch(EDITOR_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload}),cache:'no-store',credentials:'omit'});
    if(!r.ok)throw new Error(`${action}:${r.status}`);
    return r.json();
  }

  function persist(next){
    try{if(next&&Array.isArray(next.elements)){localStorage.setItem(CACHE_KEY,JSON.stringify(next));window.__11EditorCachedState=next;}}catch{}
    try{
      const req=indexedDB.open('11_editor_cache',1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('state'))req.result.createObjectStore('state');};
      req.onsuccess=()=>{const tx=req.result.transaction('state','readwrite');tx.objectStore('state').put(next,'home');};
    }catch{}
  }

  function pageBottom(){
    const footer=document.querySelector('.footer');
    if(footer){const r=footer.getBoundingClientRect(),bottom=(window.scrollY||0)+r.bottom;if(Number.isFinite(bottom)&&bottom>0)return Math.max(window.innerHeight||0,Math.ceil(bottom));}
    return Math.max(window.innerHeight||0,document.documentElement.scrollHeight,document.body?.scrollHeight||0,1);
  }

  function cleanLayers(){document.querySelectorAll('.site-editor-layer,.site-editor-bootstrap-layer').forEach(x=>x.remove());globalHost=null;}

  function globalLayer(){
    if(globalHost?.isConnected)return globalHost;
    const body=document.body;if(!body)return null;
    if(getComputedStyle(body).position==='static')body.style.position='relative';
    const el=document.createElement('div');el.className='site-editor-layer site-editor-global-layer';el.dataset.section='page';el.style.top='0';el.style.height=`${pageBottom()}px`;body.appendChild(el);globalHost=el;return el;
  }
  function syncLayerSize(){if(globalHost)globalHost.style.height=`${pageBottom()}px`;}

  function applyPosition(el,item){
    if(isPx(item)){
      el.style.left=`${Math.max(0,Number(item.xPx)||0)}px`;
      el.style.top=`${Math.max(0,Number(item.yPx)||0)}px`;
      el.style.width=`${clamp(item.widthPx,20,8000,item.type==='image'?320:500)}px`;
    }else{
      el.style.left=`${clamp(item.x,0,96,0)}%`;
      el.style.top=`${clamp(item.y,0,98,0)}%`;
      el.style.width=`${clamp(item.width,4,96,20)}%`;
    }
  }

  function makeElement(item){
    let el;
    if(item.type==='text'){
      el=document.createElement('div');el.className='site-editor-element site-editor-text';el.textContent=String(item.text||'');
      el.style.color=/^#[0-9a-f]{6}$/i.test(String(item.color||''))?item.color:'#cba7ff';
      el.style.fontSize=`${Math.max(10,Math.min(120,Number(item.fontSize)||32))}px`;
      el.style.fontWeight=['400','500','600','700','800'].includes(String(item.weight))?String(item.weight):'600';
      el.style.textAlign=['left','center','right'].includes(String(item.align))?String(item.align):'left';el.style.lineHeight='1.18';el.style.whiteSpace='pre-wrap';
    }else if(item.type==='image'&&/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(String(item.image||''))){
      el=document.createElement('img');el.className='site-editor-element site-editor-image';el.src=item.image;el.alt=String(item.alt||'');el.loading='eager';el.decoding='sync';el.draggable=false;try{el.fetchPriority='high';}catch{}
      el.addEventListener('load',()=>{syncLayerSize();postViewport();},{once:true});
    }else return null;
    el.dataset.editorId=String(item.id||'');applyPosition(el,item);el.style.opacity=String(clamp(item.opacity,.05,1,1));el.style.zIndex=String(Math.round(clamp(item.z,1,100,10)));return el;
  }

  function render(next){
    if(activeDrag)return;
    state=next&&Array.isArray(next.elements)?{elements:next.elements.map(x=>({...x}))}:{elements:[]};persist(state);cleanLayers();
    const host=globalLayer();if(!host)return;
    state.elements.forEach(item=>{const el=makeElement(item);if(!el)return;host.appendChild(el);if(preview)enableDrag(el,item,host);});syncLayerSize();postViewport();
  }

  function postViewport(){
    if(!preview)return;
    window.parent.postMessage({type:'11:editor-viewport-v44',scrollY:Math.max(0,window.scrollY||0),viewportWidth:Math.max(1,window.innerWidth||1),viewportHeight:Math.max(1,window.innerHeight||1),docHeight:Math.max(1,pageBottom())},location.origin);
  }

  function convertToPx(item,el,host){
    if(isPx(item))return;
    const er=el.getBoundingClientRect(),hr=host.getBoundingClientRect();
    item.coord='px';item.xPx=Math.max(0,er.left-hr.left);item.yPx=Math.max(0,er.top-hr.top);item.widthPx=Math.max(20,er.width);
    delete item.x;delete item.y;delete item.width;applyPosition(el,item);
  }
  function stopAutoScroll(){autoScrollDir=0;if(autoScrollRaf){cancelAnimationFrame(autoScrollRaf);autoScrollRaf=0;}}
  function autoScrollTick(){if(!activeDrag||!autoScrollDir){autoScrollRaf=0;return;}const before=window.scrollY||0;window.scrollBy(0,autoScrollDir*18);if((window.scrollY||0)!==before){updateDrag(activeDrag.lastEvent,true);postViewport();}autoScrollRaf=requestAnimationFrame(autoScrollTick);}
  function updateAutoScroll(e){const edge=70;let dir=0;if(e.clientY<edge&&window.scrollY>0)dir=-1;else if(e.clientY>window.innerHeight-edge&&window.scrollY+window.innerHeight<pageBottom()-2)dir=1;if(dir===autoScrollDir)return;autoScrollDir=dir;if(dir&&!autoScrollRaf)autoScrollRaf=requestAnimationFrame(autoScrollTick);if(!dir&&autoScrollRaf){cancelAnimationFrame(autoScrollRaf);autoScrollRaf=0;}}
  function updateDrag(e,fromAuto=false){
    const d=activeDrag;if(!d||!e)return;if(!fromAuto&&e.pointerId!==d.pointerId)return;
    const dx=e.clientX-d.startPointerX,docY=(window.scrollY||0)+e.clientY,dy=docY-d.startPointerDocY;
    const hostW=Math.max(1,d.host.clientWidth),hostH=Math.max(1,d.host.offsetHeight||pageBottom()),er=d.el.getBoundingClientRect();
    d.item.xPx=Math.round(clamp(d.startXPx+dx,0,Math.max(0,hostW-er.width),d.startXPx));
    d.item.yPx=Math.round(clamp(d.startYPx+dy,0,Math.max(0,hostH-er.height),d.startYPx));
    d.el.style.left=`${d.item.xPx}px`;d.el.style.top=`${d.item.yPx}px`;
  }
  function dragMove(e){if(!activeDrag||e.pointerId!==activeDrag.pointerId)return;e.preventDefault();activeDrag.lastEvent=e;updateDrag(e);updateAutoScroll(e);}
  function finishDrag(e){
    const d=activeDrag;if(!d||e.pointerId!==d.pointerId)return;e.preventDefault();activeDrag=null;stopAutoScroll();d.el.classList.remove('is-dragging');
    window.removeEventListener('pointermove',dragMove,true);window.removeEventListener('pointerup',finishDrag,true);window.removeEventListener('pointercancel',finishDrag,true);
    try{if(d.el.hasPointerCapture?.(e.pointerId))d.el.releasePointerCapture(e.pointerId);}catch{}persist(state);
    window.parent.postMessage({type:'11:editor-move-v44',id:d.item.id,coord:'px',xPx:d.item.xPx,yPx:d.item.yPx,widthPx:d.item.widthPx},location.origin);
  }
  function enableDrag(el,item,host){
    el.style.pointerEvents='auto';el.style.cursor='grab';el.style.touchAction='none';
    el.addEventListener('pointerdown',e=>{
      if(activeDrag||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();e.stopPropagation();syncLayerSize();convertToPx(item,el,host);
      activeDrag={el,item,host,pointerId:e.pointerId,startPointerX:e.clientX,startPointerDocY:(window.scrollY||0)+e.clientY,startXPx:Number(item.xPx)||0,startYPx:Number(item.yPx)||0,lastEvent:e};
      el.classList.add('is-dragging');try{el.setPointerCapture(e.pointerId);}catch{}window.parent.postMessage({type:'11:editor-select-v44',id:item.id},location.origin);
      window.addEventListener('pointermove',dragMove,true);window.addEventListener('pointerup',finishDrag,true);window.addEventListener('pointercancel',finishDrag,true);
    });
    el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.parent.postMessage({type:'11:editor-select-v44',id:item.id},location.origin);});
  }

  function focusElement(id){const el=[...document.querySelectorAll('.site-editor-element')].find(x=>x.dataset.editorId===String(id||''));if(!el)return false;el.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});el.classList.add('is-editor-focused');setTimeout(()=>el.classList.remove('is-editor-focused'),1200);return true;}
  function sendReady(){if(preview)window.parent.postMessage({type:'11:editor-ready-v44'},location.origin);}
  async function load(){
    const cached=window.__11EditorCachedState;if(cached&&Array.isArray(cached.elements))render(cached);
    try{let next=null;if(window.__11EditorStatePromise)next=await window.__11EditorStatePromise;else{const data=await editorApi('get');next=data?.data||{elements:[]};}if(next&&Array.isArray(next.elements))render(next);}catch(err){console.warn('[11_ Studios] editor state load failed',err);}
  }
  function installAdminEditorButton(){const notice=document.getElementById('adminNotice');if(!notice)return;notice.textContent='Pluginler, hesaplar ve site düzenleri buluta kaydedilir. Kaydettiğin değişiklikler tüm cihazlarda görünür.';if(document.getElementById('openEditorBtn'))return;const row=document.createElement('div');row.className='admin-editor-row';row.innerHTML='<a class="btn purple" id="openEditorBtn" href="editor.html">Editor</a><span>Yazı ve görselleri sayfanın istediğin yerine sürükleyip kaydet.</span>';notice.insertAdjacentElement('afterend',row);}
  function initPreview(){
    document.documentElement.classList.add('site-editor-preview-mode');document.addEventListener('click',e=>{if(!e.target.closest('.site-editor-element')){e.preventDefault();e.stopPropagation();}},true);document.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();},true);
    window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data)return;if(['11:editor-state-v44','11:editor-state-v41','11:editor-state-v40','11:editor-state-v39'].includes(e.data.type)){parentStateReceived=true;render(e.data.state||{elements:[]});}if(e.data.type==='11:editor-focus-v44'){if(!focusElement(e.data.id)){render(state);setTimeout(()=>focusElement(e.data.id),30);}}});
    window.addEventListener('scroll',postViewport,{passive:true});window.addEventListener('resize',()=>{syncLayerSize();postViewport();},{passive:true});window.addEventListener('load',()=>{syncLayerSize();postViewport();},{once:true});[0,50,150,350,800].forEach(ms=>setTimeout(sendReady,ms));setTimeout(()=>{if(!parentStateReceived)load();},80);
  }
  function init(){installAdminEditorButton();document.getElementById('adminBtn')?.addEventListener('click',()=>setTimeout(installAdminEditorButton,20));if(preview)initPreview();else{load();window.addEventListener('resize',syncLayerSize,{passive:true});window.addEventListener('load',()=>{syncLayerSize();setTimeout(syncLayerSize,80);},{once:true});}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();