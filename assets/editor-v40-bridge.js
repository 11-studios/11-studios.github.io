(()=>{
  const VERSION='20261016-43';
  function inject(){
    const frame=document.getElementById('siteFrame');if(!frame)return;
    try{
      const win=frame.contentWindow,doc=frame.contentDocument;
      if(!win||!doc)return;
      if(win.__11EditorRuntime41||doc.getElementById('editorRuntime41'))return;
      const s=doc.createElement('script');s.id='editorRuntime41';s.src=`assets/editor-runtime-v37.js?v=${VERSION}`;s.async=false;(doc.body||doc.documentElement).appendChild(s);
    }catch(err){console.warn('[11_ Editor] runtime inject failed',err);}
  }
  function pulseReady(){
    try{
      window.postMessage({type:'11:editor-ready-v41'},location.origin);
      window.postMessage({type:'11:editor-ready-v40'},location.origin);
      window.postMessage({type:'11:editor-ready-v39'},location.origin);
    }catch{}
  }
  function pulseSequence(){
    [0,120,350,800,1600,3000].forEach(ms=>setTimeout(()=>{inject();pulseReady();},ms));
  }
  function init(){
    const frame=document.getElementById('siteFrame');if(!frame)return;
    frame.addEventListener('load',pulseSequence);
    pulseSequence();
    document.getElementById('addTextBtn')?.addEventListener('click',()=>setTimeout(pulseSequence,0));
    document.getElementById('imageInput')?.addEventListener('change',()=>setTimeout(pulseSequence,0));
    document.getElementById('reloadBtn')?.addEventListener('click',()=>setTimeout(pulseSequence,100));
    window.addEventListener('focus',()=>setTimeout(pulseReady,50));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();