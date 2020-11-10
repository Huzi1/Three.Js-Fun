
import {
    Vector3,
    Mesh,
    MeshBasicMaterial,
    SphereGeometry,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Matrix4,
    TextureLoader,
} from '/build/three.module.js';


const container = document.querySelector('#scene-container');
const pause = document.getElementById('pause');
const draw = document.getElementById('draw');




let scene;
let renderer;
let camera;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let fov = 75;
let lon = 0;
let lat = 0;
let phi = 0;
let theta = 0;
const nearPlane = 1;
const farPlane = 1000;
let aspect = windowWidth / windowHeight;
const dpr = window.devicePixelRatio;
let sphereMaterial;
let isManual = false;
let lastMouseX = 0;
let lastMouseY = 0;
let lastLon = 0;
let lastLat = 0;


function init() {
    renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize(windowWidth, 0.8 * windowHeight);
    renderer.setPixelRatio(dpr);
    renderer.domElement.className = 'panView'
    container.appendChild(renderer.domElement);
    scene = new Scene();
    camera = new PerspectiveCamera(75, aspect, nearPlane, farPlane);
    camera.target = new Vector3(0, 0, 0);
   
    createSphere();
    initEventListeners();
    animate();
}
window.onload = init;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 0.8 * window.innerHeight);
   

    render();
}, false);


function createSphere() {
    const sphere = new SphereGeometry(100, 100, 40);
    // or we can use just sphere.scale(-1, 1, 1);

    // var texture = new Texture(canvas);
    // texture.needsUpdate = true;

    sphere.applyMatrix4(new Matrix4().makeScale(-1, 1, 1));
    sphereMaterial = new MeshBasicMaterial();
    sphereMaterial.map = new TextureLoader().load('hills.jpg')
    const sphereMesh = new Mesh(sphere, sphereMaterial);
    // sphereMesh.layers.set(0)
    scene.add(sphereMesh);
}



function initEventListeners() {
    container.addEventListener('mousedown', handleDocumentMouseDown, false);
    container.addEventListener('mousemove', handleDocumentMouseMove, false);
    container.addEventListener('mouseup', handleDocumentMouseUp, false);
    container.addEventListener('touchstart', handleDocumentMouseDown, false);
    container.addEventListener('touchmove', handleDocumentMouseMove, false);
    container.addEventListener('touchend', handleDocumentMouseUp, false);
    pause.addEventListener('click', onclick);
    draw.addEventListener('click', onToggle);


}
// pause roation
function onclick(event) {
    if (event.target.checked) {
        // event.preventDefault();
        isManual = true;
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;

        lastMouseX = clientX;
        lastMouseY = clientY;
        lastLon = lon;
        lastLat = lat;
        document.getElementById('swLabel').innerHTML = "Toggle for animate mode"
        document.getElementById('draw').disabled = false
    }
    else {
        isManual = false
        document.getElementById('swLabel').innerHTML = "Toggle this switch for drawing mode"
        document.getElementById('draw').disabled = true
    }
}
// Draw Toggle
function onToggle(event) {
    if (event.target.checked) {

        container.removeEventListener('mousedown', handleDocumentMouseDown, false);
        container.removeEventListener('mousemove', handleDocumentMouseMove, false);
        container.removeEventListener('mouseup', handleDocumentMouseUp, false);
        container.removeEventListener('touchstart', handleDocumentMouseDown, false);
        container.removeEventListener('touchmove', handleDocumentMouseMove, false);
        container.removeEventListener('touchend', handleDocumentMouseUp, false);
        document.getElementById('undo').disabled = false;

    }
    else {
        container.addEventListener('mousedown', handleDocumentMouseDown, false);
        container.addEventListener('mousemove', handleDocumentMouseMove, false);
        container.addEventListener('mouseup', handleDocumentMouseUp, false);
        container.addEventListener('touchstart', handleDocumentMouseDown, false);
        container.addEventListener('touchmove', handleDocumentMouseMove, false);
        container.addEventListener('touchend', handleDocumentMouseUp, false);
        document.getElementById('undo').disabled = true;

    }
}

function animate() {
    requestAnimationFrame(animate);
    if (!isManual && !pause.checked) {
        lat += 0.1;
    }
    phi = (90 - lat) * Math.PI / 180;
    theta = lon * Math.PI / 180;
    // Transform from Spherical to Cartesian coordinates
    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.sin(phi) * Math.sin(theta);
    camera.target.z = 500 * Math.cos(phi);
    camera.lookAt(camera.target);
    render();
}
function render() {
    renderer.render(scene, camera);
}

// when the mouse is pressed, we switch to manual control and save current coordinates
function handleDocumentMouseDown(event) {
    event.preventDefault();
    isManual = true;


    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;

    lastMouseX = clientX;
    lastMouseY = clientY;
    lastLon = lon;
    lastLat = lat;
}
// when the mouse moves, if in manual control we adjust coordinates
function handleDocumentMouseMove(event) {
    if (isManual) {
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        lat = (clientX - lastMouseX) * 0.1 + lastLat;
        lon = (clientY - lastMouseY) * 0.1 + lastLon;
    }
}
// when the mouse is released, we turn manual control off
function handleDocumentMouseUp() {
    isManual = false;

    lastMouseX = 0;
    lastMouseY = 0;
    lastLon = 0;
    lastLat = 0;
}


function cleanup() {
    container.removeEventListener('mousedown', handleDocumentMouseDown, false);
    container.removeEventListener('mousemove', handleDocumentMouseMove, false);
    container.removeEventListener('mouseup', handleDocumentMouseUp, false);
    container.removeEventListener('touchstart', handleDocumentMouseDown, false);
    container.removeEventListener('touchmove', handleDocumentMouseMove, false);
    container.removeEventListener('touchend', handleDocumentMouseUp, false);

    window.removeEventListener('resize', resizeWindow);
}

window.onunload = cleanup;


