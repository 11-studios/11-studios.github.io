(()=>{
  const exact=document.createElement('script');
  exact.src='assets/ataturk-exact.js?v=20261015-18';
  exact.async=false;
  document.head.appendChild(exact);

  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/site-enhancements.css?v=20261015-15';
  document.head.appendChild(css);

  const fileCss=document.createElement('link');
  fileCss.rel='stylesheet';
  fileCss.href='assets/plugin-files.css?v=20261015-15';
  document.head.appendChild(fileCss);

  const legacy=document.createElement('script');
  legacy.src='assets/app-media.js?v=20261015-15';
  legacy.async=false;
  legacy.addEventListener('load',()=>{
    const extra=document.createElement('script');
    extra.src='assets/site-enhancements.js?v=20261015-15';
    extra.async=false;
    extra.addEventListener('load',()=>{
      const files=document.createElement('script');
      files.src='assets/plugin-files.js?v=20261015-15';
      files.async=false;
      document.head.appendChild(files);
    });
    document.head.appendChild(extra);
  });
  document.head.appendChild(legacy);
})();
