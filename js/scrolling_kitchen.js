import { TextureLoader, Color, Mesh, BoxGeometry, MeshBasicMaterial, MeshToonMaterial, AmbientLight, PointLight, Scene, PerspectiveCamera, WebGLRenderer, TorusGeometry, CubeTextureLoader } from 'https://cdn.skypack.dev/three@0.137';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

// three js boilerplate
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

$(window).ready(() => {
    $('.scrolling-kitchen.canvas-wrapper').append(renderer.domElement);
});