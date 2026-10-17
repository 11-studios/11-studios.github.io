(()=>{
  const KEY='11_editor_state_cache_v2';
  const ENDPOINT='https://mzrnuiunfxaendnrigzk.supabase.co/functions/v1/editor-api';
  const clamp=(n,min,max,fallback)=>{n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};
  const isPx=item=>String(item?.coord||'')==='px'&&Number.isFinite(Number(item?.xPx))&&Number.isFinite(Number(item?.yPx));
  let cached=null,lastRendered=null,bodyObserver=null;

  function saveCaches(state){
    if(!state||!Array.isArray(state.elements))return;
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}
    try{
      const req=indexedDB.open('11_editor_cache',1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('state'))req.result.createObjectStore('state');};
      req.onsuccess=()=>{const tx=req.result.transaction('state','readwrite');tx.objectStore('state').put(state,'home');};
    }catch{}
  }
  function applyPosition(el,item){
    if(isPx(item)){el.style.left=`${Math.max(0,Number(item.xPx)||0)}px`;el.style.top=`${Math.max(0,Number(item.yPx)||0)}px`;el.style.width=`${clamp(item.widthPx,20,8000,item.type==='image'?320:500)}px`;}
    else{el.style.left=`${clamp(item.x,0,96,0)}%`;el.style.top=`${clamp(item.y,0,98,0)}%`;el.style.width=`${clamp(item.width,4,96,20)}%`;}
  }
  function renderFast(state){
    if(!state||!Array.isArray(state.elements))return;
    if(!document.body){
      if(!bodyObserver){bodyObserver=new MutationObserver(()=>{if(document.body){bodyObserver.disconnect();bodyObserver=null;renderFast(lastRendered||state);}});bodyObserver.observe(document.documentElement,{childList:true});}
      lastRendered=state;return;
    }
    lastRendered=state;
    document.querySelectorAll('.site-editor-bootstrap-layer').forEach(x=>x.remove());
    const layer=document.createElement('div');layer.className='site-editor-bootstrap-layer';
    Object.assign(layer.style,{position:'absolute',left:'0',top:'0',width:'100%',height:'0',overflow:'visible',pointerEvents:'none',zIndex:'20'});
    for(const item of state.elements){
      let el=null;
      if(item.type==='image'&&/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(String(item.image||''))){
        el=document.createElement('img');el.src=item.image;el.alt=String(item.alt||'');el.loading='eager';el.decoding='sync';el.draggable=false;try{el.fetchPriority='high';}catch{}el.style.height='auto';el.style.objectFit='contain';
      }else if(item.type==='text'){
        el=document.createElement('div');el.textContent=String(item.text||'');el.style.color=/^#[0-9a-f]{6}$/i.test(String(item.color||''))?item.color:'#cba7ff';el.style.fontSize=`${clamp(item.fontSize,10,120,32)}px`;el.style.fontWeight=['400','500','600','700','800'].includes(String(item.weight))?String(item.weight):'600';el.style.textAlign=['left','center','right'].includes(String(item.align))?String(item.align):'left';el.style.lineHeight='1.18';el.style.whiteSpace='pre-wrap';
      }
      if(!el)continue;
      el.className='site-editor-bootstrap-item';el.dataset.editorId=String(item.id||'');Object.assign(el.style,{position:'absolute',display:'block',boxSizing:'border-box',maxWidth:'none',pointerEvents:'none',opacity:String(clamp(item.opacity,.05,1,1)),zIndex:String(Math.round(clamp(item.z,1,100,10)))});applyPosition(el,item);layer.appendChild(el);
    }
    document.body.appendChild(layer);
  }
  function useState(state){
    if(!state||!Array.isArray(state.elements))return state;
    cached=state;window.__11EditorCachedState=state;saveCaches(state);
    if(!window.__11EditorRuntime48)renderFast(state);
    return state;
  }
  try{const raw=localStorage.getItem(KEY),parsed=raw?JSON.parse(raw):null;if(parsed&&Array.isArray(parsed.elements))useState(parsed);}catch{}

  try{
    const req=indexedDB.open('11_editor_cache',1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('state'))req.result.createObjectStore('state');};
    req.onsuccess=()=>{try{const tx=req.result.transaction('state','readonly'),get=tx.objectStore('state').get('home');get.onsuccess=()=>{const s=get.result;if(s&&Array.isArray(s.elements)&&!window.__11EditorRuntime48)useState(s);};}catch{}};
  }catch{}

  window.__11EditorStatePromise=fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'get'}),cache:'no-store',credentials:'omit'})
    .then(r=>{if(!r.ok)throw new Error(`editor-state:${r.status}`);return r.json();})
    .then(data=>useState(data?.data&&Array.isArray(data.data.elements)?data.data:{elements:[]}))
    .catch(()=>cached||null);
})();