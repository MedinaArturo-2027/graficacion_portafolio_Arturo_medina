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

const semaforoGroup = new THREE.Group();

const cajaGeo = new THREE.BoxGeometry(1.2, 4, 1.2);
const cajaMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const caja = new THREE.Mesh(cajaGeo, cajaMat);
semaforoGroup.add(caja);

const esferaGeo = new THREE.SphereGeometry(0.4, 32, 32);

const esferaRoja = new THREE.Mesh(esferaGeo, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
esferaRoja.position.set(0, 1.2, 0.6);

const esferaAmarilla = new THREE.Mesh(esferaGeo, new THREE.MeshStandardMaterial({ color: 0xffff00 }));
esferaAmarilla.position.set(0, 0, 0.6);

const esferaVerde = new THREE.Mesh(esferaGeo, new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
esferaVerde.position.set(0, -1.2, 0.6);

semaforoGroup.add(esferaRoja, esferaAmarilla, esferaVerde);
scene.add(semaforoGroup);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  semaforoGroup.rotation.y += 0.01;
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();