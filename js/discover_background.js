import { Object3D, Color, Mesh, SphereGeometry, BoxGeometry, MeshPhysicalMaterial, MeshBasicMaterial, MeshToonMaterial, sRGBEncoding, AmbientLight, PointLight, Scene, PerspectiveCamera, WebGLRenderer, TorusGeometry, CubeTextureLoader } from 'https://cdn.skypack.dev/three@0.137';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { targetBackgroundColor, imagePath } from './discover.js';
// must import mouse because events cannot affect two overlapping canvases
import { lerpMouse } from './earth.js';

const scene = new Scene();
const camera = new PerspectiveCamera(45, $(window).outerWidth() / $(window).height(), 0.1, 100);
camera.position.set(0, 0, 20);

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize($(window).outerWidth(), $(window).height());

$(window).resize(() => {
    camera.aspect = $(window).outerWidth() / $(window).height();

    camera.updateProjectionMatrix();
    renderer.setSize($(window).outerWidth(), $(window).height());
});

$(window).ready(() => {$('.background.canvas-wrapper').append(renderer.domElement);});

scene.add(new AmbientLight(new Color('#ffffff'), 0.3));
scene.add(new PointLight(new Color('#ffffff'), 0.1));

const objects = new Set();

const Object = class {
    constructor(mesh) {
        this.mesh = mesh;
        this.toDestroy = false;
        scene.add(this.mesh);
    }
    remove() {
        scene.remove(this.mesh);
    }
    moveLeft(time) {
        new TWEEN.Tween(this.mesh.position)
            .to({ x: -20 * ($(window).width() / $(window).height()) }, time)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {this.toDestroy = true;})
            .start();
    }
    spin(direction, time) {
        new TWEEN.Tween(this.mesh.rotation)
            .to({ x: 2 * Math.PI * direction[0], y: 2 * Math.PI * direction[1], z: 2 * Math.PI * direction[2] }, time)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Linear.None)
            .start();
    }
};

const createObject = () => {
    let objType = Math.random();
    let geometry = new BoxGeometry(1, 1, 1);
    let material = new MeshToonMaterial({ color: new Color(0.9, 0.9, 0.9) });
    if (objType < 0.4) {
        geometry = new TorusGeometry(0.5, 0.2, 20, 20, 2 * Math.PI);
    }
    if (objType < 0.8) {
        let color = targetBackgroundColor[Math.floor(Math.random() * targetBackgroundColor.length)];
        material = new MeshToonMaterial({ color: new Color(color[0] / 255, color[1] / 255, color[2] / 255) });
    } else {
        // console.log(imagePath);
    }
    let mesh = new Mesh(
        geometry,
        material,
    );
    mesh.position.set(20 * ($(window).width() / $(window).height()) * (100 - 50) / 50, 12 * (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 16);
    let obj = new Object(mesh);
    objects.add(obj);
    obj.moveLeft(10000 + (Math.random() - 0.5) * 2000);
    obj.spin([Math.round((Math.random() - 0.5) * 2), Math.round((Math.random() - 0.5) * 2), Math.round((Math.random() - 0.5) * 2)], 10000);
    setTimeout(createObject, 80);
};
createObject();

const checkDestroyObject = () => {
    for (let obj of new Set(objects)) {
        if (obj.toDestroy) {
            obj.remove();
            objects.delete(obj);
        }
    }
    setTimeout(checkDestroyObject, 100);
};
checkDestroyObject();

renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    // must directly state look at 0, 0 here because there are no orbit controls that normally automatically do it
    camera.lookAt(0, 0);
    // multiply by greater constant than that in earth.js to create parallax effect
    camera.rotateX(Math.sign(lerpMouse.y) * lerpMouse.y ** 2 * 0.2);
    camera.rotateY(Math.sign(lerpMouse.x) * lerpMouse.x ** 2 * -0.2);
    TWEEN.update();
});