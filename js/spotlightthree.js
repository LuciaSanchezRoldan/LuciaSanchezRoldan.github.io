
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

const scene = new THREE.Scene();
var pickingScene, camera
var pickingTexture, renderer
var boxGeometry
var bgMaterial, boxMaterial, textMaterial
var backgroundGeo, background
var cube
var controls, text, textGeo;
var offset, duplicated, pickingData, cursorType, canClick, link;
var container, spotLight, lightHelper, shadowCameraHelper;
var width, height;

init();
onWindowResize();
startup();
animate();

function init(){
    offset = new THREE.Vector3( 1, 1, 1 );
    duplicated = false;
    pickingData = [];
    cursorType = 'grab';
    canClick = false;
    link = ""

    pickingScene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );
    renderer = new THREE.WebGLRenderer();
    boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    bgMaterial = new THREE.MeshPhongMaterial( { color: 0x1e1e1e, dithering: true } );
    boxMaterial = new THREE.MeshPhongMaterial( { color: 0xFF1493, dithering: true } );
    textMaterial = new THREE.MeshPhongMaterial( { color: 0xFF1493, dithering: true } );
    cube = new THREE.Mesh( boxGeometry, boxMaterial );
    background = new THREE.Mesh( backgroundGeo, bgMaterial );
    backgroundGeo = new THREE.PlaneBufferGeometry( 100 , 100 );

    const loader = new THREE.FontLoader();

    loader.load( 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

    textGeo = new THREE.TextGeometry( 'Hello three.js!', {
            font: font,
            size: 8,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        } );
    } );

    text = new THREE.Mesh( textGeo, textMaterial );

    container = document.getElementById("container");
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize.bind(this), false );


    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // to apply renderer to the whole scene, without a container
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'mousemove', onMouseMove.bind(this) );

}

function startup() {
    camera.position.z = 5;
    scene.background = new THREE.Color( 0x000000 );

    // const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    // scene.add( ambient );

    spotLight = new THREE.SpotLight( 0xffffff, 1 );
    spotLight.position.set( 0, 0, 10 );
    spotLight.angle = Math.PI / 8;
    spotLight.penumbra = 0;
    spotLight.decay = 1;
    spotLight.distance = 200;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 0;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;

    scene.add( spotLight );
    scene.add( spotLight.target );

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = -1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = -0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    const ambient = new THREE.AmbientLight( 0xffffff, 0.05 );
    scene.add( ambient );

    lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( lightHelper );

    shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
    scene.add( shadowCameraHelper );

    text.position.set(0, 0, 3);
    camera.position.set(0, 2, 13);

    text.castShadow = true;
    scene.add( text );

    background.receiveShadow = true;
    scene.add( background );
}

function onMouseMove( e ) {

    var x = e.clientX;
    var y = e.clientY;

    var scale = 17;

    spotLight.target.position.x = -scale + 2*scale*x/width;
    spotLight.target.position.y = scale -2*scale*y/height;

  }

function animate() {

    requestAnimationFrame( animate );

    controls.update();
    lightHelper.update();
    shadowCameraHelper.update();

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}

function onWindowResize() {
    width = container.clientWidth;
    height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
}