(()=>{
  let installed=false;
  let cloudPendingRemove=false;
  const DB_NAME='11_studios_plugin_files',STORE='files';

  const cloud=()=>window.__11Cloud||null;
  const token=()=>cloud()?.getToken?.()||'';
  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const msg=(tr,enText)=>en()?enText:tr;
  const bytes=n=>{n=Number(n)||0;if(n<1024)return `${n} B`;if(n<1024*1024)return `${(n/1024).toFixed(1)} KB`;return `${(n/1024/1024).toFixed(1)} MB`;};

  async function uploadCloud(pluginId,file){
    const c=cloud(),t=token();if(!c?.api||!t||!file)throw new Error('cloud-auth-missing');
    const signed=await c.api('create_upload',{p_token:t,plugin_id:pluginId,file_name:file.name,file_size:file.size});
    if(!signed?.signedUrl||!signed?.path)throw new Error('signed-upload-missing');
    const form=new FormData();
    form.append('cacheControl','3600');
    form.append('',file);
    const r=await fetch(signed.signedUrl,{
      method:'PUT',
      headers:{apikey:c.publishable||c.anon,'x-upsert':'false'},
      body:form,
      credentials:'omit'
    });
    if(!r.ok){let detail='';try{detail=await r.text();}catch{}throw new Error(`upload:${r.status}:${detail.slice(0,180)}`);}
    return signed.path;
  }

  async function deleteCloud(path){
    const c=cloud(),t=token();
    if(!c?.api||!t||!path)return false;
    try{await c.api('delete_upload',{p_token:t,path});return true;}catch(err){console.warn('[11_ Studios] old cloud file cleanup failed',err);return false;}
  }

  function openDb(){return new Promise((resolve,reject)=>{if(!('indexedDB'in window))return reject(new Error('no-indexeddb'));const req=indexedDB.open(DB_NAME,1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function localRecord(id){try{const db=await openDb();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();});}catch{return null;}}

  function findPlugin(id){try{return plugins.find(x=>x.id===id);}catch{return null;}}
  function setStatusForPlugin(id){const p=findPlugin(id),el=document.getElementById('pDownloadFileStatus');if(!el||!p)return;if(p.filePath){el.textContent=`${p.downloadFileName||'plugin.jar'} • ${bytes(p.downloadFileSize)} • ${msg('bulutta','cloud')}`;el.dataset.custom='1';}}

  async function migrateLocalFiles(){
    if(!token())return;
    let changed=false;let list=[];try{list=plugins.filter(p=>p?.hasDownloadFile&&!p?.filePath);}catch{return;}
    for(const p of list){
      const rec=await localRecord(p.id);if(!rec?.blob)continue;
      try{
        const file=new File([rec.blob],rec.name||p.downloadFileName||`${p.name}.jar`,{type:rec.type||'application/octet-stream',lastModified:rec.lastModified||Date.now()});
        p.filePath=await uploadCloud(p.id,file);p.downloadFileName=file.name;p.downloadFileSize=file.size;p.hasDownloadFile=true;changed=true;
      }catch(err){console.error('[11_ Studios] local file migration failed',p.id,err);}
    }
    if(changed){try{if(typeof savePlugins==='function')savePlugins();}catch{}document.dispatchEvent(new CustomEvent('11:catalog-changed'));if(typeof toast==='function')toast(msg('Yerel plugin dosyaları buluta taşındı.','Local plugin files moved to cloud.'));}
  }

  function patch(){
    if(installed)return true;
    try{
      if(typeof plugins==='undefined'||typeof runPluginAction!=='function')return false;
      installed=true;

      const baseAction=runPluginAction;
      runPluginAction=async function(){
        let p=null;try{p=plugins.find(x=>x.id===activeDetailId);}catch{}
        if(p&&Number(p.price)<=0&&p.filePath){const href=cloud()?.publicFileUrl?.(p.filePath);if(href){window.open(href,'_blank','noopener,noreferrer');return;}}
        return baseAction();
      };
      window.runPluginAction=runPluginAction;
      const action=document.getElementById('detailActionBtn');if(action)action.onclick=runPluginAction;

      const form=document.getElementById('pluginForm');
      if(form)form.addEventListener('submit',()=>{
        if(!token())return;
        const id=document.getElementById('editId')?.value||'';
        const input=document.getElementById('pDownloadFile');
        const selected=input?.files?.[0]||null;
        const price=Number(document.getElementById('pPrice')?.value||0);
        const remove=cloudPendingRemove;cloudPendingRemove=false;
        const before=findPlugin(id);const oldPath=before?.filePath||'';
        setTimeout(async()=>{
          const p=findPlugin(id);if(!p)return;
          try{
            if(price>0){
              if(oldPath)await deleteCloud(oldPath);
              p.filePath='';p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;
            }else if(selected){
              const newPath=await uploadCloud(p.id,selected);
              if(oldPath&&oldPath!==newPath)await deleteCloud(oldPath);
              p.filePath=newPath;p.downloadFileName=selected.name;p.downloadFileSize=selected.size;p.hasDownloadFile=true;p.url='';
            }else if(remove){
              if(oldPath)await deleteCloud(oldPath);
              p.filePath='';p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;p.url='';
            }else return;
            if(typeof savePlugins==='function')savePlugins();
            document.dispatchEvent(new CustomEvent('11:catalog-changed'));
            if(typeof toast==='function')toast(msg('Plugin dosyası buluta kaydedildi.','Plugin file saved to cloud.'));
          }catch(err){console.error('[11_ Studios] cloud file upload failed',err);if(typeof toast==='function')toast(err?.status===429?msg('Çok fazla yükleme yapıldı. Biraz sonra tekrar dene.','Too many uploads. Try again shortly.'):msg('Plugin dosyası buluta yüklenemedi.','Plugin file cloud upload failed.'));}
        },1050);
      });

      document.getElementById('pDownloadFileRemove')?.addEventListener('click',()=>{cloudPendingRemove=true;});
      try{if(typeof editPlugin==='function'){const baseEdit=editPlugin;editPlugin=function(id){const r=baseEdit(id);setTimeout(()=>setStatusForPlugin(id),140);return r;};window.editPlugin=editPlugin;}}catch{}
      document.addEventListener('11:cloud-admin-ready',()=>setTimeout(migrateLocalFiles,250));
      if(token())setTimeout(migrateLocalFiles,600);
      return true;
    }catch(err){console.error('[11_ Studios] cloud file patch failed',err);return false;}
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>200)clearInterval(timer);},100);
})();