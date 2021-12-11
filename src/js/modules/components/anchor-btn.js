import throttle from "lodash.throttle";

const archorRef = document.querySelector('.anchor-btn');

window.onscroll = throttle(scrollFunction, 200);
archorRef.addEventListener("click", smoothScroll);

function scrollFunction() {
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
      archorRef.classList.add("anch-btn-active");

    } else {
      archorRef.classList.remove("anch-btn-active");
    }
}
  
function smoothScroll(e) {
  e.preventDefault() 
  const id = archorRef.getAttribute('href');
  
  document.querySelector(id).scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
};