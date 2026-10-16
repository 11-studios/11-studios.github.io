(()=>{
  function inject(){
    const frame=document.getElementById('siteFrame');
    if(!frame)return;
    try{
      const win=frame.contentWindow,doc=frame.contentDocument;
      if(!win||!doc||win.__11EditorRuntime40||doc.getElementById('editorRuntime40'))return;
      const s=doc.createElement('script');
      s.id='editorRuntime40';
      s.src='assets/editor-runtime-v37.js?v=20261016-40';
      s.async=false;
      (doc.body||doc.documentElement).appendChild(s);
    }catch(err){console.warn('[11_ Editor] v40 runtime inject failed',err);}
  }
  function init(){
    const frame=document.getElementById('siteFrame');
    if(!frame)return;
    frame.addEventListener('load',()=>setTimeout(inject,0));
    setTimeout(inject,300);
    setTimeout(inject,1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();