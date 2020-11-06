var canvas,
	context,
	dragging = false,
	dragStartLocation,
	snapshot;


function getCanvasCoordinates(event) {
	var x = event.clientX - canvas.getBoundingClientRect().left,
		y = event.clientY - canvas.getBoundingClientRect().top;

	return { x: x, y: y };
}

function takeSnapshot() {
	snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
	context.putImageData(snapshot, 0, 0);
}


function drawLine(position) {
	context.beginPath();
	context.moveTo(dragStartLocation.x, dragStartLocation.y);
	context.lineTo(position.x, position.y);
	context.stroke();
}

function dragStart(event) {
	dragging = true;
	dragStartLocation = getCanvasCoordinates(event);
	takeSnapshot();
}

function drag(event) {
	var position;
	if (dragging === true) {
		restoreSnapshot();
		position = getCanvasCoordinates(event);
		drawLine(position);
	}
}

function dragStop(event) {
	dragging = false;
	restoreSnapshot();
	var position = getCanvasCoordinates(event);
	drawLine(position);
}

function init() {
	canvas = document.getElementById("sheet");
	canvas.style.height = 0.8 * window.innerHeight
	context = canvas.getContext('2d');
	context.strokeStyle = 'purple';
	context.lineWidth = 6;
	context.lineCap = 'round';

	canvas.addEventListener('mousedown', dragStart, false);
	canvas.addEventListener('mousemove', drag, false);
	canvas.addEventListener('mouseup', dragStop, false);
}
// canvas = document.getElementById("sheet")
// canvas.addEventListener('resize', resize())
window.addEventListener('load', init, false);
// window.addEventListener('resize', () => {
// 	canvas = document.getElementById("sheet");
// 	canvas.style.height = 0.8 * window.innerHeight
// 	canvas.style.width = 0.8 * window.window.innerWidth

// }
// {/* <iframe id="background" src="index2.html"></iframe> */ }