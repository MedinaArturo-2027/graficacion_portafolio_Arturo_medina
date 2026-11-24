import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('#canvass');

// Crear escena (Fondo azul muy oscuro en lugar de negro puro)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1021);

// Crear cámara
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 4, 8);

// Crear renderizador
const renderizador = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;

// Luces
const luzAmb = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(luzAmb);

const luzSol = new THREE.DirectionalLight(0xffffff, 1.0);
luzSol.position.set(5, 10, 7);
luzSol.castShadow = true;
luzSol.shadow.mapSize.width = 2048;
luzSol.shadow.mapSize.height = 2048;
luzSol.shadow.bias = -0.001;
scene.add(luzSol);

// NUEVO: Luz puntual de apoyo con tono cyan para dar reflejos
const luzPuntual = new THREE.PointLight(0x00ffff, 2, 10);
luzPuntual.position.set(-3, 3, 2);
scene.add(luzPuntual);

// Controles de cámara
const controls = new OrbitControls(camera, renderizador.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Cargar textura
const textureLoader = new THREE.TextureLoader();

// NUEVO: Piso para que se aprecien las sombras proyectadas
const geometriaPiso = new THREE.PlaneGeometry(15, 15);
const materialPiso = new THREE.MeshStandardMaterial({ 
    color: 0x1e2436, 
    roughness: 0.8 
});
const piso = new THREE.Mesh(geometriaPiso, materialPiso);
piso.rotation.x = -Math.PI / 2;
piso.position.y = -0.1; // Justo debajo del pedestal
piso.receiveShadow = true;
scene.add(piso);

// Crear cubo
const geometriaCubo = new THREE.BoxGeometry(1, 1, 1);
const materialCubo = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.0
});

materialCubo.map = textureLoader.load(
    'https://threejs.org/examples/textures/brick_diffuse.jpg'
);

const cubo = new THREE.Mesh(geometriaCubo, materialCubo);
cubo.castShadow = true;
cubo.receiveShadow = true;
scene.add(cubo);

// Crear pedestal
const pedestalArriba = 0.8;
const pedestalFondo = 1.0;
const pedestalAltura = 0.2;
const separacionPedestal = 0.8;
const pedestalSegmentos = 6;

const geometriaPedestal = new THREE.CylinderGeometry(
    pedestalArriba,
    pedestalFondo,
    pedestalAltura,
    pedestalSegmentos
);

const materialPedestal = new THREE.MeshStandardMaterial({
    color: 0x555b6e,
    metalness: 0.5,
    roughness: 0.3
});

const pedestal = new THREE.Mesh(geometriaPedestal, materialPedestal);
pedestal.position.y = 0;
pedestal.castShadow = true;
pedestal.receiveShadow = true;
scene.add(pedestal);

// Crear esfera (Ahora es metálica y dorada/naranja)
const esferaRadio = 0.3;
const esferaSegmentos = 32;

const geometriaEsfera = new THREE.SphereGeometry(
    esferaRadio,
    esferaSegmentos,
    esferaSegmentos
);

const materialEsfera = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    metalness: 0.8,
    roughness: 0.2
});

const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
esfera.position.y = 2.5;
esfera.castShadow = true;
esfera.receiveShadow = true;
scene.add(esfera);

// Posición base del cubo
const alturaBaseCubo = 0.2 + separacionPedestal;
cubo.position.y = alturaBaseCubo;

// Ajustar pantalla
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Reloj para animaciones fluidas basadas en el tiempo
const reloj = new THREE.Clock();

// Animación
function animar() {
    const tiempo = reloj.getElapsedTime();

    // Rotación y flotación suave del cubo
    cubo.rotation.x += 0.01;
    cubo.rotation.y += 0.015;
    cubo.position.y = alturaBaseCubo + Math.sin(tiempo * 2) * 0.2;

    // La esfera ahora orbita alrededor del cubo
    const radioOrbita = 1.6;
    esfera.position.x = Math.cos(tiempo * 1.5) * radioOrbita;
    esfera.position.z = Math.sin(tiempo * 1.5) * radioOrbita;
    esfera.position.y = 1.8 + Math.sin(tiempo * 3) * 0.2;

    controls.update();

    renderizador.render(scene, camera);
}

renderizador.setAnimationLoop(animar);