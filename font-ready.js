(()=>{
  const reveal=()=>document.documentElement.classList.remove('font-loading');
  if(!document.fonts){reveal();return;}
  // Reveal the completed interface only after its actual font is ready.
  document.fonts.load('700 20px OkDanDan').then(reveal,reveal);
})();
