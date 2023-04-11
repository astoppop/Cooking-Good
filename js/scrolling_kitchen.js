import { TextureLoader, Color, Mesh, BoxGeometry, MeshBasicMaterial, MeshToonMaterial, AmbientLight, PointLight, Scene, PerspectiveCamera, WebGLRenderer, TorusGeometry, CubeTextureLoader } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader';

// three js boilerplate
const scene = new Scene();
const camera = new PerspectiveCamera(45, $(window).outerWidth() / $(window).height(), 0.1, 100);
camera.position.set(0, 0, 20);
camera.lookAt(0, 0);

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.physicallyCorrectLights = true;
renderer.setSize($(window).outerWidth(), $(window).height());

const controls = new OrbitControls(camera, renderer.domElement);

$(window).resize(() => {
    camera.aspect = $(window).outerWidth() / $(window).height();
    camera.updateProjectionMatrix();
    renderer.setSize($(window).outerWidth(), $(window).height());
});

$(window).ready(() => { $('.scrolling-kitchen.canvas-wrapper').append(renderer.domElement); });

scene.add(new AmbientLight(new Color('#ffffff'), 2));

const loader = new GLTFLoader();
loader.load('../assets/kitchen.glb', (glb) => {
    scene.add(glb.scene);
});


renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
});