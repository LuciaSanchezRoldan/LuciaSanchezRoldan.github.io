

var translateDistance;
var images, focusPos;
var offset = 50;

init();
onWindowResize();
update();

function init(){

    offset = 50

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

    var is_touch_device = 'ontouchstart' in document.documentElement;
    //redirect to homepage if a touch device
    if(is_touch_device){
        var arrows = document.getElementsByClassName("arrow")
        for(var i=0; i < arrows.length; i++){
            arrows[i].style.width='15%'
        }
    }

    window.addEventListener( 'resize', onWindowResize.bind(this), false );


    images = document.getElementsByClassName('imgLink');

    //make all the images the same width so that the panning behaviour works well
    for(var i=0; i<images.length; i++){
        images[i].firstElementChild.style.width = "'" + images[0].firstElementChild.clientWidth + "px'"
        if(images[i].firstElementChild.style.width == "" || images[i].firstElementChild.clientWidth == 0){
            images[i].firstElementChild.style.width = "" + images[0].firstElementChild.clientHeight*1.3 + "px"
        }
    }

    focusPos = Array.prototype.indexOf.call(images, images['focus']);

}

function linkHover(e){
    e.target.parentElement.style.background = 'black';
    e.target.parentElement.lastElementChild.style.border= "5px solid black"
}

function linkLeave(e){
    e.target.parentElement.style.background = 'white';
    e.target.parentElement.lastElementChild.style.border= "5px solid #79bca0"
}

function update(){

    images[focusPos].id = 'focus';
    images[focusPos].style.zIndex = '10';

    var translateValue = 100*((images.length/2)-focusPos) - offset;

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

    images[focusPos].id = 'unfocus';
    images[focusPos].style.zIndex = '0';
    focusPos = focusPos - 1;

    update();

}

function rightClick(){

    document.getElementById('arrow-left').style.visibility = 'visible';

    images[focusPos].id = 'unfocus';
    images[focusPos].style.zIndex = '0';
    focusPos = focusPos + 1;

    update();

}

function onWindowResize() {

    width = document.getElementsByClassName('imageFocus')[0].clientWidth;
    height = document.getElementsByClassName('imageFocus')[0].clientHeight;

    isMiniGallery = document.getElementsByClassName('mini').length

    // if (width/height < 1 && isMiniGallery == 0){
    //     console.log('too wide')
    //     offset = 75
    //     update();
    // }
    console.log('not wide enuf')
    offset = 50
    update();
    
}

