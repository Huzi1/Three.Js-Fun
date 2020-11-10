


import {
	Vector3,
	Scene,
	WebGLRenderer,
	LineBasicMaterial,
	Line,
	Geometry,
	OrthographicCamera,


} from '/build/three.module.js';





//
// Global variables
//
var scene, width, height, camera, renderer;
var mouseIsPressed, mouseX, mouseY, pmouseX, pmouseY;




//
function init() {

	// Scene object
	scene = new Scene();

	// Will use the whole window for the webgl canvas

	width = window.innerWidth;
	height = 0.64 * window.innerHeight;

	// Orthogonal camera for 2D drawing
	camera = new OrthographicCamera(0, width, 0, height, -height, height);
	camera.lookAt(new Vector3(0, 0, 0));

	// Renderer will use a canvas taking the whole window
	renderer = new WebGLRenderer({ alpha: true });
	renderer.setClearColor(0x000000, 0); // the default
	renderer.sortObjects = false;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);

	// Append camera to the page
	document.body.appendChild(renderer.domElement);

	// Set resize (reshape) callback
	window.addEventListener('resize', resize);

	// Set up mouse callbacks. 
	// Call mousePressed, mouseDragged and mouseReleased functions if defined.
	// Arrange for global mouse variables to be set before calling user callbacks.
	mouseIsPressed = false;
	mouseX = 0;
	mouseY = 0;
	pmouseX = 0;
	pmouseY = 0;

	renderer.domElement.addEventListener('mousedown', mousedown);
	renderer.domElement.addEventListener('mousemove', mousemove);
	renderer.domElement.addEventListener('mouseup', mouseup);

	// If a setup function is defined, call it
	if (typeof setup !== 'undefined') setup();

	// First render
	render();
	function resize() {

		width = window.innerWidth;
		height = 0.64 * window.innerHeight;
		camera.right = width;
		camera.bottom = height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
		render();
	}

}

// 
// Reshape callback
//
var setMouse = function () {
	mouseX = event.clientX;
	mouseY = event.clientY;
}
const mousedown = () => {
	setMouse();
	mouseIsPressed = true;
	if (typeof mousePressed !== 'undefined') mousePressed();
}

const mousemove = () => {
	pmouseX = mouseX;
	pmouseY = mouseY;
	setMouse();
	if (mouseIsPressed) {
		if (typeof mouseDragged !== 'undefined') mouseDragged();
	}
	if (typeof mouseMoved !== 'undefined') mouseMoved();
}

const mouseup = () => {
	mouseIsPressed = false;
	if (typeof mouseReleased !== 'undefined') mouseReleased();
}
//
// The render callback
//
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

var material; // A line material
var selected; // Object that was picked

function setup() {
	material = new LineBasicMaterial({ color: 0xFF0000, depthWrite: false, linewidth: 4 });
}

function mousePressed() {
	var point = new Vector3(mouseX, mouseY, 0);
	var geometry = new Geometry();
	geometry.vertices.push(point);
	var line = new Line(geometry, material);
	scene.add(line);
	selected = line;
}

function mouseDragged() {
	var line = selected;
	var point = new Vector3(mouseX, mouseY, 0);
	var oldgeometry = line.geometry;
	var newgeometry = new Geometry();
	newgeometry.vertices = oldgeometry.vertices;
	newgeometry.vertices.push(point);
	line.geometry = newgeometry;
}

function mouseReleased() {
}
// export default init;


function cleanup() {
	renderer.domElement.removeEventListener('mousedown', mousedown);
	renderer.domElement.removeEventListener('mousemove', mousemove);
	renderer.domElement.removeEventListener('mouseup', mouseup);
}

var ifrm = document.getElementById('background');
var doc = ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document;
var draw = doc.getElementById('draw');
var undo = doc.getElementById('undo');

undo.addEventListener('click', function () {
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);

	}
})

draw.addEventListener('click', onToggle);
function onToggle(event) {

	if (event.target.checked) {
		init();

	}
	else {
		cleanup()
		// dispose()
		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);

		}
		renderer.domElement.remove()
	}
}