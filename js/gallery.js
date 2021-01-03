

var translateDistance;
var images, focusPos;

init()

function init(){

    document.addEventListener('keydown', function(e) {
        switch (e.key) {
            case "ArrowLeft":
                leftClick()
                break;
            case "ArrowRight":
                rightClick()
                break;
        }
    });

    let title = document.getElementById("title");

    if(title!=undefined){
        title.addEventListener('mouseenter', linkHover);
        title.addEventListener('mouseleave', linkLeave);
    }

    // window.addEventListener("resize",setupOffset)

    images = document.getElementsByClassName('imgLink');
    focusPos = Array.prototype.indexOf.call(images, images['focus']);

    update();

}

function linkHover(e){
    e.target.parentElement.style.background = 'black';
    e.target.parentElement.lastElementChild.style.border= "5px solid black"
}

function linkLeave(e){
    e.target.parentElement.style.background = 'white';
    e.target.parentElement.lastElementChild.style.border= "5px solid #1e1e1e"
}

function update(){
    var translateValue = 100*((images.length/2)-focusPos) - 50;

    if (focusPos == images.length-1){
        document.getElementById('arrow-right').style.visibility = 'hidden';
    }
    if (focusPos == 0){
        document.getElementById('arrow-left').style.visibility = 'hidden';
    }

    for(var i=0; i<images.length; i++){
        images[i].style.transform = "translateX(" + translateValue + "%) scale(" + 0.8 + ")"
    }

    images[focusPos].style.transform = "translateX(" + translateValue + "%) scale(" + 1 + ")"

    updateText();
}

function updateText(){
    var infoText = document.getElementById('info');
    infoText.innerHTML = images[focusPos].firstElementChild.alt;
}

function leftClick(){

    document.getElementById('arrow-right').style.visibility = 'visible';

    if (focusPos > 0){

        images[focusPos].id = 'unfocus';
        images[focusPos].style.zIndex = '0';
        focusPos = focusPos - 1;
        images[focusPos].id = 'focus';
        images[focusPos].style.zIndex = '10';

        update();

    }

}

function rightClick(){

    document.getElementById('arrow-left').style.visibility = 'visible';

    if (focusPos < images.length-1){

        images[focusPos].id = 'unfocus';
        images[focusPos].style.zIndex = '0';
        focusPos = focusPos + 1;
        images[focusPos].id = 'focus';
        images[focusPos].style.zIndex = '10';

        update();

    }

}

