
import { TrackballControls } from './TrackballControls.js';

var scene, pickingScene, camera
var pickingTexture, renderer
var boxGeo, bgGeo
var bgMaterial, boxMaterial, textMaterials
var backgroundObj, cube
var controls, textGeo, textMesh;
var offset, duplicated, pickingData, cursorType, canClick, link;
var container, spotLight, lightHelper, shadowCameraHelper;
var width, height;
var font;
const text ='l i g h t i n g   d e s i g n e r';
const text2 ='l i g h t i n g    p r o g r a m m e r';
var text3 ='c l i c k   t o   e n t e r';
var text4 = ' '
const textPos1 = 3, textPos2 = 1, textPos3 = -8;
const textHeight = 1.5
const textScale1 = 1.3, textScale2 = 1, textScale3 = 1.5, textCurveSegments = 4;

var color1 = 0x58ac89;
var color2 = 0x2e8b57;
var color3 = 0xFF1493;
var darkGrey = 0xa9a9a9;
var colorblack = 0x000000;
var colorwhite = 0xffffff

init();
onWindowResize();
startup();
animate();
clickThrough();

function clickThrough(e){
    if(e==undefined){
        return;
    }
    window.location.href = 'main.html';
}

function init(){

    scene = new THREE.Scene();
    scene.background = new THREE.Color( color1 );
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );
    renderer = new THREE.WebGLRenderer();

    //BOXOBJECT

    boxGeo = new THREE.BoxGeometry( 1, 1, 1 );
    boxMaterial = new THREE.MeshPhongMaterial( { color: color1, dithering: true } );
    cube = new THREE.Mesh( boxGeo, boxMaterial );    //TEXTMATERIALS

    textMaterials = [
        new THREE.MeshPhongMaterial( { color: color1, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: colorblack, flatShading: true } ) // side
    ];

    //BACKGROUND

    bgGeo = new THREE.PlaneBufferGeometry( 30 , 200 );
    bgGeo.rotateX(Math.PI/20);

    bgMaterial = new THREE.MeshPhongMaterial( { color: 0x1e1e1e, flatShading: true } );
    backgroundObj = new THREE.Mesh( bgGeo, bgMaterial );

    //CONTROLS

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = -1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = -0.8;
    controls.noZoom = true;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    window.addEventListener( 'resize', onWindowResize.bind(this), false );
    window.addEventListener( 'click', clickThrough );
    var is_touch_device = 'ontouchstart' in document.documentElement;
    //redirect to homepage if a touch device
    if(is_touch_device){
        text3 = text4;
        // window.addEventListener( 'ontouchend', clickThrough );
    }

    //LIGHT

    spotLight = new THREE.SpotLight( color1, 5 );
    spotLight.position.set( 0, 0, 10 );
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0;
    spotLight.decay = 0;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 0;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;

    scene.add( spotLight );
    scene.add( spotLight.target );

    //RENDERER
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container = document.getElementById("container");
    container.appendChild( renderer.domElement );
    renderer.domElement.addEventListener( 'mousemove', onMouseMove.bind(this) );

}

function startup() {

    loadFont();

    const ambient = new THREE.AmbientLight( 0xffffff, 0.05 );
    scene.add( ambient );

    cube.position.set(0, 0, 3);
    camera.position.set(0, 10, 17);
    cube.castShadow = true;

    backgroundObj.receiveShadow = true;
    scene.add( backgroundObj );
}

function onMouseMove( e ) {

    var x = e.clientX;
    var y = e.clientY;

    var scale = 17;

    spotLight.target.position.x = -scale + 2*scale*x/width;
    spotLight.target.position.y = scale -2*scale*y/height;

}

function loadFont() {

    const loader = new THREE.FontLoader();
    loader.load( 'assets/fonts/helvetiker_bold.typeface.json',  function ( response ) {
        font = response;
        createText( text, textPos1, textScale1 )
        createText( text2, textPos2, textScale2 )
        createText( text3, textPos3, textScale3 )
    } );

}

function createText(t, p, s) {

    textGeo = new THREE.TextGeometry( t, {

        font: font,
        size: s,
        height: textHeight,
        curveSegments: textCurveSegments

    } );

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    const triangle = new THREE.Triangle();

    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

    const triangleAreaHeuristics = 0.1 * ( textHeight * s );

    for ( let i = 0; i < textGeo.faces.length; i ++ ) {

        const face = textGeo.faces[ i ];

        if ( face.materialIndex == 1 ) {

            for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                face.vertexNormals[ j ].z = 0;
                face.vertexNormals[ j ].normalize();

            }

            const va = textGeo.vertices[ face.a ];
            const vb = textGeo.vertices[ face.b ];
            const vc = textGeo.vertices[ face.c ];

            const s = triangle.set( va, vb, vc ).getArea();

            if ( s > triangleAreaHeuristics ) {

                for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                    face.vertexNormals[ j ].copy( face.normal );

                }

            }

        }

    }

    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
    textMesh = new THREE.Mesh( textGeo, textMaterials );
    textMesh.position.y = p;
    textMesh.position.x = centerOffset;
    // textMesh.position.z = p;
    scene.add( textMesh );

}

function animate() {

    requestAnimationFrame( animate );

    controls.update();
    // lightHelper.update();
    // shadowCameraHelper.update();

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}

function onWindowResize() {

    var fullsize = container.parentElement

    width = fullsize.clientWidth;
    height = fullsize.clientHeight;

    if (width/height >= 0.9){
        console.log('alright');
        height = fullsize.clientHeight;
    }
    if (width/height < 0.9){
        console.log('too narrow1');
        height = fullsize.clientHeight*0.7
    }
    if (width/height < 0.82){
        console.log('too narrow2');
        height = fullsize.clientHeight*0.5
    }

    container.style.height = height;
    container.style.width = width;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
}