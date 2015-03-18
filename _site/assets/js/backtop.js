function toTopHide(){
    document.documentElement.scrollTop+document.body.scrollTop > 1000 ? document.getElementById("toTop").style.display="block" : document.getElementById("toTop").style.display="none";
}
window.onscroll=toTopHide;
