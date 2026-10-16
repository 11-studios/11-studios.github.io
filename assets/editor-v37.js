(()=>{
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const SITE_API=`${SUPABASE_URL}/functions/v1/site-api`;
  const EDITOR_API=`${SUPABASE_URL}/functions/v1/editor-api`;
  const token=sessionStorage.getItem('11_cloud_admin_token')||'';
  let revision=1;
  let state={elements:[]};
  let selectedId='';
  let dirty=false;
  let frameReady=false;
  let initialPreviewTopDone=false;
  let viewport={scrollY:0,viewportHeight:800,docHeight:1200};

  const $=id=>document.getElementById(id);
  const clamp=(n,min,max,fallback)=>{n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const uid=()=>`el_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`;

  async function callApi(url,action,payload={}){
    const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload}),cache:'no-store',credentials:'omit'});
    const text=await r.text();let data=null;try{data=text?JSON.parse(text):null;}catch{data=text;}
    if(!r.ok){const e=new Error(`${action}:${r.status}`);e.status=r.status;e.data=data;e.raw=text;throw e;}return data;
  }
  const siteApi=(action,payload={})=>callApi(SITE_API,action,payload);
  const editorApi=(action,payload={})=>callApi(EDITOR_API,action,payload);

  function status(text,kind=''){const el=$('saveStatus');if(!el)return;el.textContent=text;el.className=`editor-status ${kind}`.trim();}
  function markDirty(text='Kaydedilmemiş değişiklikler var.'){dirty=true;status(text);}
  function selected(){return state.elements.find(x=>x.id===selectedId)||null;}

  function sendState(){
    const win=$('siteFrame')?.contentWindow;
    if(win)win.postMessage({type:'11:editor-state-v44',state},location.origin);
  }

  function sendStateBurst(){
    sendState();
    [80,250,650].forEach(ms=>setTimeout(sendState,ms));
  }

  function focusItem(id=selectedId){
    if(!id)return;
    const win=$('siteFrame')?.contentWindow;
    if(win){
      win.postMessage({type:'11:editor-state-v44',state},location.origin);
      setTimeout(()=>win.postMessage({type:'11:editor-focus-v44',id},location.origin),60);
      setTimeout(()=>win.postMessage({type:'11:editor-focus-v44',id},location.origin),260);
    }
  }

  function choose(id,focus=false){
    selectedId=id||'';
    renderElementList();
    renderProperties();
    if(focus&&selectedId)focusItem(selectedId);
  }

  function updateSelectedChip(){
    const item=selected(),chip=$('selectedChip');if(!chip)return;
    if(!item){chip.textContent='Öğe seçilmedi';return;}
    const name=item.type==='image'?(item.alt||'Görsel'):(String(item.text||'Yazı').replace(/\s+/g,' ').slice(0,45)||'Yazı');
    chip.textContent=`${item.type==='image'?'Görsel':'Yazı'} • ${name}`;
  }

  function renderElementList(){
    const list=$('elementList'),count=$('elementCount');
    if(count)count.textContent=String(state.elements.length);
    if(!list)return;
    list.replaceChildren();
    if(!state.elements.length){const empty=document.createElement('div');empty.className='prop-empty';empty.textContent='Henüz öğe yok.';list.appendChild(empty);return;}
    state.elements.forEach((item,index)=>{
      const row=document.createElement('button');row.type='button';row.className=`editor-element-row${item.id===selectedId?' is-selected':''}`;row.dataset.id=item.id;
      const thumb=document.createElement('span');thumb.className='editor-element-thumb';
      if(item.type==='image'&&/^data:image\//i.test(String(item.image||''))){const img=document.createElement('img');img.src=item.image;img.alt='';thumb.appendChild(img);}else thumb.textContent='T';
      const copy=document.createElement('span');copy.className='editor-element-copy';
      const name=document.createElement('span');name.className='editor-element-name';name.textContent=item.type==='image'?(item.alt||`Görsel ${index+1}`):(String(item.text||'Yazı').replace(/\s+/g,' ').slice(0,34)||`Yazı ${index+1}`);
      const meta=document.createElement('span');meta.className='editor-element-meta';meta.textContent=`${item.type==='image'?'Görsel':'Yazı'} • X ${Number(item.x||0).toFixed(1)} • Y ${Number(item.y||0).toFixed(1)}`;
      copy.append(name,meta);
      const find=document.createElement('button');find.type='button';find.className='editor-element-find';find.textContent='Bul';find.onclick=e=>{e.preventDefault();e.stopPropagation();choose(item.id,true);};
      row.append(thumb,copy,find);
      row.onclick=()=>choose(item.id,false);
      list.appendChild(row);
    });
  }

  function syncPositionFields(item){
    const x=$('propX'),y=$('propY');
    if(x)x.value=String(Number(clamp(item?.x,0,96,0).toFixed(1)));
    if(y)y.value=String(Number(clamp(item?.y,0,98,0).toFixed(1)));
  }

  function insertionY(){
    const doc=Math.max(1,Number(viewport.docHeight)||1),scroll=Math.max(0,Number(viewport.scrollY)||0),vh=Math.max(1,Number(viewport.viewportHeight)||1);
    const target=scroll+Math.min(vh*.2,150);
    return clamp(target/doc*100,0,94,5);
  }

  function injectPreviewRuntime(){
    const frame=$('siteFrame');
    try{
      const win=frame?.contentWindow,doc=frame?.contentDocument;
      if(!win||!doc||win.__11EditorRuntime44)return;
      if(doc.getElementById('editorRuntime44'))return;
      const s=doc.createElement('script');s.id='editorRuntime44';s.src='assets/editor-runtime-v37.js?v=20261016-44';s.async=false;
      (doc.body||doc.documentElement).appendChild(s);
    }catch(err){console.warn('[11_ Editor] preview runtime inject failed',err);}
  }

  function commonFields(item){
    const x=clamp(item.x,0,96,8),y=clamp(item.y,0,98,8),w=clamp(item.width,4,96,24),o=clamp(item.opacity,.05,1,1),z=Math.round(clamp(item.z,1,100,10));
    return `<div class="editor-pos-row"><div class="editor-field"><label>X konumu (sayfa %)</label><input id="propX" type="number" min="0" max="96" step="0.1" value="${x.toFixed(1)}"></div><div class="editor-field"><label>Y konumu (sayfa %)</label><input id="propY" type="number" min="0" max="98" step="0.1" value="${y.toFixed(1)}"></div></div>
      <div class="editor-field"><label>Genişlik</label><div class="range-row"><input id="propWidth" type="range" min="4" max="96" step="1" value="${w}"><output id="propWidthOut">${Math.round(w)}%</output></div></div>
      <div class="editor-field"><label>Saydamlık</label><div class="range-row"><input id="propOpacity" type="range" min="0.05" max="1" step="0.01" value="${o}"><output id="propOpacityOut">${Math.round(o*100)}%</output></div></div>
      <div class="editor-field"><label>Katman</label><input id="propZ" type="number" min="1" max="100" value="${z}"></div>`;
  }

  function renderProperties(){
    const item=selected(),props=$('properties'),del=$('deleteBtn'),focus=$('focusBtn');
    updateSelectedChip();
    if(!item){
      if(props)props.innerHTML='<div class="prop-empty">Önizlemeden veya yukarıdaki listeden bir öğe seç.</div>';
      if(del)del.disabled=true;if(focus)focus.disabled=true;return;
    }
    if(del)del.disabled=false;if(focus)focus.disabled=false;
    if(item.type==='text')props.innerHTML=`${commonFields(item)}<div class="editor-note">Konum tüm sayfaya göredir. “Bul” seçili öğeyi ekranda ortalar.</div><div class="editor-field"><label>Yazı</label><textarea id="propText" maxlength="1000">${esc(item.text||'')}</textarea></div><div class="editor-field"><label>Renk</label><input id="propColor" type="color" value="${/^#[0-9a-f]{6}$/i.test(String(item.color||''))?item.color:'#cba7ff'}"></div><div class="editor-field"><label>Yazı boyutu</label><input id="propFont" type="number" min="10" max="120" value="${Math.round(clamp(item.fontSize,10,120,32))}"></div><div class="editor-field"><label>Kalınlık</label><select id="propWeight"><option value="400">Normal</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option></select></div><div class="editor-field"><label>Hizalama</label><select id="propAlign"><option value="left">Sol</option><option value="center">Orta</option><option value="right">Sağ</option></select></div>`;
    else props.innerHTML=`${commonFields(item)}<div class="editor-note">Konum tüm sayfaya göredir. “Bul” seçili görseli ekranda ortalar.</div><div class="editor-field"><label>Alt metin / ad</label><input id="propAlt" maxlength="180" value="${esc(item.alt||'')}"></div>`;
    bindProperties(item);
  }

  function changed(item,refreshList=false){
    markDirty();
    if(refreshList)renderElementList();
    sendState();
  }

  function bindProperties(item){
    const x=$('propX');if(x)x.oninput=()=>{item.x=clamp(x.value,0,96,item.x);changed(item,true);};
    const y=$('propY');if(y)y.oninput=()=>{item.y=clamp(y.value,0,98,item.y);changed(item,true);};
    const width=$('propWidth');if(width)width.oninput=()=>{const n=clamp(width.value,4,96,24);$('propWidthOut').textContent=`${Math.round(n)}%`;item.width=n;changed(item);};
    const opacity=$('propOpacity');if(opacity)opacity.oninput=()=>{const n=clamp(opacity.value,.05,1,1);$('propOpacityOut').textContent=`${Math.round(n*100)}%`;item.opacity=n;changed(item);};
    const z=$('propZ');if(z)z.oninput=()=>{item.z=Math.round(clamp(z.value,1,100,10));changed(item);};
    if(item.type==='text'){
      const text=$('propText');if(text)text.oninput=e=>{item.text=e.target.value.slice(0,1000);changed(item,true);};
      const color=$('propColor');if(color)color.oninput=e=>{item.color=e.target.value;changed(item);};
      const font=$('propFont');if(font)font.oninput=e=>{item.fontSize=clamp(e.target.value,10,120,32);changed(item);};
      const weight=$('propWeight');if(weight){weight.value=String(item.weight||'600');weight.onchange=e=>{item.weight=e.target.value;changed(item);};}
      const align=$('propAlign');if(align){align.value=String(item.align||'left');align.onchange=e=>{item.align=e.target.value;changed(item);};}
    }else{
      const alt=$('propAlt');if(alt)alt.oninput=e=>{item.alt=e.target.value.slice(0,180);changed(item,true);};
    }
  }

  function addText(){
    const item={id:uid(),type:'text',x:8,y:insertionY(),width:38,opacity:1,z:10,text:'Yeni yazı',color:'#cba7ff',fontSize:32,weight:'700',align:'left'};
    state.elements.push(item);selectedId=item.id;markDirty('Yazı eklendi.');renderElementList();renderProperties();sendStateBurst();setTimeout(()=>focusItem(item.id),140);
  }

  function fileToDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=()=>reject(new Error('read_failed'));r.onload=()=>resolve(String(r.result||''));r.readAsDataURL(file);});}

  async function compressImage(file){
    if(!file||!/^image\/(png|jpeg|webp|gif)$/i.test(file.type))throw new Error('invalid_image');
    if(file.size>8*1024*1024)throw new Error('too_large');
    if(file.type.toLowerCase()==='image/gif')return fileToDataUrl(file);
    const original=await fileToDataUrl(file);
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('decode_failed'));i.src=original;});
    const maxW=1100,maxH=800,scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight),w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:true});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,w,h);
    let q=.86,data='';for(let i=0;i<7;i++){data=canvas.toDataURL('image/webp',q);if(data.length<=440000)break;q-=.1;}
    if(data.length>440000)throw new Error('image_still_large');return data;
  }

  async function addImage(file){
    status('Görsel hazırlanıyor…');
    try{
      const image=await compressImage(file),item={id:uid(),type:'image',x:36,y:insertionY(),width:24,opacity:1,z:10,image,alt:file.name.slice(0,180)};
      state.elements.push(item);selectedId=item.id;markDirty('Görsel eklendi.');renderElementList();renderProperties();sendStateBurst();setTimeout(()=>focusItem(item.id),160);
    }catch(err){status('Görsel eklenemedi. Dosya 8 MB’dan büyük olmamalı ve desteklenen bir görsel olmalı.','bad');}
  }

  async function loadCloud(){
    status('Buluttaki düzen yükleniyor…');
    try{
      const data=await editorApi('get');
      revision=Math.max(1,Number(data?.revision)||1);
      state=data?.data&&Array.isArray(data.data.elements)?data.data:{elements:[]};
      if(selectedId&&!state.elements.some(x=>x.id===selectedId))selectedId='';
      dirty=false;renderElementList();renderProperties();sendStateBurst();
      status(`Buluttaki düzen yüklendi. ${state.elements.length} öğe • Revizyon ${revision}.`,'ok');
    }catch(err){console.error('[11_ Editor] load failed',err);status('Editor verileri yüklenemedi.','bad');}
  }

  async function save(){
    const btn=$('saveBtn');btn.disabled=true;status('Kaydediliyor…');
    try{
      const result=await editorApi('save',{p_token:token,p_expected_revision:revision,p_state:state});
      revision=Math.max(revision+1,Number(result?.revision)||revision+1);
      state=result?.data&&Array.isArray(result.data.elements)?result.data:state;
      dirty=false;renderElementList();renderProperties();sendStateBurst();
      status(`Kaydedildi. ${state.elements.length} öğe tüm cihazlarda görünecek. Revizyon ${revision}.`,'ok');
    }catch(err){
      const text=String(err.raw||JSON.stringify(err.data||'')||'');
      status(err.status===409||/revision_conflict|40001/i.test(text)?'Başka bir oturum daha yeni değişiklik kaydetmiş. Buluttan yenileyip tekrar dene.':'Kaydetme başarısız. Admin oturumunu ve bağlantıyı kontrol et.','bad');
    }finally{btn.disabled=false;}
  }

  async function authorize(){
    const gate=$('authGate'),app=$('editorApp'),authText=$('authText');
    if(!token){authText.textContent='Editor yalnızca admin hesabıyla giriş yaptıktan sonra açılır.';return;}
    try{
      const valid=await siteApi('admin_session_valid',{p_token:token});
      if(!valid){authText.textContent='Admin oturumu geçersiz veya süresi dolmuş. Siteye dönüp tekrar giriş yap.';return;}
      gate.classList.add('hidden');app.classList.remove('hidden');await loadCloud();
    }catch{authText.textContent='Admin oturumu doğrulanamadı. Siteye dönüp tekrar giriş yap.';}
  }

  function normalizeLegacy(items){
    if(!Array.isArray(items)||!items.length)return;
    let changedAny=false;
    items.forEach(p=>{const item=state.elements.find(x=>x.id===p.id);if(!item||!item.section)return;item.x=clamp(p.x,0,96,item.x);item.y=clamp(p.y,0,98,item.y);item.width=clamp(p.width,4,96,item.width);delete item.section;changedAny=true;});
    if(changedAny){markDirty('Eski yerleşimler serbest konuma çevrildi.');renderElementList();renderProperties();sendStateBurst();}
  }

  function init(){
    $('addTextBtn').onclick=addText;
    $('addImageBtn').onclick=()=>$('imageInput').click();
    $('imageInput').onchange=e=>{const f=e.target.files?.[0];if(f)addImage(f);e.target.value='';};
    $('focusBtn').onclick=()=>focusItem();
    $('deleteBtn').onclick=()=>{
      if(!selectedId)return;
      state.elements=state.elements.filter(x=>x.id!==selectedId);selectedId='';markDirty('Öğe silindi.');renderElementList();renderProperties();sendStateBurst();
    };
    $('saveBtn').onclick=save;
    $('reloadBtn').onclick=()=>{if(!dirty||confirm('Kaydedilmemiş değişiklikleri bırakıp buluttan yenilemek istiyor musun?'))loadCloud();};

    const frame=$('siteFrame');
    if(frame){
      frame.addEventListener('load',()=>{frameReady=false;setTimeout(injectPreviewRuntime,0);setTimeout(sendState,180);setTimeout(sendState,600);});
      if(frame.contentDocument?.readyState==='complete')setTimeout(injectPreviewRuntime,0);
    }

    window.addEventListener('message',e=>{
      if(e.origin!==location.origin||!e.data)return;
      if(['11:editor-ready-v44','11:editor-ready-v41','11:editor-ready-v40','11:editor-ready-v39'].includes(e.data.type)){
        frameReady=true;
        if(!initialPreviewTopDone){initialPreviewTopDone=true;try{$('siteFrame')?.contentWindow?.scrollTo(0,0);}catch{}viewport.scrollY=0;}
        sendStateBurst();
      }
      if(['11:editor-select-v44','11:editor-select-v41','11:editor-select-v40','11:editor-select-v39'].includes(e.data.type))choose(e.data.id,false);
      if(['11:editor-viewport-v44','11:editor-viewport-v41','11:editor-viewport-v40','11:editor-viewport-v39'].includes(e.data.type))viewport={scrollY:Math.max(0,Number(e.data.scrollY)||0),viewportHeight:Math.max(1,Number(e.data.viewportHeight)||1),docHeight:Math.max(1,Number(e.data.docHeight)||1)};
      if(['11:editor-normalize-v44','11:editor-normalize-v41','11:editor-normalize-v40','11:editor-normalize-v39'].includes(e.data.type))normalizeLegacy(e.data.items);
      if(['11:editor-move-v44','11:editor-move-v41','11:editor-move-v40','11:editor-move-v39'].includes(e.data.type)){
        const item=state.elements.find(x=>x.id===e.data.id);
        if(item){item.x=clamp(e.data.x,0,96,item.x);item.y=clamp(e.data.y,0,98,item.y);delete item.section;selectedId=item.id;markDirty();renderElementList();updateSelectedChip();syncPositionFields(item);}
      }
    });

    window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
    renderElementList();renderProperties();authorize();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();