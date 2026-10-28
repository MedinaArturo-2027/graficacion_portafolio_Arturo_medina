import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const corazonGroup = new THREE.Group();
const cuboGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
const cuboMat = new THREE.MeshStandardMaterial({ 
  color: 0xff0055, 
  wireframe: true 
});

const posicionesCubos = [
  [0, -0.7, 0],
  [-0.7, 0, 0],
  [0.7, 0, 0],
  [-0.7, 0.7, 0],
  [0.7, 0.7, 0],
  [0, 0, 0]
];

posicionesCubos.forEach(([x, y, z]) => {
  const cubo = new THREE.Mesh(cuboGeo, cuboMat);
  cubo.position.set(x, y, z);
  corazonGroup.add(cubo);
});

scene.add(corazonGroup);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  corazonGroup.rotation.y += 0.015;

  let escala = 1 + Math.sin(Date.now() * 0.003) * 0.25;
  corazonGroup.scale.set(escala, escala, escala);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();