
import {
    Vector3,
    Color,
    Mesh,
    MeshBasicMaterial,
    SphereGeometry,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    DirectionalLight,
    BackSide,
    Matrix4,
    LineBasicMaterial,
    TextureLoader,
    Texture,
    Line,
    Geometry,
    OrthographicCamera
} from '/build/three.module.js';
// import { drawing } from './main.js'

const container = document.querySelector('#scene-container');
const pause = document.getElementById('pause');
const draw = document.getElementById('draw');

// Draw vars
// var material2; // A line material
// var selected2; // Object that was picked
window.isDrawing = false;
// var scene2, width2, height2, camera2, renderer2;
// var mouseIsPressed2, mouseX2, mouseY2, pmouseX2, pmouseY2;

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
// var material; // A line material
// var selected; // Object that was picked
// var mouseIsPressed, mouseX, mouseY, pmouseX, pmouseY;

function init() {
    renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize(windowWidth, 0.8 * windowHeight);
    renderer.setPixelRatio(dpr);
    renderer.domElement.className = 'panView'
    // app.appendChild(renderer.domElement);
    container.appendChild(renderer.domElement);
    scene = new Scene();
    camera = new PerspectiveCamera(75, aspect, nearPlane, farPlane);
    camera.target = new Vector3(0, 0, 0);
    // camera.layers.enable(0);
    // camera.layers.enable(1);
    createSphere();
    initEventListeners();
    animate();
}
window.onload = init;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 0.8 * window.innerHeight);
    // finally, set the 

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
        window.isDrawing = true;
        // drawing()
        console.log(window.isDrawing)
        // drawSetup()

    }
    else {
        container.addEventListener('mousedown', handleDocumentMouseDown, false);
        container.addEventListener('mousemove', handleDocumentMouseMove, false);
        container.addEventListener('mouseup', handleDocumentMouseUp, false);
        container.addEventListener('touchstart', handleDocumentMouseDown, false);
        container.addEventListener('touchmove', handleDocumentMouseMove, false);
        container.addEventListener('touchend', handleDocumentMouseUp, false);
        window.isDrawing = false;
        console.log(window.isDrawing)
    }
}
// window.addEventListener('resize', resizeWindow);

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
    // console.log('hellllo')

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


function drawSetup() {
    init();

    function init() {

        // Scene object
        scene2 = new Scene();

        // Will use the whole window for the webgl canvas
        width2 = window.innerWidth;
        height2 = window.innerHeight;

        // Orthogonal camera for 2D drawing
        camera2 = new OrthographicCamera(0, width2, 0, height2, -height2, height2);
        camera2.lookAt(new Vector3(0, 0, 0));

        // Renderer will use a canvas taking the whole window
        renderer2 = new WebGLRenderer({ alpha: true });
        renderer2.setClearColor(0x000000, 0); // the default
        renderer2.sortObjects = false;
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(width2, height2);

        // Append camera to the page
        document.body.appendChild(renderer2.domElement);

        // Set resize (reshape) callback
        window.addEventListener('resize', resize);

        // Set up mouse callbacks. 
        // Call mousePressed, mouseDragged and mouseReleased functions if defined.
        // Arrange for global mouse variables to be set before calling user callbacks.
        mouseIsPressed2 = false;
        mouseX2 = 0;
        mouseY2 = 0;
        pmouseX2 = 0;
        pmouseY2 = 0;
        var setMouse = function () {
            mouseX2 = event.clientX;
            mouseY2 = event.clientY;
        }
        renderer.domElement.addEventListener('mousedown', function () {
            setMouse();
            mouseIsPressed2 = true;
            if (typeof mousePressed !== 'undefined') mousePressed();
        });
        renderer.domElement.addEventListener('mousemove', function () {
            pmouseX2 = mouseX2;
            pmouseY2 = mouseY2;
            setMouse();
            if (mouseIsPressed2) {
                if (typeof mouseDragged !== 'undefined') mouseDragged();
            }
            if (typeof mouseMoved !== 'undefined') mouseMoved();
        });
        renderer.domElement.addEventListener('mouseup', function () {
            mouseIsPressed2 = false;
            if (typeof mouseReleased !== 'undefined') mouseReleased();
        });

        // If a setup function is defined, call it
        if (typeof setup !== 'undefined') setup();

        // First render
        render2();
    }

    // 
    // Reshape callback
    //
    function resize() {
        width2 = window.innerWidth;
        height2 = window.innerHeight;
        camera2.right = width2;
        camera2.bottom = height2;
        camera2.updateProjectionMatrix();
        renderer2.setSize(width2, height2);
        render2();
    }

    //
    // The render callback
    //
    function render2() {
        requestAnimationFrame(render);
        renderer2.render(scene2, camera2);
    };

    //------------------------------------------------------------
    //
    // User code from here on 
    //
    //------------------------------------------------------------

    // var material; // A line material
    // var selected; // Object that was picked

    function setup() {
        material2 = new LineBasicMaterial({ color: 0xffffff, depthWrite: false, linewidth: 4 });
    }

    function mousePressed() {
        var point = new Vector3(mouseX2, mouseY2, 0);
        var geometry = new Geometry();
        geometry.vertices.push(point);
        var line = new Line(geometry, material2);
        scene.add(line);
        selected2 = line;
    }

    function mouseDragged() {
        var line = selected2;
        var point = new Vector3(mouseX2, mouseY2, 0);
        var oldgeometry = line.geometry;
        var newgeometry = new Geometry();
        newgeometry.vertices = oldgeometry.vertices;
        newgeometry.vertices.push(point);
        line.geometry2 = newgeometry;
    }


}