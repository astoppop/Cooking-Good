import { Vector2, Color, Mesh, BoxGeometry, MeshBasicMaterial, MeshToonMaterial, AmbientLight, HemisphereLight, DirectionalLight, Scene, PerspectiveCamera, WebGLRenderer, sRGBEncoding, LinearToneMapping } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader';

// three js boilerplate
const scene = new Scene();
const camera = new PerspectiveCamera(45, $(window).outerWidth() / $(window).height(), 0.1, 100);
camera.rotation.order = 'YXZ';

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = LinearToneMapping;
renderer.setSize($(window).outerWidth(), $(window).height());

// const controls = new OrbitControls(camera, renderer.domElement);

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

// convert from
// weight, from, to
// to
// index, from, to
const convertWeights = (data) => {
    let currWeight = 0;
    for (let i = 0; i < data.length; i++) {
        currWeight += data[i][0];
        data[i][0] = currWeight;
    }
    return data;
};

const lerp = (start, end, t) => { return start * (1 - t)  + end * t; };
const getInfo = (data, index) => {
    if (index < 0) { index = 0; }
    let prev = 0;
    for (let line of data) {
        if (index <= line[0]) {
            let lerpData = [];
            for (let i = 0; i < line[1].length; i++) { lerpData.push(lerp(line[1][i], line[2][i], (index - prev) / (line[0] - prev))); }
            return lerpData;
        }
        prev = line[0];
    }
};

// weight, from, to
const cameraPositions = convertWeights([
    [10, [10, 10, 10], [10, 5, 10]],
    [10, [10, 5, 10], [3, 5, 10]],
    [10, [3, 5, 10], [2.5, 2.5, 5]],
    [40, [2.5, 2.5, 5], [2.5, 2.5, -2]],
    [40, [2.5, 2.5, -2], [2, 3.5, -2.25]],
    [100, [2, 3.5, -2.25], [1, 4.5, -2]],
    [100, [1, 4.5, -2], [1, 4.5, 0]],
]);

const cameraRotations = convertWeights([
    [20, [-30, 45, 0], [0, 0, 0]],
    [30, [0, 0, 0], [0, 0, 0]],
    [20, [0, 0, 0], [0, 80, 0]],
    [70, [0, 80, 0], [0, 90, 0]],
    [170, [0, 90, 0], [0, 90, 0]],
]);

const updateCamera = () => {
    let scrollArea = $('body').height() - $(window).height() * 2 - $('.section').height() - 100;
    let decimalScroll = $(window).scrollTop() - $(window).height() - $('.section').height() - 100;
    
    let positionInfo = getInfo(cameraPositions, (decimalScroll / scrollArea) * cameraPositions[cameraPositions.length - 1][0]);
    camera.position.set(positionInfo[0], positionInfo[1], positionInfo[2]);
    let rotationInfo = getInfo(cameraRotations, (decimalScroll / scrollArea) * cameraRotations[cameraRotations.length - 1][0]);
    camera.rotation.set(rotationInfo[0] * Math.PI / 180, rotationInfo[1] * Math.PI / 180, rotationInfo[2] * Math.PI / 180);
};

$(window).scroll((event) => {
    if ($(window).scrollTop() >= $(window).height() + $('.section').height() + 100) { $('.scrolling-kitchen.canvas-wrapper').css({ 'position': 'fixed' }); }
    else { $('.scrolling-kitchen.canvas-wrapper').css({ 'position': 'static' }); }
});

const mouse = new Vector2();
const lerpMouse = new Vector2();

// update lerp mouse
const updateLerpMouse = () => {
    lerpMouse.lerp(mouse, 0.05);
    requestAnimationFrame(updateLerpMouse);
};
requestAnimationFrame(updateLerpMouse);

$('.scrolling-kitchen.canvas-wrapper').mousemove((event) => {
    mouse.x = (event.clientX / $(window).innerWidth()) * 2 - 1;
    mouse.y = -(event.clientY / $(window).innerHeight()) * 2 + 1;
});

$(window).ready(() => {
    renderer.setAnimationLoop(() => {
        updateCamera();
        camera.rotateX(lerpMouse.y * 0.1);
        camera.rotateY(lerpMouse.x * -0.1);
        renderer.render(scene, camera);
        TWEEN.update();
        // console.log(camera.rotation);
    });
});