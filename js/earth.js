const planetRadius = 1;

import { TextureLoader, Color, Mesh, SphereGeometry, MeshPhysicalMaterial, MeshBasicMaterial, sRGBEncoding, AmbientLight, Scene, PerspectiveCamera, WebGLRenderer, RingGeometry, CircleGeometry, Vector3, Vector2, Raycaster } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { onMarkerClick } from './discover.js';

const scene = new Scene();

const camera = new PerspectiveCamera(45, $(window).innerWidth() / $(window).innerHeight(), 0.1, 1000);
camera.position.set(0, 0, planetRadius * 5 / Math.min(1.5, camera.aspect));
const cameraDist = camera.position.distanceTo(new Vector3(0, 0, 0));

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize($(window).innerWidth(), $(window).innerHeight());

$(window).resize(() => {
    camera.aspect = $(window).innerWidth() / $(window).innerHeight();
    camera.position.set(0, planetRadius * 1.5, planetRadius * 5 / Math.min(1.5, camera.aspect));

    camera.updateProjectionMatrix();
    renderer.setSize($(window).innerWidth(), $(window).innerHeight());
});

renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
$(window).ready(() => {$('.earth.canvas-wrapper').append(renderer.domElement);});

const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.1;
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

scene.add(new AmbientLight(new Color('#FFFFFF'), 2));

let sphere = new Mesh(
    new SphereGeometry(planetRadius, 100, 100),
    new MeshPhysicalMaterial({map: await new TextureLoader().loadAsync('../assets/img/earth_map.jpg')}),
);
scene.add(sphere);

let markers = [];
let markersAndHitboxes = [];

const createMarker = (lat, lon) => {
    let latRad = lat * (Math.PI / 180);
    let lonRad = -lon * (Math.PI / 180);
    let pos = new Vector3(Math.cos(latRad) * Math.cos(lonRad) * planetRadius, Math.sin(latRad) * planetRadius, Math.cos(latRad) * Math.sin(lonRad) * planetRadius);
    
    let marker = new Mesh(
        new RingGeometry(planetRadius / 60, planetRadius / 30, 20),
        new MeshBasicMaterial({
            color: '#000000',
            opacity: 0.3,
            transparent: true,
        }),
    );
    let markerHitbox = new Mesh(
        new CircleGeometry(planetRadius / 30, 20),
        new MeshBasicMaterial({
            opacity: 0,
            transparent: true,
        }),
    );

    marker.position.copy(pos);
    markerHitbox.position.copy(pos);

    marker.name = `${markers.length}m`;
    markerHitbox.name = `${markers.length}h`;

    scene.add(marker);
    scene.add(markerHitbox);

    marker.lookAt(marker.position.clone().multiply(new Vector3(2, 2, 2)));
    markerHitbox.lookAt(marker.position.clone().multiply(new Vector3(2, 2, 2)));

    markers.push(marker);
    markersAndHitboxes.push(marker);
    markersAndHitboxes.push(markerHitbox);
};

fetch('../assets/discover.json')
    .then(response => {return response.json();})
    .then(json => {
        $(window).ready(() => {
            json.forEach(element => {
                createMarker(element.coords[0], element.coords[1]);
            });
        });
    });

const raycaster = new Raycaster();
const mouse = new Vector2();
export const lerpMouse = new Vector2();

const updateLerpMouse = () => {
    lerpMouse.lerp(mouse, 0.05);
    setTimeout(updateLerpMouse, 10);
};
updateLerpMouse();

let hovered = null;
let clicked = null;

$('.earth.canvas-wrapper canvas').mousemove((event) => {
    mouse.x = (event.clientX / $(window).innerWidth()) * 2 - 1;
    mouse.y = -(event.clientY / $(window).innerHeight()) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(markersAndHitboxes);

    if (intersects.length > 0) {
        let name = intersects[0].object.name;
        let marker = scene.getObjectByName(`${intersects[0].object.name.slice(0, name.length - 1)}m`);
        hovered = marker;
    } else {hovered = null;}
});

$('.earth.canvas-wrapper canvas').click((event) => {
    mouse.x = (event.clientX / $(window).innerWidth()) * 2 - 1;
    mouse.y = -(event.clientY / $(window).innerHeight()) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(markersAndHitboxes);

    if (intersects.length > 0) {
        let name = intersects[0].object.name;
        let marker = scene.getObjectByName(`${intersects[0].object.name.slice(0, name.length - 1)}m`);
        clicked = marker;

        controls.enabled = false;
        let markerDist = marker.position.distanceTo(new Vector3(0, 0, 0));
        let positionRatio = cameraDist / markerDist;
        new TWEEN.Tween(camera.position)
            .to({ x: marker.position.x * positionRatio, y: marker.position.y * positionRatio, z: marker.position.z * positionRatio }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                controls.enabled = true;
            })
            .start();

        onMarkerClick(clicked.name.slice(0, name.length - 1));
    }
});

renderer.setAnimationLoop(() => {
    markers.forEach(marker => {
        let markerHitbox = scene.getObjectByName(`${marker.name.slice(0, name.length - 1)}h`);
        let innerRadius = marker.geometry.parameters.innerRadius;
        let outerRadius = marker.geometry.parameters.outerRadius;

        if (marker === hovered || marker === clicked) {
            if (innerRadius > 0) {
                marker.geometry = new RingGeometry(innerRadius - (planetRadius / 600), outerRadius + (planetRadius / 1920), 20);
                markerHitbox.geometry = new CircleGeometry(outerRadius + (planetRadius / 1920), 20);

                marker.material.opacity += 0.03;
            }
        } else {
            if (innerRadius < planetRadius / 60) {
                marker.geometry = new RingGeometry(innerRadius + (planetRadius / 600), outerRadius - (planetRadius / 1920), 20);
                markerHitbox.geometry = new CircleGeometry(outerRadius - (planetRadius / 1920), 20);

                marker.material.opacity -= 0.03;
            }
        }
    });

    controls.update();
    camera.rotateX(Math.sign(lerpMouse.y) * lerpMouse.y ** 2 * 0.1);
    camera.rotateY(Math.sign(lerpMouse.x) * lerpMouse.x ** 2 * -0.1);
    renderer.render(scene, camera);
    TWEEN.update();
});