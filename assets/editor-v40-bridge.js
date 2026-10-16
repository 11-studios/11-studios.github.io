(()=>{
  if(window.__11EditorBridge44)return;window.__11EditorBridge44=true;
  const VERSION='20261016-44';

  function frame(){return document.getElementById('siteFrame');}

  function inject(){
    const f=frame();if(!f)return;
    try{
      const win=f.contentWindow,doc=f.contentDocument;
      if(!win||!doc)return;
      if(win.__11EditorRuntime44||doc.getElementById('editorRuntime44'))return;
      const s=doc.createElement('script');
      s.id='editorRuntime44';
      s.src=`assets/editor-runtime-v37.js?v=${VERSION}`;
      s.async=false;
      (doc.body||doc.documentElement).appendChild(s);
    }catch(err){console.warn('[11_ Editor] runtime inject failed',err);}
  }

  function requestSync(){
    try{window.postMessage({type:'11:editor-ready-v44'},location.origin);}catch{}
  }

  function pulseSequence(){[0,100,280,650,1300,2500].forEach(ms=>setTimeout(()=>{inject();requestSync();},ms));}

  function init(){
    const f=frame();if(!f)return;
    f.addEventListener('load',pulseSequence);
    pulseSequence();
    document.getElementById('addTextBtn')?.addEventListener('click',()=>setTimeout(pulseSequence,0));
    document.getElementById('imageInput')?.addEventListener('change',()=>setTimeout(pulseSequence,0));
    document.getElementById('reloadBtn')?.addEventListener('click',()=>setTimeout(pulseSequence,100));
    window.addEventListener('focus',()=>setTimeout(requestSync,50));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();