
import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';







const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("Black");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);



// var geometry = new THREE.SphereGeometry(1, 4, 4)

// var material = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });

// var mesh = new THREE.Mesh(geometry, material);

// scene.add(mesh)

// var light = new THREE.PointLight(0xFFFFFF, 1, 500)
// light.position.set(10, 0, 25)
// scene.add(light)


// var render = function () {
//     requestAnimationFrame(render);
//     mesh.rotation.x += 0.01;

//     renderer.render(scene, camera);

// }

// render();

const stats = Stats();
document.body.appendChild(stats.dom);

var animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
    render();
    stats.update();
};

function render() {
    renderer.render(scene, camera);
}

animate();