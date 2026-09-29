document.addEventListener('DOMContentLoaded',()=>{
 const buttons=[...document.querySelectorAll('[data-lang]')];
 const sync=()=>buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===OBTPLang.get())));
 buttons.forEach(b=>b.addEventListener('click',()=>OBTPLang.set(b.dataset.lang)));
 window.addEventListener('obtp:language',sync);sync();
});
