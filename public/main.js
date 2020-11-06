


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



// window.isdrawing.addEventListener('true', function () {

// })
//
// Initialization of global objects and set up callbacks for mouse and resize
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
	var setMouse = function () {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
	renderer.domElement.addEventListener('mousedown', function () {

		setMouse();
		mouseIsPressed = true;
		if (typeof mousePressed !== 'undefined') mousePressed();
	});
	renderer.domElement.addEventListener('mousemove', function () {
		pmouseX = mouseX;
		pmouseY = mouseY;
		setMouse();
		if (mouseIsPressed) {
			if (typeof mouseDragged !== 'undefined') mouseDragged();
		}
		if (typeof mouseMoved !== 'undefined') mouseMoved();
	});
	renderer.domElement.addEventListener('mouseup', function () {
		mouseIsPressed = false;
		if (typeof mouseReleased !== 'undefined') mouseReleased();
	});

	// If a setup function is defined, call it
	if (typeof setup !== 'undefined') setup();

	// First render
	render();
}

// 
// Reshape callback
//
function resize() {
	// var iFrame = document.getElementsByTagName('iframe')[0]
	// var elmnt = iFrame.contentWindow.document.getElementsByClassName('scene')[0].getBoundingClientRect()
	width = window.innerWidth;
	height = 0.64 * window.innerHeight;
	camera.right = width;
	camera.bottom = height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
	render();
}

//
// The render callback
//
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

//------------------------------------------------------------
//
// User code from here on 
//
//------------------------------------------------------------

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

var ifrm = document.getElementById('background');
var doc = ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document;
var draw = doc.getElementById('draw');

draw.addEventListener('click', onToggle);
function onToggle(event) {
	if (event.target.checked) {
		init();

	}
	else {
		console.log("hahhahha")
		renderer.domElement.removeEventListener('mousedown', function () {

			setMouse();
			mouseIsPressed = true;
			if (typeof mousePressed !== 'undefined') mousePressed();
		});
		renderer.domElement.removeEventListener('mousemove', function () {
			pmouseX = mouseX;
			pmouseY = mouseY;
			setMouse();
			if (mouseIsPressed) {
				if (typeof mouseDragged !== 'undefined') mouseDragged();
			}
			if (typeof mouseMoved !== 'undefined') mouseMoved();
		});
		renderer.domElement.removeEventListener('mouseup', function () {
			mouseIsPressed = false;
			if (typeof mouseReleased !== 'undefined') mouseReleased();
		});

	}
	dispose()
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
}

function dispose() {
	console.log("hahhahha")
	renderer.dispose()
	material.dispose()
	// camera.dispose()




	// scene.traverse(object => {
	// 	if (!object.isMesh) return

	// 	console.log('dispose geometry!')
	// 	object.geometry.dispose()

	// 	if (object.material.isMaterial) {
	// 		cleanMaterial(object.material)
	// 	} else {
	// 		// an array of materials
	// 		for (const material of object.material) cleanMaterial(material)
	// 	}
	// })

	// const cleanMaterial = material => {
	// 	console.log('dispose material!')
	// 	material.dispose()

	// 	// dispose textures
	// 	for (const key of Object.keys(material)) {
	// 		const value = material[key]
	// 		if (value && typeof value === 'object' && 'minFilter' in value) {
	// 			console.log('dispose texture!')
	// 			value.dispose()
	// 		}
	// 	}
	// }

}