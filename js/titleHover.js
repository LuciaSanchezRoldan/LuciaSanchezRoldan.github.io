let title = document.getElementById("title");

if(title!=undefined){
    title.addEventListener('mouseenter', linkHover);
    title.addEventListener('mouseleave', linkLeave);
}

function linkHover(e){
    e.target.parentElement.style.background = 'black';
    e.target.parentElement.lastElementChild.style.border= "5px solid black"
}

function linkLeave(e){
    e.target.parentElement.style.background = 'white';
    e.target.parentElement.lastElementChild.style.border= "5px solid #79bca0"
}