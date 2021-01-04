const scene = new THREE.Scene();
const pickingScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const light = new THREE.SpotLight( 0xffffff, 1.5 );
const pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );
const renderer = new THREE.WebGLRenderer();
var mouse = new THREE.Vector2();
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const cube = new THREE.Mesh( geometry, material );

init();
onWindowResize();
startup();
animate();

function init(){
    mousePosX = "0px";
    mousePosY = "0px";
    offset = new THREE.Vector3( 1, 1, 1 );
    duplicated = false;
    pickingData = [];
    cursorType = 'grab';
    canClick = false;
    link = ""

    container = document.getElementById("container");
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize.bind(this), false );

    // to apply renderer to the whole scene, without a container
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );
}

function startup() {
    camera.position.z = 5;
    scene.background = new THREE.Color( 0x424242 );

    scene.add( new THREE.AmbientLight( 0x555555 ) );

    light.position.set( 0, 500, 20000 );
    scene.add( light );

    scene.add( cube );
}

function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}

function onWindowResize() {
    var width = this.container.clientWidth;
    var height = this.container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
}