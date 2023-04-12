import { TextureLoader, Color, Mesh, BoxGeometry, MeshBasicMaterial, MeshToonMaterial, AmbientLight, HemisphereLight, DirectionalLight, Scene, PerspectiveCamera, WebGLRenderer, sRGBEncoding, LinearToneMapping } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader';

// three js boilerplate
const scene = new Scene();
const camera = new PerspectiveCamera(45, $(window).outerWidth() / $(window).height(), 0.1, 100);
camera.position.set(10, 20, 10);

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
// renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = LinearToneMapping;
renderer.setSize($(window).outerWidth(), $(window).height());

const controls = new OrbitControls(camera, renderer.domElement);

$(window).resize(() => {
    camera.aspect = $(window).outerWidth() / $(window).height();
    camera.updateProjectionMatrix();
    renderer.setSize($(window).outerWidth(), $(window).height());
});

$(window).ready(() => { $('.scrolling-kitchen.canvas-wrapper').append(renderer.domElement); });

scene.add(new AmbientLight(new Color('#ffffff'), 0.3));
scene.add(new HemisphereLight(new Color('#ffffff'), new Color('#ffffff'), 0.5));
const directionalLight = new DirectionalLight(new Color('#ffffff'), 1);
directionalLight.position.set(-3, 0, 10);
scene.add(directionalLight);

const loader = new GLTFLoader();
loader.load('../assets/kitchen.glb', (glb) => {
    scene.add(glb.scene);
});

const cameraPositions = [
    [[10, 20, 10], [10, 10, 10], 10],
    [[10, 10, 10], [10, 20, 10], 30],
];
let totalPositionWeight = 0;
for (let position of cameraPositions) { totalPositionWeight += position[2]; }

$(window).scroll((event) => {
    if ($(window).scrollTop() >= $(window).height() + $('.section').height() + 100) { $('.scrolling-kitchen.canvas-wrapper').css({ 'position': 'fixed' }); }
    else { $('.scrolling-kitchen.canvas-wrapper').css({ 'position': 'static' }); }
    let scrollArea = $('body').height() - $(window).height() - $('.section').height() - 100;
    let cameraIndex = $(window).scrollTop() - $(window).height() * 2 - $('.section').height() - 100;
    if (cameraIndex / scrollArea > 0.5) {
        alert(cameraIndex / scrollArea);
    }
});

renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
    // console.log(camera.position);
});