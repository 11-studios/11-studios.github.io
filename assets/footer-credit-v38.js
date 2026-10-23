(()=>{
  const install=()=>{
    const footer=document.querySelector('.footer');
    if(!footer)return false;
    const credit=footer.querySelector('.made-by-sems');
    if(!credit)return false;
    if(footer.querySelector('.footer-owner-note'))return true;

    const line=document.createElement('div');
    line.className='footer-owner-line';
    credit.parentNode.insertBefore(line,credit);
    line.appendChild(credit);

    const sep=document.createElement('span');
    sep.className='footer-owner-sep';
    sep.textContent='•';

    const note=document.createElement('span');
    note.className='footer-owner-note';
    note.textContent='Bu site ve bu sitede paylaşılan tüm projeler sems11_ tarafından yapılmıştır. İletişim - Discord: sems11_';

    line.append(sep,note);
    return true;
  };

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(install()||tries>120)clearInterval(timer);
    },100);
  }
})();
