let title = document.getElementById("title");
let links = document.getElementsByClassName("homelinksShort");
let header = document.getElementById("header");

for(var i=0; i < links.length; i++){
    var link = links[i]
    if(link!=undefined){
        link.addEventListener('mouseenter', linkHover);
        link.addEventListener('mouseleave', linkLeave);
    }
}

if(title!=undefined){
    title.addEventListener('mouseenter', linkHover);
    title.addEventListener('mouseleave', linkLeave);
}

function linkHover(e){
    header.style.background = 'black';
    header.lastElementChild.style.border= "5px solid black"
}

function linkLeave(e){
    header.style.background = 'white';
    header.lastElementChild.style.border= "5px solid #79bca0"
}