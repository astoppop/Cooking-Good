let coords = [0, 0];
let lerpCoords = [0, 0];

const lerp = (start, end, t) => { return start * (1 - t)  + end * t; };

setInterval(() => {
    lerpCoords = [lerp(lerpCoords[0], coords[0], 0.05), lerp(lerpCoords[1], coords[1], 0.05)]
}, 10);

$(window).ready(() => {
    let cover = $('.cover');
    let coverH = $('.cover h1');
    $(cover).mousemove((event) => {
        coords = [-(event.clientX / cover.width()) * 2 + 1, -(event.clientY / cover.height()) * 2 + 1]
    });
    setInterval(() => {
        coverH.css('background-position', `${lerpCoords[0] * 5}px ${lerpCoords[1] * 5}px`);
    });
});