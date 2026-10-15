(()=>{
  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/site-enhancements.css?v=20261015-13';
  document.head.appendChild(css);

  const fileCss=document.createElement('link');
  fileCss.rel='stylesheet';
  fileCss.href='assets/plugin-files.css?v=20261015-13';
  document.head.appendChild(fileCss);

  const legacy=document.createElement('script');
  legacy.src='assets/app-media.js?v=20261015-13';
  legacy.async=false;
  legacy.addEventListener('load',()=>{
    const extra=document.createElement('script');
    extra.src='assets/site-enhancements.js?v=20261015-13';
    extra.async=false;
    extra.addEventListener('load',()=>{
      const files=document.createElement('script');
      files.src='assets/plugin-files.js?v=20261015-13';
      files.async=false;
      document.head.appendChild(files);
    });
    document.head.appendChild(extra);
  });
  document.head.appendChild(legacy);
})();
