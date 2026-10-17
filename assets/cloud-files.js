(()=>{
  let installed=false;
  let cloudPendingRemove=false;
  let uploadBusy=false;
  const DB_NAME='11_studios_plugin_files',STORE='files';

  const cloud=()=>window.__11Cloud||null;
  const token=()=>cloud()?.getToken?.()||'';
  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const msg=(tr,enText)=>en()?enText:tr;
  const bytes=n=>{n=Number(n)||0;if(n<1024)return `${n} B`;if(n<1024*1024)return `${(n/1024).toFixed(1)} KB`;return `${(n/1024/1024).toFixed(1)} MB`;};

  function signedUrl(c,value){
    const s=String(value||'');
    if(/^https:\/\//i.test(s))return s;
    if(s.startsWith('/'))return `${c.url}${s}`;
    return `${c.url}/${s.replace(/^\/+/, '')}`;
  }

  async function uploadCloud(pluginId,file){
    const c=cloud(),t=token();
    if(!c?.api||!t||!file)throw new Error('cloud-auth-missing');
    const signed=await c.api('create_upload',{p_token:t,plugin_id:pluginId,file_name:file.name,file_size:file.size});
    if(!signed?.signedUrl||!signed?.path)throw new Error('signed-upload-missing');
    const key=c.publishable||c.anon||'';
    const headers={
      'Content-Type':file.type||'application/octet-stream',
      'x-upsert':'false'
    };
    if(key){headers.apikey=key;headers.Authorization=`Bearer ${key}`;}
    const r=await fetch(signedUrl(c,signed.signedUrl),{
      method:'PUT',headers,body:file,credentials:'omit',cache:'no-store'
    });
    if(!r.ok){let detail='';try{detail=await r.text();}catch{}throw new Error(`upload:${r.status}:${detail.slice(0,240)}`);}
    return String(signed.path);
  }

  async function deleteCloud(path){
    const c=cloud(),t=token();
    if(!c?.api||!t||!path)return false;
    try{await c.api('delete_upload',{p_token:t,path});return true;}catch(err){console.warn('[11_ Studios] old cloud file cleanup failed',err);return false;}
  }

  function openDb(){return new Promise((resolve,reject)=>{if(!('indexedDB'in window))return reject(new Error('no-indexeddb'));const req=indexedDB.open(DB_NAME,1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function localRecord(id){try{const db=await openDb();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();});}catch{return null;}}

  function findPlugin(id){try{return plugins.find(x=>x.id===id);}catch{return null;}}
  function setStatusForPlugin(id){
    const p=findPlugin(id),el=document.getElementById('pDownloadFileStatus');
    if(!el||!p)return;
    if(p.filePath){el.textContent=`${p.downloadFileName||'plugin.jar'} • ${bytes(p.downloadFileSize)} • ${msg('bulutta hazır','ready in cloud')}`;el.dataset.custom='1';}
  }

  async function persistPluginFileState(p,showToast=true){
    try{if(typeof savePlugins==='function')savePlugins();}catch{}
    const c=cloud();
    if(c?.pushAll&&token())await c.pushAll(showToast);
  }

  async function migrateLocalFiles(){
    if(!token()||uploadBusy)return;
    let list=[];try{list=plugins.filter(p=>p?.hasDownloadFile&&!p?.filePath);}catch{return;}
    if(!list.length)return;
    uploadBusy=true;
    let changed=false;
    try{
      for(const p of list){
        const rec=await localRecord(p.id);if(!rec?.blob)continue;
        try{
          const file=new File([rec.blob],rec.name||p.downloadFileName||`${p.name||'plugin'}.jar`,{type:rec.type||'application/octet-stream',lastModified:rec.lastModified||Date.now()});
          p.filePath=await uploadCloud(p.id,file);
          p.downloadFileName=file.name;p.downloadFileSize=file.size;p.hasDownloadFile=true;p.url='';changed=true;
        }catch(err){console.error('[11_ Studios] local file migration failed',p.id,err);}
      }
      if(changed){
        await persistPluginFileState(null,false);
        if(typeof toast==='function')toast(msg('Plugin dosyaları buluta aktarıldı.','Plugin files moved to cloud.'));
      }
    }finally{uploadBusy=false;}
  }

  async function applyCloudFileChange(snapshot){
    if(!snapshot?.id||!token())return;
    const {id,selected,price,remove,oldPath}=snapshot;
    let p=findPlugin(id);
    if(!p){
      for(let i=0;i<15&&!p;i++){await new Promise(r=>setTimeout(r,40));p=findPlugin(id);}
    }
    if(!p)return;

    try{
      uploadBusy=true;
      if(price>0){
        if(oldPath)await deleteCloud(oldPath);
        p.filePath='';p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;
      }else if(selected){
        if(typeof toast==='function')toast(msg('Plugin dosyası buluta yükleniyor…','Uploading plugin file to cloud…'));
        const newPath=await uploadCloud(p.id,selected);
        if(oldPath&&oldPath!==newPath)await deleteCloud(oldPath);
        p.filePath=newPath;
        p.downloadFileName=selected.name;
        p.downloadFileSize=selected.size;
        p.hasDownloadFile=true;
        p.url='';
      }else if(remove){
        if(oldPath)await deleteCloud(oldPath);
        p.filePath='';p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;p.url='';
      }else{
        return;
      }

      await persistPluginFileState(p,false);
      setStatusForPlugin(p.id);
      if(typeof renderPlugins==='function')renderPlugins();
      if(typeof toast==='function')toast(selected?msg('Plugin dosyası buluta kaydedildi. Artık diğer tarayıcılardan da indirilebilir.','Plugin file saved to cloud. It can now be downloaded from other browsers.'):msg('Plugin dosya değişikliği tüm cihazlara kaydedildi.','Plugin file change saved for all devices.'));
    }catch(err){
      console.error('[11_ Studios] cloud file upload failed',err);
      if(typeof toast==='function')toast(msg('Plugin dosyası buluta yüklenemedi. Tekrar kaydetmeyi dene.','Plugin file could not be uploaded to cloud. Try saving again.'));
    }finally{uploadBusy=false;}
  }

  function patch(){
    if(installed)return true;
    try{
      if(typeof plugins==='undefined'||typeof runPluginAction!=='function')return false;
      installed=true;

      const baseAction=runPluginAction;
      runPluginAction=async function(){
        let p=null;try{p=plugins.find(x=>x.id===activeDetailId);}catch{}
        if(p&&Number(p.price)<=0&&p.filePath){
          const href=cloud()?.publicFileUrl?.(p.filePath);
          if(href){
            const a=document.createElement('a');
            a.href=href;
            a.download=p.downloadFileName||`${p.name||'plugin'}.jar`;
            a.rel='noopener noreferrer';
            a.style.display='none';
            document.body.appendChild(a);a.click();a.remove();
            return;
          }
        }
        return baseAction();
      };
      window.runPluginAction=runPluginAction;
      const action=document.getElementById('detailActionBtn');if(action)action.onclick=runPluginAction;

      const form=document.getElementById('pluginForm');
      if(form&&form.dataset.cloudFileSubmitBound!=='1'){
        form.dataset.cloudFileSubmitBound='1';
        form.addEventListener('submit',()=>{
          if(!token())return;
          const id=(document.getElementById('editId')?.value||'').replace(/[^A-Za-z0-9_-]/g,'');
          const input=document.getElementById('pDownloadFile');
          const selected=input?.files?.[0]||null;
          const price=Number(document.getElementById('pPrice')?.value||0);
          const remove=cloudPendingRemove;
          const before=findPlugin(id);
          const oldPath=before?.filePath||'';
          cloudPendingRemove=false;
          const snapshot={id,selected,price,remove,oldPath};
          setTimeout(()=>applyCloudFileChange(snapshot),0);
        },true);
      }

      const removeBtn=document.getElementById('pDownloadFileRemove');
      if(removeBtn&&removeBtn.dataset.cloudBound!=='1'){
        removeBtn.dataset.cloudBound='1';
        removeBtn.addEventListener('click',()=>{cloudPendingRemove=true;});
      }

      try{
        if(typeof editPlugin==='function'&&!editPlugin.__11CloudFileWrapped){
          const baseEdit=editPlugin;
          const wrapped=function(id){const r=baseEdit(id);setTimeout(()=>setStatusForPlugin(id),170);return r;};
          wrapped.__11CloudFileWrapped=true;editPlugin=wrapped;window.editPlugin=wrapped;
        }
      }catch{}

      document.addEventListener('11:cloud-admin-ready',()=>setTimeout(migrateLocalFiles,150));
      document.addEventListener('11:cloud-synced',()=>{try{if(activeDetailId&&typeof renderPluginDetail==='function')renderPluginDetail(activeDetailId);}catch{}});
      if(token())setTimeout(migrateLocalFiles,300);
      return true;
    }catch(err){console.error('[11_ Studios] cloud file patch failed',err);return false;}
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>200)clearInterval(timer);},50);
})();
