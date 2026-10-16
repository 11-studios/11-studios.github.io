(()=>{
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const PUBLISHABLE='sb_publishable_ZF1vdtlp5gpOGwljI1vRmw_FaLRRFOb';
  const EDGE=`${SUPABASE_URL}/functions/v1/site-api`;
  const token=sessionStorage.getItem('11_cloud_admin_token')||'';
  let revision=1;
  let state={elements:[]};
  let selectedId='';
  let dirty=false;
  let frameReady=false;

  const $=id=>document.getElementById(id);
  const clamp=(n,min,max,fallback)=>{n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const uid=()=>`el_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`;

  async function edge(action,payload={}){
    const r=await fetch(EDGE,{method:'POST',headers:{apikey:PUBLISHABLE,'Content-Type':'application/json'},body:JSON.stringify({action,...payload}),cache:'no-store',credentials:'omit'});
    const text=await r.text();let data=null;try{data=text?JSON.parse(text):null;}catch{data=text;}
    if(!r.ok){const e=new Error(`${action}:${r.status}`);e.status=r.status;e.data=data;throw e;}return data;
  }
  async function rpc(name,body={}){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:PUBLISHABLE,'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',credentials:'omit'});
    const text=await r.text();let data=null;try{data=text?JSON.parse(text):null;}catch{data=text;}
    if(!r.ok){const e=new Error(`${name}:${r.status}`);e.status=r.status;e.data=data;e.raw=text;throw e;}return data;
  }
  function status(text,kind=''){$('saveStatus').textContent=text;$('saveStatus').className=`editor-status ${kind}`.trim();}
  function markDirty(){dirty=true;status('Kaydedilmemiş değişiklikler var.');}
  function selected(){return state.elements.find(x=>x.id===selectedId)||null;}
  function sendState(){if(frameReady)$('siteFrame')?.contentWindow?.postMessage({type:'11:editor-state',state},location.origin);}
  function scrollSection(section){$('siteFrame')?.contentWindow?.postMessage({type:'11:editor-scroll',section},location.origin);}
  function choose(id){selectedId=id||'';renderProperties();sendState();}
  function updateSelected(patch){const item=selected();if(!item)return;Object.assign(item,patch);markDirty();renderProperties(false);sendState();}

  function commonFields(item){
    return `<div class="editor-field"><label>Bölüm</label><select id="propSection"><option value="hero" ${item.section==='hero'?'selected':''}>Ana bölüm</option><option value="plugins" ${item.section==='plugins'?'selected':''}>Pluginler</option><option value="about" ${item.section==='about'?'selected':''}>Hakkında</option><option value="footer" ${item.section==='footer'?'selected':''}>Footer</option></select></div>
      <div class="editor-field"><label>Genişlik</label><div class="range-row"><input id="propWidth" type="range" min="4" max="96" step="1" value="${clamp(item.width,4,96,24)}"><output id="propWidthOut">${Math.round(clamp(item.width,4,96,24))}%</output></div></div>
      <div class="editor-field"><label>Saydamlık</label><div class="range-row"><input id="propOpacity" type="range" min="0.1" max="1" step="0.05" value="${clamp(item.opacity,.1,1,1)}"><output id="propOpacityOut">${Math.round(clamp(item.opacity,.1,1,1)*100)}%</output></div></div>
      <div class="editor-field"><label>Katman</label><input id="propZ" type="number" min="1" max="100" value="${Math.round(clamp(item.z,1,100,10))}"></div>`;
  }
  function renderProperties(rebind=true){
    const item=selected();const props=$('properties'),chip=$('selectedChip'),del=$('deleteBtn');
    if(!item){chip.textContent='Öğe seçilmedi';props.innerHTML='<div class="prop-empty">Önizlemeden bir öğeye tıkla veya yeni bir öğe ekle.</div>';del.disabled=true;return;}
    chip.textContent=`${item.type==='text'?'Yazı':'Görsel'} · ${item.section}`;del.disabled=false;
    if(item.type==='text')props.innerHTML=`${commonFields(item)}<div class="editor-field"><label>Yazı</label><textarea id="propText" maxlength="1000">${esc(item.text||'')}</textarea></div><div class="editor-field"><label>Renk</label><input id="propColor" type="color" value="${/^#[0-9a-f]{6}$/i.test(String(item.color||''))?item.color:'#cba7ff'}"></div><div class="editor-field"><label>Yazı boyutu</label><input id="propFont" type="number" min="10" max="120" value="${Math.round(clamp(item.fontSize,10,120,32))}"></div><div class="editor-field"><label>Kalınlık</label><select id="propWeight"><option value="400">Normal</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option></select></div><div class="editor-field"><label>Hizalama</label><select id="propAlign"><option value="left">Sol</option><option value="center">Orta</option><option value="right">Sağ</option></select></div>`;
    else props.innerHTML=`${commonFields(item)}<div class="editor-field"><label>Alt metin</label><input id="propAlt" maxlength="180" value="${esc(item.alt||'')}"></div><div class="editor-note">Görsel veritabanında güvenli data-image olarak tutulur; HTML veya script çalıştırılmaz.</div>`;
    if(!rebind)return;
    bindProperties(item);
  }
  function bindProperties(item){
    const section=$('propSection');if(section)section.onchange=()=>{updateSelected({section:section.value});scrollSection(section.value);};
    const width=$('propWidth');if(width)width.oninput=()=>{const n=clamp(width.value,4,96,24);$('propWidthOut').textContent=`${Math.round(n)}%`;item.width=n;markDirty();sendState();};
    const opacity=$('propOpacity');if(opacity)opacity.oninput=()=>{const n=clamp(opacity.value,.1,1,1);$('propOpacityOut').textContent=`${Math.round(n*100)}%`;item.opacity=n;markDirty();sendState();};
    const z=$('propZ');if(z)z.onchange=()=>updateSelected({z:Math.round(clamp(z.value,1,100,10))});
    if(item.type==='text'){
      $('propText').oninput=e=>{item.text=e.target.value.slice(0,1000);markDirty();sendState();};
      $('propColor').oninput=e=>{item.color=e.target.value;markDirty();sendState();};
      $('propFont').onchange=e=>updateSelected({fontSize:clamp(e.target.value,10,120,32)});
      $('propWeight').value=String(item.weight||'600');$('propWeight').onchange=e=>updateSelected({weight:e.target.value});
      $('propAlign').value=String(item.align||'left');$('propAlign').onchange=e=>updateSelected({align:e.target.value});
    }else $('propAlt').oninput=e=>{item.alt=e.target.value.slice(0,180);markDirty();sendState();};
  }
  function addText(){
    const section=$('sectionSelect').value;const item={id:uid(),type:'text',section,x:8,y:8,width:38,opacity:1,z:10,text:'Yeni yazı',color:'#cba7ff',fontSize:32,weight:'700',align:'left'};
    state.elements.push(item);selectedId=item.id;markDirty();renderProperties();sendState();scrollSection(section);
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
    let maxW=1100,maxH=800,scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight);let w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:true});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,w,h);
    let q=.84,data='';for(let i=0;i<6;i++){data=canvas.toDataURL('image/webp',q);if(data.length<=440000)break;q-=.1;}
    if(data.length>440000)throw new Error('image_still_large');return data;
  }
  async function addImage(file){
    status('Görsel hazırlanıyor…');
    try{
      const image=await compressImage(file);const section=$('sectionSelect').value;const item={id:uid(),type:'image',section,x:60,y:8,width:28,opacity:1,z:10,image,alt:file.name.slice(0,180)};
      state.elements.push(item);selectedId=item.id;markDirty();renderProperties();sendState();scrollSection(section);
    }catch(err){status(err.message==='gif_too_large'?'Animasyonlu GIF yaklaşık 320 KB’dan küçük olmalı.':'Görsel eklenemedi. Dosyayı küçültüp tekrar dene.','bad');}
  }
  async function loadCloud(){
    status('Buluttaki düzen yükleniyor…');
    try{
      const data=await rpc('editor_get');revision=Math.max(1,Number(data?.revision)||1);state=data?.data&&Array.isArray(data.data.elements)?data.data:{elements:[]};selectedId='';dirty=false;renderProperties();sendState();status(`Buluttaki düzen yüklendi. Revizyon ${revision}.`,'ok');
    }catch(err){status('Editor verileri yüklenemedi.','bad');}
  }
  async function save(){
    const btn=$('saveBtn');btn.disabled=true;status('Kaydediliyor…');
    try{
      const result=await rpc('editor_save',{p_token:token,p_expected_revision:revision,p_state:state});revision=Math.max(revision+1,Number(result?.revision)||revision+1);state=result?.data&&Array.isArray(result.data.elements)?result.data:state;dirty=false;sendState();status(`Kaydedildi. Tüm cihazlarda görünecek. Revizyon ${revision}.`,'ok');
    }catch(err){
      const text=String(err.raw||err.data||'');status(/revision_conflict|40001/i.test(text)?'Başka bir oturum daha yeni değişiklik kaydetmiş. Buluttan yenileyip tekrar dene.':'Kaydetme başarısız. Admin oturumunu ve bağlantıyı kontrol et.','bad');
    }finally{btn.disabled=false;}
  }
  async function authorize(){
    const gate=$('authGate'),app=$('editorApp'),authText=$('authText');
    if(!token){authText.textContent='Editor yalnızca admin hesabıyla giriş yaptıktan sonra açılır.';return;}
    try{
      const valid=await edge('admin_session_valid',{p_token:token});if(!valid){authText.textContent='Admin oturumu geçersiz veya süresi dolmuş. Siteye dönüp tekrar giriş yap.';return;}
      gate.classList.add('hidden');app.classList.remove('hidden');await loadCloud();
    }catch{authText.textContent='Admin oturumu doğrulanamadı. Siteye dönüp tekrar giriş yap.';}
  }
  function init(){
    $('addTextBtn').onclick=addText;$('addImageBtn').onclick=()=>$('imageInput').click();$('imageInput').onchange=e=>{const f=e.target.files?.[0];if(f)addImage(f);e.target.value='';};
    $('deleteBtn').onclick=()=>{if(!selectedId)return;state.elements=state.elements.filter(x=>x.id!==selectedId);selectedId='';markDirty();renderProperties();sendState();};
    $('saveBtn').onclick=save;$('reloadBtn').onclick=()=>{if(!dirty||confirm('Kaydedilmemiş değişiklikleri bırakıp buluttan yenilemek istiyor musun?'))loadCloud();};
    $('sectionSelect').onchange=e=>scrollSection(e.target.value);
    window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data)return;if(e.data.type==='11:editor-ready'){frameReady=true;sendState();scrollSection($('sectionSelect').value);}if(e.data.type==='11:editor-select')choose(e.data.id);if(e.data.type==='11:editor-move'){const item=state.elements.find(x=>x.id===e.data.id);if(item){item.x=clamp(e.data.x,0,96,item.x);item.y=clamp(e.data.y,0,96,item.y);selectedId=item.id;markDirty();renderProperties();}}});
    window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
    authorize();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();