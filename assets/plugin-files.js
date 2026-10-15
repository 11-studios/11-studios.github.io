(()=>{
  const DB_NAME='11_studios_plugin_files';
  const STORE='files';
  const MAX_FILE=150*1024*1024;
  let pendingRemove=false;
  let installed=false;

  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const msg=(tr,enText)=>en()?enText:tr;

  const openDb=()=>new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)) return reject(new Error('indexeddb-unavailable'));
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'id'});
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('db-open-failed'));
  });

  const dbGet=async id=>{
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(id);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
  };

  const dbPut=async(id,file)=>{
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put({id,blob:file,name:file.name,type:file.type||'application/octet-stream',size:file.size,lastModified:file.lastModified||Date.now()});
      tx.oncomplete=()=>{db.close();resolve();};
      tx.onerror=()=>{db.close();reject(tx.error);};
      tx.onabort=()=>{db.close();reject(tx.error||new Error('db-write-failed'));};
    });
  };

  const dbDelete=async id=>{
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=()=>{db.close();resolve();};
      tx.onerror=()=>{db.close();reject(tx.error);};
    });
  };

  const bytes=n=>{
    n=Number(n)||0;
    if(n<1024)return `${n} B`;
    if(n<1024*1024)return `${(n/1024).toFixed(1)} KB`;
    return `${(n/1024/1024).toFixed(1)} MB`;
  };

  function ensureUi(){
    const pUrl=document.getElementById('pUrl');
    if(!pUrl)return false;
    const urlField=pUrl.closest('.field');
    if(urlField)urlField.id='pPurchaseUrlField';

    if(!document.getElementById('pDownloadFileField')){
      const field=document.createElement('div');
      field.className='field plugin-file-field';
      field.id='pDownloadFileField';
      field.innerHTML=`
        <label id="pDownloadFileLabel" for="pDownloadFile">Plugin dosyası</label>
        <input id="pDownloadFile" type="file" accept=".jar,.zip,.rar,.7z,.tar,.gz,.yml,.yaml,.json,.txt,application/java-archive,application/zip">
        <div class="plugin-file-state">
          <span id="pDownloadFileStatus">Dosya seçilmedi</span>
          <button type="button" class="btn small ghost" id="pDownloadFileRemove">Dosyayı kaldır</button>
        </div>
        <small id="pDownloadFileHelp" class="plugin-file-help">Ücretsiz pluginlerde İndir butonu bu dosyayı doğrudan indirir.</small>`;
      urlField?.insertAdjacentElement('beforebegin',field);
    }

    bindUi();
    setLabels();
    syncMode();
    return true;
  }

  function setLabels(){
    const paid=Number(document.getElementById('pPrice')?.value||0)>0;
    const fileLabel=document.getElementById('pDownloadFileLabel');
    const fileHelp=document.getElementById('pDownloadFileHelp');
    const remove=document.getElementById('pDownloadFileRemove');
    const pUrl=document.getElementById('pUrl');
    const urlLabel=pUrl?.closest('.field')?.querySelector('label');
    if(fileLabel)fileLabel.textContent=msg('Plugin dosyası','Plugin file');
    if(fileHelp)fileHelp.textContent=msg('Ücretsiz pluginlerde İndir butonu bu dosyayı doğrudan indirir.','For free plugins, the Download button downloads this file directly.');
    if(remove)remove.textContent=msg('Dosyayı kaldır','Remove file');
    if(urlLabel)urlLabel.textContent=msg('Satın alma linki','Purchase link');
    if(pUrl)pUrl.placeholder=msg('https://satinalma-siten.com/...','https://your-store.com/...');
    const status=document.getElementById('pDownloadFileStatus');
    if(status && !status.dataset.custom) status.textContent=msg('Dosya seçilmedi','No file selected');
  }

  function syncMode(){
    const paid=Number(document.getElementById('pPrice')?.value||0)>0;
    const fileField=document.getElementById('pDownloadFileField');
    const urlField=document.getElementById('pPurchaseUrlField');
    if(fileField)fileField.hidden=paid;
    if(urlField)urlField.hidden=!paid;
    setLabels();
  }

  function setStatus(text,custom=true){
    const el=document.getElementById('pDownloadFileStatus');
    if(!el)return;
    el.textContent=text;
    if(custom)el.dataset.custom='1'; else delete el.dataset.custom;
  }

  async function showStoredFile(id){
    const input=document.getElementById('pDownloadFile');
    if(input)input.value='';
    pendingRemove=false;
    if(!id){setStatus(msg('Dosya seçilmedi','No file selected'),false);return;}
    try{
      const rec=await dbGet(id);
      if(rec)setStatus(`${rec.name} • ${bytes(rec.size)}`);
      else setStatus(msg('Dosya eklenmemiş','No file uploaded'));
    }catch{setStatus(msg('Dosya bilgisi okunamadı','Could not read file info'));}
  }

  function bindUi(){
    const input=document.getElementById('pDownloadFile');
    if(input && input.dataset.bound!=='1'){
      input.dataset.bound='1';
      input.addEventListener('change',()=>{
        const file=input.files?.[0];
        if(!file){setStatus(msg('Dosya seçilmedi','No file selected'),false);return;}
        if(file.size>MAX_FILE){
          input.value='';
          setStatus(msg('Dosya 150 MB’dan küçük olmalı.','File must be smaller than 150 MB.'));
          if(typeof toast==='function')toast(msg('Dosya 150 MB’dan küçük olmalı.','File must be smaller than 150 MB.'));
          return;
        }
        pendingRemove=false;
        setStatus(`${file.name} • ${bytes(file.size)}`);
      });
    }

    const remove=document.getElementById('pDownloadFileRemove');
    if(remove && remove.dataset.bound!=='1'){
      remove.dataset.bound='1';
      remove.addEventListener('click',()=>{
        if(input)input.value='';
        pendingRemove=true;
        setStatus(msg('Kaydedince dosya kaldırılacak','File will be removed when saved'));
      });
    }

    const price=document.getElementById('pPrice');
    if(price && price.dataset.fileModeBound!=='1'){
      price.dataset.fileModeBound='1';
      price.addEventListener('input',syncMode);
      price.addEventListener('change',syncMode);
    }

    const lang=document.getElementById('languageSelect');
    if(lang && lang.dataset.fileModeBound!=='1'){
      lang.dataset.fileModeBound='1';
      lang.addEventListener('change',()=>setTimeout(()=>{setLabels();syncMode();},20));
    }
  }

  function bumpDownload(id){
    try{
      const key='11_plugin_stats_v1';
      const all=JSON.parse(localStorage.getItem(key)||'{}')||{};
      const row=all[id]&&typeof all[id]==='object'?all[id]:{};
      row.views=Number(row.views)||0;
      row.downloads=(Number(row.downloads)||0)+1;
      row.purchases=Number(row.purchases)||0;
      all[id]=row;
      localStorage.setItem(key,JSON.stringify(all));
    }catch{}
  }

  async function downloadFreePlugin(p){
    let rec=null;
    try{rec=await dbGet(p.id);}catch{}
    if(!rec?.blob){
      if(typeof toast==='function')toast(msg('İndirme dosyası henüz eklenmedi.','Download file has not been added yet.'));
      return;
    }
    const href=URL.createObjectURL(rec.blob);
    const a=document.createElement('a');
    a.href=href;
    a.download=rec.name||p.downloadFileName||`${p.name||'plugin'}.jar`;
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(href),60000);
    bumpDownload(p.id);
  }

  function patchFunctions(){
    if(installed)return true;
    try{
      if(typeof plugins==='undefined'||typeof editPlugin!=='function'||typeof clearPluginForm!=='function'||typeof runPluginAction!=='function')return false;

      const originalEdit=editPlugin;
      editPlugin=function(id){
        const result=originalEdit(id);
        setTimeout(()=>{ensureUi();syncMode();showStoredFile(id);},0);
        return result;
      };
      window.editPlugin=editPlugin;

      const originalClear=clearPluginForm;
      clearPluginForm=function(){
        const result=originalClear();
        pendingRemove=false;
        const input=document.getElementById('pDownloadFile');if(input)input.value='';
        setTimeout(()=>{ensureUi();syncMode();setStatus(msg('Dosya seçilmedi','No file selected'),false);},0);
        return result;
      };
      window.clearPluginForm=clearPluginForm;

      const originalAction=runPluginAction;
      runPluginAction=async function(){
        let p=null;
        try{p=plugins.find(x=>x.id===activeDetailId);}catch{}
        if(!p)return originalAction();
        if(Number(p.price)>0)return originalAction();
        return downloadFreePlugin(p);
      };
      window.runPluginAction=runPluginAction;
      const action=document.getElementById('detailActionBtn');if(action)action.onclick=runPluginAction;

      const form=document.getElementById('pluginForm');
      if(form && form.dataset.fileSubmitBound!=='1'){
        form.dataset.fileSubmitBound='1';
        form.addEventListener('submit',e=>{
          try{
            if(!session?.admin)return;
            ensureUi();
            const idInput=document.getElementById('editId');
            if(idInput && !idInput.value)idInput.value=`p${Date.now()}`;
            const id=(idInput?.value||'').replace(/[^a-zA-Z0-9_-]/g,'');
            const price=Number(document.getElementById('pPrice')?.value||0);
            const pUrl=document.getElementById('pUrl');
            const input=document.getElementById('pDownloadFile');
            const selected=input?.files?.[0]||null;
            const old=plugins.find(x=>x.id===id);
            const oldMeta=old?{downloadFileName:old.downloadFileName||'',downloadFileSize:Number(old.downloadFileSize)||0,hasDownloadFile:!!old.hasDownloadFile}:null;
            if(price<=0 && pUrl)pUrl.value='';

            setTimeout(async()=>{
              const p=plugins.find(x=>x.id===id);
              if(!p)return;
              try{
                if(price>0){
                  await dbDelete(id).catch(()=>{});
                  p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;
                }else if(selected){
                  await dbPut(id,selected);
                  p.downloadFileName=selected.name;
                  p.downloadFileSize=selected.size;
                  p.hasDownloadFile=true;
                  p.url='';
                }else if(pendingRemove){
                  await dbDelete(id).catch(()=>{});
                  p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;p.url='';
                }else if(oldMeta){
                  p.downloadFileName=oldMeta.downloadFileName;
                  p.downloadFileSize=oldMeta.downloadFileSize;
                  p.hasDownloadFile=oldMeta.hasDownloadFile;
                  p.url='';
                }else{
                  p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;p.url='';
                }
                if(typeof savePlugins==='function')savePlugins();
                pendingRemove=false;
              }catch(err){
                console.error('[11_ Studios] plugin file save failed',err);
                if(typeof toast==='function')toast(msg('Plugin dosyası kaydedilemedi. Tarayıcı depolama alanını kontrol et.','Plugin file could not be saved. Check browser storage.'));
              }
            },80);
          }catch(err){console.error('[11_ Studios] file submit hook failed',err);}
        },true);
      }

      installed=true;
      ensureUi();
      syncMode();
      return true;
    }catch(err){console.error('[11_ Studios] plugin file mode failed',err);return false;}
  }

  function init(){
    ensureUi();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      ensureUi();
      if(patchFunctions()||tries>160)clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
