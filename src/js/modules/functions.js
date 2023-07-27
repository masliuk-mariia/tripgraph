//Check if browser support webp

export function isWeb(){
  function testWebP(callback){
    let webP = new Image();
    webP.onload = webP.onerror = function(){
      callback(webP.height == 2);
    };
    webP.src="data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";

  }
  testWebP(function(support){
    let className = support === true ? 'webp' : 'no-webp';
    document.documentElement.classList.add(className); 
  });
}

export function isActiveMenu(){
  const nav = document.querySelector(".nav__body");
  if (!nav){return;}
  const items = nav.querySelectorAll(".nav__link");
  items.forEach(cur => {
    if (cur.href == window.location.href){
      cur.parentElement.classList.add("nav__item_active");
    }
  })
}

export function registerSubmit(){
  const registerFrm = document.querySelector("#register_frm");
  if (!registerFrm) return;
  registerFrm.addEventListener("submit", (e)=>{
    e.preventDefault();
    document.location.href="trips.html";
  })
}