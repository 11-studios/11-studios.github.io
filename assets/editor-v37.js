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
  function sendState(){if(frameReady)$('siteFrame')?.contentWindow?.postMessage({type:'11:editor-state-v39',state},location.origin);}
  function choose(id){selectedId=id||'';renderProperties();}
  function updateSelectedChip(){const item=selected(),chip=$('selectedChip');if(!chip)return;chip.textContent=item?(item.type==='text'?'Yazı':'Görsel'):'Öğe seçilmedi';}
  function syncPositionFields(item){
    const x=$('propX'),y=$('propY');
    if(x)x.value=String(Number(clamp(item?.x,0,96,0).toFixed(1)));
    if(y)y.value=String(Number(clamp(item?.y,0,99,0).toFixed(1)));
  }
  function insertionY(){
    const doc=Math.max(1,Number(viewport.docHeight)||1),scroll=Math.max(0,Number(viewport.scrollY)||0),vh=Math.max(1,Number(viewport.viewportHeight)||1);
    return clamp((scroll+Math.min(vh*.24,190))/doc*100,0,96,8);
  }
  function injectPreviewRuntime(){
    const frame=$('siteFrame');
    try{
      const win=frame?.contentWindow,doc=frame?.contentDocument;
      if(!win||!doc||win.__11EditorRuntime39)return;
      if(doc.getElementById('editorRuntime39'))return;
      const s=doc.createElement('script');s.id='editorRuntime39';s.src='assets/editor-runtime-v37.js?v=20261016-39';s.async=false;
      (doc.body||doc.documentElement).appendChild(s);
    }catch(err){console.warn('[11_ Editor] preview runtime inject failed',err);}
  }

  function commonFields(item){
    const x=clamp(item.x,0,96,8),y=clamp(item.y,0,99,8),w=clamp(item.width,4,96,24),o=clamp(item.opacity,.05,1,1),z=Math.round(clamp(item.z,1,100,10));
    return `<div class="editor-pos-row"><div class="editor-field"><label>X konumu (sayfa %)</label><input id="propX" type="number" min="0" max="96" step="0.1" value="${x.toFixed(1)}"></div><div class="editor-field"><label>Y konumu (sayfa %)</label><input id="propY" type="number" min="0" max="99" step="0.1" value="${y.toFixed(1)}"></div></div>
      <div class="editor-field"><label>Genişlik</label><div class="range-row"><input id="propWidth" type="range" min="4" max="96" step="1" value="${w}"><output id="propWidthOut">${Math.round(w)}%</output></div></div>
      <div class="editor-field"><label>Saydamlık</label><div class="range-row"><input id="propOpacity" type="range" min="0.05" max="1" step="0.01" value="${o}"><output id="propOpacityOut">${Math.round(o*100)}%</output></div></div>
      <div class="editor-field"><label>Katman</label><input id="propZ" type="number" min="1" max="100" value="${z}"></div>`;
  }
  function renderProperties(){
    const item=selected();const props=$('properties'),del=$('deleteBtn');
    updateSelectedChip();
    if(!item){if(props)props.innerHTML='<div class="prop-empty">Önizlemeden bir öğeye tıkla veya yeni bir öğe ekle.</div>';if(del)del.disabled=true;return;}
    if(del)del.disabled=false;
    if(item.type==='text')props.innerHTML=`${commonFields(item)}<div class="editor-note">Konum tüm sayfaya göredir; önizlemede istediğin yere sürükleyebilirsin.</div><div class="editor-field"><label>Yazı</label><textarea id="propText" maxlength="1000">${esc(item.text||'')}</textarea></div><div class="editor-field"><label>Renk</label><input id="propColor" type="color" value="${/^#[0-9a-f]{6}$/i.test(String(item.color||''))?item.color:'#cba7ff'}"></div><div class="editor-field"><label>Yazı boyutu</label><input id="propFont" type="number" min="10" max="120" value="${Math.round(clamp(item.fontSize,10,120,32))}"></div><div class="editor-field"><label>Kalınlık</label><select id="propWeight"><option value="400">Normal</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option></select></div><div class="editor-field"><label>Hizalama</label><select id="propAlign"><option value="left">Sol</option><option value="center">Orta</option><option value="right">Sağ</option></select></div>`;
    else props.innerHTML=`${commonFields(item)}<div class="editor-note">Konum tüm sayfaya göredir; önizlemede istediğin yere sürükleyebilirsin.</div><div class="editor-field"><label>Alt metin</label><input id="propAlt" maxlength="180" value="${esc(item.alt||'')}"></div><div class="editor-note">Görsel veritabanında güvenli görsel verisi olarak tutulur; HTML veya script çalıştırılmaz.</div>`;
    bindProperties(item);
  }
  function bindProperties(item){
    const x=$('propX');if(x)x.oninput=()=>{item.x=clamp(x.value,0,96,item.x);markDirty();sendState();};
    const y=$('propY');if(y)y.oninput=()=>{item.y=clamp(y.value,0,99,item.y);markDirty();sendState();};
    const width=$('propWidth');if(width)width.oninput=()=>{const n=clamp(width.value,4,96,24);$('propWidthOut').textContent=`${Math.round(n)}%`;item.width=n;markDirty();sendState();};
    const opacity=$('propOpacity');if(opacity)opacity.oninput=()=>{const n=clamp(opacity.value,.05,1,1);$('propOpacityOut').textContent=`${Math.round(n*100)}%`;item.opacity=n;markDirty();sendState();};
    const z=$('propZ');if(z)z.oninput=()=>{item.z=Math.round(clamp(z.value,1,100,10));markDirty();sendState();};
    if(item.type==='text'){
      const text=$('propText');if(text)text.oninput=e=>{item.text=e.target.value.slice(0,1000);markDirty();sendState();};
      const color=$('propColor');if(color)color.oninput=e=>{item.color=e.target.value;markDirty();sendState();};
      const font=$('propFont');if(font)font.oninput=e=>{item.fontSize=clamp(e.target.value,10,120,32);markDirty();sendState();};
      const weight=$('propWeight');if(weight){weight.value=String(item.weight||'600');weight.onchange=e=>{item.weight=e.target.value;markDirty();sendState();};}
      const align=$('propAlign');if(align){align.value=String(item.align||'left');align.onchange=e=>{item.align=e.target.value;markDirty();sendState();};}
    }else{
      const alt=$('propAlt');if(alt)alt.oninput=e=>{item.alt=e.target.value.slice(0,180);markDirty();sendState();};
    }
  }
  function addText(){
    const item={id:uid(),type:'text',x:8,y:insertionY(),width:38,opacity:1,z:10,text:'Yeni yazı',color:'#cba7ff',fontSize:32,weight:'700',align:'left'};
    state.elements.push(item);selectedId=item.id;markDirty();renderProperties();sendState();
  }
  function fileToDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=()=>reject(new Error('read_failed'));r.onload=()=>resolve(String(r.result||''));r.readAsDataURL(file);});}
  async function compressImage(file){
    if(!file||!/^image\/(png|jpeg|webp|gif)$/i.test(file.type))throw new Error('invalid_image');
    if(file.size>8*1024*1024)throw new Error('too_large');
    if(file.type.toLowerCase()==='image/gif'){
      const data=await fileToDataUrl(file);if(data.length>440000)throw new Error('gif_too_large');return data;
    }
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
      const image=await compressImage(file),item={id:uid(),type:'image',x:60,y:insertionY(),width:28,opacity:1,z:10,image,alt:file.name.slice(0,180)};
      state.elements.push(item);selectedId=item.id;markDirty();renderProperties();sendState();
    }catch(err){status(err.message==='gif_too_large'?'Animasyonlu GIF yaklaşık 320 KB’dan küçük olmalı.':'Görsel eklenemedi. Dosyayı küçültüp tekrar dene.','bad');}
  }
  async function loadCloud(){
    status('Buluttaki düzen yükleniyor…');
    try{
      const data=await editorApi('get');revision=Math.max(1,Number(data?.revision)||1);state=data?.data&&Array.isArray(data.data.elements)?data.data:{elements:[]};selectedId='';dirty=false;renderProperties();sendState();status(`Buluttaki düzen yüklendi. Revizyon ${revision}.`,'ok');
    }catch(err){console.error('[11_ Editor] load failed',err);status('Editor verileri yüklenemedi.','bad');}
  }
  async function save(){
    const btn=$('saveBtn');btn.disabled=true;status('Kaydediliyor…');
    try{
      const result=await editorApi('save',{p_token:token,p_expected_revision:revision,p_state:state});revision=Math.max(revision+1,Number(result?.revision)||revision+1);state=result?.data&&Array.isArray(result.data.elements)?result.data:state;dirty=false;sendState();status(`Kaydedildi. Tüm cihazlarda görünecek. Revizyon ${revision}.`,'ok');
    }catch(err){
      const text=String(err.raw||JSON.stringify(err.data||'')||'');status(err.status===409||/revision_conflict|40001/i.test(text)?'Başka bir oturum daha yeni değişiklik kaydetmiş. Buluttan yenileyip tekrar dene.':'Kaydetme başarısız. Admin oturumunu ve bağlantıyı kontrol et.','bad');
    }finally{btn.disabled=false;}
  }
  async function authorize(){
    const gate=$('authGate'),app=$('editorApp'),authText=$('authText');
    if(!token){authText.textContent='Editor yalnızca admin hesabıyla giriş yaptıktan sonra açılır.';return;}
    try{
      const valid=await siteApi('admin_session_valid',{p_token:token});if(!valid){authText.textContent='Admin oturumu geçersiz veya süresi dolmuş. Siteye dönüp tekrar giriş yap.';return;}
      gate.classList.add('hidden');app.classList.remove('hidden');await loadCloud();
    }catch{authText.textContent='Admin oturumu doğrulanamadı. Siteye dönüp tekrar giriş yap.';}
  }
  function normalizeLegacy(items){
    if(!Array.isArray(items)||!items.length)return;
    let changed=false;
    items.forEach(p=>{
      const item=state.elements.find(x=>x.id===p.id);if(!item||!item.section)return;
      item.x=clamp(p.x,0,96,item.x);item.y=clamp(p.y,0,99,item.y);item.width=clamp(p.width,4,96,item.width);delete item.section;changed=true;
    });
    if(changed){markDirty('Eski bölüm yerleşimleri serbest konuma çevrildi. Kaydettiğinde tüm cihazlara uygulanacak.');renderProperties();sendState();}
  }
  function init(){
    $('addTextBtn').onclick=addText;$('addImageBtn').onclick=()=>$('imageInput').click();$('imageInput').onchange=e=>{const f=e.target.files?.[0];if(f)addImage(f);e.target.value='';};
    $('deleteBtn').onclick=()=>{if(!selectedId)return;state.elements=state.elements.filter(x=>x.id!==selectedId);selectedId='';markDirty();renderProperties();sendState();};
    $('saveBtn').onclick=save;$('reloadBtn').onclick=()=>{if(!dirty||confirm('Kaydedilmemiş değişiklikleri bırakıp buluttan yenilemek istiyor musun?'))loadCloud();};
    const frame=$('siteFrame');if(frame){frame.addEventListener('load',()=>setTimeout(injectPreviewRuntime,0));if(frame.contentDocument?.readyState==='complete')setTimeout(injectPreviewRuntime,0);}
    window.addEventListener('message',e=>{
      if(e.origin!==location.origin||!e.data)return;
      if(e.data.type==='11:editor-ready-v39'){frameReady=true;sendState();}
      if(e.data.type==='11:editor-select-v39')choose(e.data.id);
      if(e.data.type==='11:editor-viewport-v39')viewport={scrollY:Math.max(0,Number(e.data.scrollY)||0),viewportHeight:Math.max(1,Number(e.data.viewportHeight)||1),docHeight:Math.max(1,Number(e.data.docHeight)||1)};
      if(e.data.type==='11:editor-normalize-v39')normalizeLegacy(e.data.items);
      if(e.data.type==='11:editor-move-v39'){
        const item=state.elements.find(x=>x.id===e.data.id);if(item){item.x=clamp(e.data.x,0,96,item.x);item.y=clamp(e.data.y,0,99,item.y);delete item.section;selectedId=item.id;markDirty();updateSelectedChip();syncPositionFields(item);}
      }
    });
    window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
    authorize();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();