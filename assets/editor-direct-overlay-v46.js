(()=>{
  if(window.__11DirectOverlay46)return;window.__11DirectOverlay46=true;
  const ORIGIN=location.origin;
  const frame=()=>document.getElementById('siteFrame');
  let childWin=null,childDoc=null,layer=null,lastState={elements:[]},drag=null;

  const clamp=(n,min,max,fallback)=>{n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};

  function pageBottom(){
    if(!childWin||!childDoc)return 1;
    const footer=childDoc.querySelector('.footer');
    if(footer){
      const r=footer.getBoundingClientRect();
      const bottom=(childWin.scrollY||0)+r.bottom;
      if(Number.isFinite(bottom)&&bottom>0)return Math.max(childWin.innerHeight||0,Math.ceil(bottom));
    }
    return Math.max(childWin.innerHeight||0,childDoc.documentElement?.scrollHeight||0,childDoc.body?.scrollHeight||0,1);
  }

  function installCss(){
    if(!childDoc)return;
    let s=childDoc.getElementById('directOverlayStyle46');
    if(s)return;
    s=childDoc.createElement('style');s.id='directOverlayStyle46';
    s.textContent=`
      html.site-editor-preview-mode .site-editor-global-layer{display:none!important}
      .editor-direct-layer46{position:absolute!important;left:0!important;top:0!important;width:100%!important;pointer-events:none!important;overflow:visible!important;z-index:2147483646!important}
      .editor-direct-item46{position:absolute!important;display:block!important;visibility:visible!important;box-sizing:border-box!important;pointer-events:auto!important;cursor:grab!important;touch-action:none!important;user-select:none!important;outline:1px dashed rgba(203,167,255,.72)!important;outline-offset:3px!important;max-width:none!important}
      .editor-direct-item46:hover{outline-color:#cba7ff!important}
      .editor-direct-item46.is-dragging{cursor:grabbing!important;outline:2px solid #cba7ff!important}
      .editor-direct-item46.is-focused{outline:4px solid #cba7ff!important;outline-offset:6px!important;filter:drop-shadow(0 0 16px rgba(203,167,255,.95))!important}
      img.editor-direct-item46{height:auto!important;object-fit:contain!important}
      .editor-direct-text46{white-space:pre-wrap!important;word-break:break-word!important;line-height:1.18!important}
    `;
    (childDoc.head||childDoc.documentElement).appendChild(s);
  }

  function ensureLayer(){
    if(!childDoc)return null;
    installCss();
    if(layer?.isConnected){layer.style.height=`${pageBottom()}px`;return layer;}
    childDoc.getElementById('editorDirectLayer46')?.remove();
    layer=childDoc.createElement('div');layer.id='editorDirectLayer46';layer.className='editor-direct-layer46';layer.style.height=`${pageBottom()}px`;
    childDoc.body.appendChild(layer);
    return layer;
  }

  function notify(type,payload={}){
    try{childWin.parent.postMessage({type,...payload},ORIGIN);}catch{}
  }

  function createItem(item){
    let el;
    if(item.type==='image'&&/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(String(item.image||''))){
      el=childDoc.createElement('img');el.src=item.image;el.alt=String(item.alt||'');el.draggable=false;el.decoding='async';
    }else if(item.type==='text'){
      el=childDoc.createElement('div');el.textContent=String(item.text||'');el.classList.add('editor-direct-text46');
      el.style.color=/^#[0-9a-f]{6}$/i.test(String(item.color||''))?item.color:'#cba7ff';
      el.style.fontSize=`${clamp(item.fontSize,10,120,32)}px`;
      el.style.fontWeight=['400','500','600','700','800'].includes(String(item.weight))?String(item.weight):'600';
      el.style.textAlign=['left','center','right'].includes(String(item.align))?String(item.align):'left';
    }else return null;
    el.classList.add('editor-direct-item46');
    el.dataset.editorId=String(item.id||'');
    el.style.left=`${clamp(item.x,0,96,0)}%`;
    el.style.top=`${clamp(item.y,0,98,0)}%`;
    el.style.width=`${clamp(item.width,4,96,20)}%`;
    el.style.opacity=String(clamp(item.opacity,.05,1,1));
    el.style.zIndex=String(Math.round(clamp(item.z,1,100,10)));
    enableDrag(el,item);
    return el;
  }

  function render(state){
    lastState=state&&Array.isArray(state.elements)?state:{elements:[]};
    const host=ensureLayer();if(!host)return;
    host.replaceChildren();
    host.style.height=`${pageBottom()}px`;
    lastState.elements.forEach(item=>{const el=createItem(item);if(el)host.appendChild(el);});
  }

  function enableDrag(el,item){
    el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();notify('11:editor-select-v44',{id:item.id});});
    el.addEventListener('pointerdown',e=>{
      if(drag||(e.pointerType==='mouse'&&e.button!==0))return;
      e.preventDefault();e.stopPropagation();
      const host=ensureLayer(),hostW=Math.max(1,host.clientWidth),hostH=Math.max(1,host.offsetHeight||pageBottom());
      drag={el,item,pointerId:e.pointerId,startClientX:e.clientX,startDocY:(childWin.scrollY||0)+e.clientY,startX:clamp(item.x,0,96,0),startY:clamp(item.y,0,98,0),hostW,hostH};
      el.classList.add('is-dragging');
      try{el.setPointerCapture(e.pointerId);}catch{}
      notify('11:editor-select-v44',{id:item.id});
    });
    el.addEventListener('pointermove',e=>{
      if(!drag||drag.pointerId!==e.pointerId)return;e.preventDefault();
      const dx=e.clientX-drag.startClientX,dy=((childWin.scrollY||0)+e.clientY)-drag.startDocY;
      const er=drag.el.getBoundingClientRect();
      const wp=(er.width/drag.hostW)*100,hp=(er.height/drag.hostH)*100;
      item.x=Number(clamp(drag.startX+(dx/drag.hostW)*100,0,Math.max(0,100-wp),drag.startX).toFixed(2));
      item.y=Number(clamp(drag.startY+(dy/drag.hostH)*100,0,Math.max(0,100-hp),drag.startY).toFixed(2));
      drag.el.style.left=`${item.x}%`;drag.el.style.top=`${item.y}%`;
      const edge=70;
      if(e.clientY<edge&&childWin.scrollY>0)childWin.scrollBy(0,-18);
      else if(e.clientY>childWin.innerHeight-edge&&childWin.scrollY+childWin.innerHeight<pageBottom()-2)childWin.scrollBy(0,18);
    });
    const finish=e=>{
      if(!drag||drag.pointerId!==e.pointerId)return;e.preventDefault();
      const d=drag;drag=null;d.el.classList.remove('is-dragging');
      try{if(d.el.hasPointerCapture?.(e.pointerId))d.el.releasePointerCapture(e.pointerId);}catch{}
      notify('11:editor-move-v44',{id:d.item.id,x:d.item.x,y:d.item.y});
    };
    el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);
  }

  function focus(id){
    const el=layer?.querySelector(`[data-editor-id="${CSS.escape(String(id||''))}"]`);if(!el)return;
    el.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});
    el.classList.add('is-focused');setTimeout(()=>el.classList.remove('is-focused'),1600);
  }

  function onChildMessage(e){
    if(e.origin!==ORIGIN||!e.data)return;
    if(['11:editor-state-v44','11:editor-state-v41','11:editor-state-v40','11:editor-state-v39'].includes(e.data.type))render(e.data.state||{elements:[]});
    if(['11:editor-focus-v44','11:editor-focus-v41','11:editor-focus-v40','11:editor-focus-v39'].includes(e.data.type))focus(e.data.id);
  }

  function attach(){
    const f=frame();if(!f)return;
    try{
      const w=f.contentWindow,d=f.contentDocument;if(!w||!d)return;
      if(childWin&&childWin!==w)try{childWin.removeEventListener('message',onChildMessage);}catch{}
      childWin=w;childDoc=d;layer=null;
      childWin.addEventListener('message',onChildMessage);
      installCss();ensureLayer();
      notify('11:editor-ready-v44');
      [80,250,650,1200].forEach(ms=>setTimeout(()=>{ensureLayer();notify('11:editor-ready-v44');},ms));
    }catch(err){console.warn('[11_ Editor] direct overlay attach failed',err);}
  }

  function init(){
    const f=frame();if(!f)return;
    f.addEventListener('load',()=>setTimeout(attach,0));
    if(f.contentDocument?.readyState==='complete')attach();
    window.addEventListener('resize',()=>{if(layer)layer.style.height=`${pageBottom()}px`;},{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();