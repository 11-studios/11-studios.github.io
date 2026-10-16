(()=>{
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const PUBLISHABLE='sb_publishable_ZF1vdtlp5gpOGwljI1vRmw_FaLRRFOb';
  const EDITOR_API=`${SUPABASE_URL}/functions/v1/editor-api`;
  const preview=new URLSearchParams(location.search).get('editorPreview')==='1';
  const targets={hero:'#top .hero',plugins:'#plugins .container',about:'#about .container',footer:'.footer .container'};
  let state={elements:[]};
  let activeDrag=null;

  async function editorApi(action,payload={}){
    const r=await fetch(EDITOR_API,{method:'POST',headers:{apikey:PUBLISHABLE,'Content-Type':'application/json'},body:JSON.stringify({action,...payload}),cache:'no-store',credentials:'omit'});
    if(!r.ok)throw new Error(`${action}:${r.status}`);
    return r.json();
  }
  function layer(section){
    const target=document.querySelector(targets[section]);if(!target)return null;
    target.style.position='relative';
    let el=target.querySelector(`:scope > .site-editor-layer[data-section="${section}"]`);
    if(!el){el=document.createElement('div');el.className='site-editor-layer';el.dataset.section=section;target.appendChild(el);}
    return el;
  }
  function cleanLayers(){document.querySelectorAll('.site-editor-layer').forEach(x=>x.remove());}
  function render(next){
    if(activeDrag)return;
    state=next&&Array.isArray(next.elements)?{elements:next.elements.map(x=>({...x}))}:{elements:[]};
    cleanLayers();
    state.elements.forEach(item=>{
      const host=layer(item.section);if(!host)return;
      let el;
      if(item.type==='text'){
        el=document.createElement('div');el.className='site-editor-element site-editor-text';el.textContent=String(item.text||'');
        el.style.color=/^#[0-9a-f]{6}$/i.test(String(item.color||''))?item.color:'#cba7ff';
        el.style.fontSize=`${Math.max(10,Math.min(120,Number(item.fontSize)||32))}px`;
        el.style.fontWeight=['400','500','600','700','800'].includes(String(item.weight))?String(item.weight):'600';
        el.style.textAlign=['left','center','right'].includes(String(item.align))?String(item.align):'left';
        el.style.lineHeight='1.18';el.style.whiteSpace='pre-wrap';
      }else if(item.type==='image'&&/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(String(item.image||''))){
        el=document.createElement('img');el.className='site-editor-element site-editor-image';el.src=item.image;el.alt=String(item.alt||'');el.decoding='async';el.draggable=false;
      }else return;
      el.dataset.editorId=String(item.id||'');
      el.style.left=`${Math.max(0,Math.min(96,Number(item.x)||0))}%`;
      el.style.top=`${Math.max(0,Math.min(96,Number(item.y)||0))}%`;
      el.style.width=`${Math.max(4,Math.min(96,Number(item.width)||20))}%`;
      el.style.opacity=String(Math.max(.05,Math.min(1,Number(item.opacity)||1)));
      el.style.zIndex=String(Math.max(1,Math.min(100,Number(item.z)||10)));
      host.appendChild(el);
      if(preview)enableDrag(el,item,host);
    });
  }
  function endDrag(pointerId){
    if(!activeDrag)return;
    const d=activeDrag;activeDrag=null;
    d.el.classList.remove('is-dragging');
    window.removeEventListener('pointermove',dragMove,true);
    window.removeEventListener('pointerup',dragUp,true);
    window.removeEventListener('pointercancel',dragUp,true);
    try{if(pointerId!=null&&d.el.hasPointerCapture?.(pointerId))d.el.releasePointerCapture(pointerId);}catch{}
    window.parent.postMessage({type:'11:editor-move',id:d.item.id,x:d.item.x,y:d.item.y},location.origin);
  }
  function dragMove(e){
    const d=activeDrag;if(!d||e.pointerId!==d.pointerId)return;
    e.preventDefault();
    const hostRect=d.host.getBoundingClientRect(),elRect=d.el.getBoundingClientRect();
    const maxX=Math.max(0,hostRect.width-elRect.width),maxY=Math.max(0,hostRect.height-elRect.height);
    const px=Math.max(0,Math.min(maxX,e.clientX-hostRect.left-d.offsetX));
    const py=Math.max(0,Math.min(maxY,e.clientY-hostRect.top-d.offsetY));
    const x=hostRect.width?px/hostRect.width*100:0,y=hostRect.height?py/hostRect.height*100:0;
    d.item.x=Number(x.toFixed(2));d.item.y=Number(y.toFixed(2));
    d.el.style.left=`${d.item.x}%`;d.el.style.top=`${d.item.y}%`;
  }
  function dragUp(e){if(activeDrag&&e.pointerId===activeDrag.pointerId){e.preventDefault();endDrag(e.pointerId);}}
  function enableDrag(el,item,host){
    el.style.pointerEvents='auto';el.style.cursor='grab';el.style.touchAction='none';el.setAttribute('draggable','false');
    el.addEventListener('pointerdown',e=>{
      if(activeDrag)return;
      if(e.pointerType==='mouse'&&e.button!==0)return;
      e.preventDefault();e.stopPropagation();
      const elRect=el.getBoundingClientRect();
      activeDrag={el,item,host,pointerId:e.pointerId,offsetX:e.clientX-elRect.left,offsetY:e.clientY-elRect.top};
      el.classList.add('is-dragging');
      try{el.setPointerCapture(e.pointerId);}catch{}
      window.parent.postMessage({type:'11:editor-select',id:item.id},location.origin);
      window.addEventListener('pointermove',dragMove,true);
      window.addEventListener('pointerup',dragUp,true);
      window.addEventListener('pointercancel',dragUp,true);
    });
    el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.parent.postMessage({type:'11:editor-select',id:item.id},location.origin);});
  }
  function installAdminEditorButton(){
    const notice=document.getElementById('adminNotice');if(!notice)return;
    notice.textContent='Pluginler, hesaplar ve site düzenleri buluta kaydedilir. Kaydettiğin değişiklikler tüm cihazlarda görünür.';
    if(document.getElementById('openEditorBtn'))return;
    const row=document.createElement('div');row.className='admin-editor-row';row.innerHTML='<a class="btn purple" id="openEditorBtn" href="editor.html">Editor</a><span>Yazı ve görselleri site üzerinde sürükleyip kaydet.</span>';
    notice.insertAdjacentElement('afterend',row);
  }
  async function load(){
    try{const data=await editorApi('get');render(data?.data||{elements:[]});}catch(err){console.warn('[11_ Studios] editor state load failed',err);}
  }
  function init(){
    installAdminEditorButton();document.getElementById('adminBtn')?.addEventListener('click',()=>setTimeout(installAdminEditorButton,20));
    if(preview){
      document.documentElement.classList.add('site-editor-preview-mode');
      document.addEventListener('click',e=>{if(!e.target.closest('.site-editor-element')){e.preventDefault();e.stopPropagation();}},true);
      document.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();},true);
      window.addEventListener('message',e=>{
        if(e.origin!==location.origin||!e.data)return;
        if(e.data.type==='11:editor-state')render(e.data.state||{elements:[]});
        if(e.data.type==='11:editor-scroll'&&targets[e.data.section])document.querySelector(targets[e.data.section])?.scrollIntoView({behavior:'smooth',block:'center'});
      });
      window.parent.postMessage({type:'11:editor-ready'},location.origin);
    }else load();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();