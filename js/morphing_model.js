import { Object3D, Color, sRGBEncoding, AmbientLight, Scene, PerspectiveCamera, WebGLRenderer } from 'https://cdn.skypack.dev/three@0.137';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader';

const scene = new Scene();
const root = new Object3D();
root.rotateX(0.5);
scene.add(root);

const camera = new PerspectiveCamera(45, $(window).outerWidth() / $(window).height(), 0.1, 100);
camera.position.set($(window).outerWidth() / $(window).height() * -2, 0, 10);

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize($(window).outerWidth(), $(window).height());

$(window).resize(() => {
    camera.aspect = $(window).outerWidth() / $(window).height();
    camera.position.set(window.innerWidth / window.innerHeight * -2, 0, 10);

    camera.updateProjectionMatrix();
    renderer.setSize($(window).outerWidth(), $(window).height());
});

renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
$(window).ready(() => {$('.canvas-wrapper').append(renderer.domElement);});

scene.add(new AmbientLight(new Color('#FFFFFF'), 2));

// path, scale, y offset
const toLoad = [
    ['../assets/models/pan.glb', 0.15, 0],
    ['../assets/models/hot_dog.glb', 0.3, 0],
    ['../assets/models/mortar_pestle.glb', 0.07, -1],
    ['../assets/models/salt_pepper_condiments.glb', 0.01, -1],
];
const loaded = [];
let amtLoaded = 0;
let currObj = -1;

const zoomIn = () => {
    let currScale = toLoad[currObj][1];
    new TWEEN.Tween(loaded[currObj].scale)
        .to({ x: currScale * 1.2, y: currScale * 1.2, z: currScale * 1.2 }, 200)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
            new TWEEN.Tween(loaded[currObj].scale)
                .to({ x: currScale, y: currScale , z: currScale }, 50)
                .easing(TWEEN.Easing.Linear.None)
                .start();
        })
        .start();
};

const zoomOut = () => {
    let currScale = toLoad[currObj][1];
    new TWEEN.Tween(loaded[currObj].scale)
        .to({ x: currScale * 1.2, y: currScale * 1.2, z: currScale * 1.2 }, 50)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
            new TWEEN.Tween(loaded[currObj].scale)
                .to({ x: currScale * 0.05, y: currScale * 0.05, z: currScale * 0.05 }, 200)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
        })
        .start();
};

const switchObject = () => {
    if (currObj >= 0) {root.remove(loaded[currObj]);}
    currObj++;
    if (currObj >= loaded.length) {currObj = 0;}
    root.add(loaded[currObj]);
    zoomIn();
    setTimeout(() => {
        zoomOut();
        setTimeout(switchObject, 250);
    }, 4750);
};

const loader = new GLTFLoader();
for (let data of toLoad) {
    loader.load(data[0], (glb) => {
        glb.scene.scale.set(data[1], data[1], data[1]);
        glb.scene.position.setY(data[2]);
        loaded.push(glb.scene);
        amtLoaded += 1;
        if (amtLoaded == toLoad.length) {switchObject();}
    });
}

const rotateRoot = () => {
    root.rotateY(0.02);
    setTimeout(rotateRoot, 10);
};
rotateRoot();

renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    TWEEN.update();
});