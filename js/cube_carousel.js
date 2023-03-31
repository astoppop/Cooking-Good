const cubesInfo = [
    [["six images"], "h1", "p"],
    [["six images"], "h1", "p"],
    [["six images"], "h1", "p"],
    [["six images"], "h1", "p"],
    [["six images"], "h1", "p"],
    [["six images"], "h1", "p"],
    [["six images"], "h1", "p"],
];
const cubeSize = 1;
const cubeDist = 3.5;

import { TextureLoader, Color, Mesh, BoxGeometry, MeshPhysicalMaterial, MeshBasicMaterial, sRGBEncoding, AmbientLight, Scene, PerspectiveCamera, WebGLRenderer, Vector3, Fog } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

const scene = new Scene();
scene.fog = new Fog('#000000', 0, cubeDist * 1.5);

const camera = new PerspectiveCamera(45, $(window).innerWidth() / $(window).innerHeight(), 0.1, 1000);
camera.position.set(cubeDist * 1.8, 0, 0);
camera.lookAt(new Vector3(0, 0, 0));
const cameraDist = camera.position.distanceTo(new Vector3(0, 0, 0));

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize($(window).innerWidth(), $(window).innerHeight());

$(window).resize(() => {
    camera.aspect = $(window).innerWidth() / $(window).innerHeight();
    camera.position.set(cubeDist * 1.5, 0, 0);

    camera.updateProjectionMatrix();
    renderer.setSize($(window).innerWidth(), $(window).innerHeight());
});

renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
$(window).ready(() => {$('.canvas-wrapper').append(renderer.domElement);});


scene.add(new AmbientLight(new Color('#FFFFFF'), 2));

// Convert to degrees then convert to radians
let angleDiff = 360 / cubesInfo.length * Math.PI / 180;
let currAngle = 0;
// Cannot use forEach because await is used
for (let info of cubesInfo) {
    let cube = new Mesh(
        new BoxGeometry(cubeSize, cubeSize, cubeSize, cubeSize),
        new MeshPhysicalMaterial({map: await new TextureLoader().loadAsync('../assets/img/earth.jpg')}),
    );
    cube.position.set(cubeDist * Math.cos(currAngle), 0, cubeDist * Math.sin(currAngle));
    cube.lookAt(cube.position.clone().multiply(new Vector3(2, 2, 2)));
    scene.add(cube);
    currAngle += angleDiff;
}

let scrollTimer = 0;
const updateCameraPosition = () => {
    scrollTimer = 40;
    
    // Body set to 10x window height but only 9x here because you must subtract 1 as 0 scroll still allows you to see 1 full window height
    let maxScroll = $(window).height() * (10 - 1);

    // Set negative because it scrolls counter-clockwise otherwise
    let scrollPercent = -$(window).scrollTop() / maxScroll;
    let cameraAngle = 360 * scrollPercent * Math.PI / 180;
    camera.position.set(cameraDist * Math.cos(cameraAngle), 0, cameraDist * Math.sin(cameraAngle));
    camera.lookAt(new Vector3(0, 0, 0));
};

const timer = () => {
    if (scrollTimer > 0) {scrollTimer -= 1;}
    else {
        // Scroll snap
        let maxScroll = $(window).height() * (10 - 1);
        let currCube = $(window).scrollTop() / maxScroll * cubesInfo.length;
        if (scrollTimer == 0 && Math.abs(Math.round(currCube) - currCube) < 0.1) {
            $('html, body').animate({ scrollTop:  Math.round(currCube) * maxScroll / cubesInfo.length }, 150);
        }
        updateCameraPosition();
    }
    setTimeout(timer, 5);
}
timer();



$(window).scroll(updateCameraPosition);

renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
});