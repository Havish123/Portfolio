document.addEventListener("DOMContentLoaded", () => {
    setTimeout(()=>{
        document.getElementById("banter-loader").style.display = "none";
    }, 1000);
});

function checkWidth() {
    let width = window.innerWidth;
    let boxes = document.querySelectorAll(".box");
    if (width > 1000) {
        boxes.forEach((box) => {
            box.addEventListener("mouseenter", () => {
                box.classList.add("hover");
            });
            box.addEventListener("mouseleave", () => {
                box.classList.remove("hover");
            })
        });
    }
}

checkWidth();
window.addEventListener('resize', checkWidth);


var isMenu = false;
function myFunction(x) {
    let menu = document.getElementById("navMenu");
    x.classList.toggle("change");
    if(isMenu){
        menu.style.display = "none";
        isMenu = false;
    }
    else{
        menu.style.display = "block";
        isMenu = true;
    }
}

window.addEventListener("scroll", ()=>{
    const currentScrollPos = window.scrollY;
    var head = document.querySelector("header");
    var pic1 = document.querySelector(".Background-Image");
    var pic2 = document.querySelector(".Background-Image1");
    if(currentScrollPos > 130){
        head.style.backgroundColor = "rgb(22, 22, 22)";    
    }
    else{
        head.style.backgroundColor = "transparent";
    }
    if(currentScrollPos > 550){
        pic1.style.display = "none";
        pic2.style.display = "block"
    }
    else{
        pic1.style.display = "block"
        pic2.style.display = "none";
    }
})