// const coverH1Text = 'Cooking Good';
// const coverPText = 'Experience the power of cooking - where every dish has the potential to inspire change';

// let vmin = Math.min($(window).width(), $(window).height()) / 100;

// const cubicBezier = (t, p0, p1, p2, p3) => {
//     return (Math.pow(1 - t, 3) * p0) + (3 * Math.pow(1 - t, 2) * p1) + (3 * Math.pow(1 - t, 2) * p2) + (Math.pow(t, 3) * p3);
// };

// $(window).ready(() => {
//     const imgWrapper = $('.img-wrapper');
//     const line = $('.img-wrapper .line');
//     const globe = $('.globe');
//     const plate = $('.plate');

//     let lineTime = 0;
//     let lineDir = 1;
//     let lineStep = 0.3;
//     const lineMove = () => {
//         let changeDir = false;
//         lineTime += lineDir * lineStep;
//         if (lineTime < 0) {
//             lineTime = 0;
//             lineDir *= -1;
//             changeDir = true;
//         } else if (lineTime > 100) {
//             lineTime = 100;
//             lineDir *= -1;
//             changeDir = true;
//         }
        
//         // easeInOutQuad: 0.5, 0, 0.5, 1
//         let lineX = cubicBezier(lineTime / 100, 0.45, 0, 0.55, 1) * 100;
//         line.css({left: imgWrapper.width() * lineX / 100});
//         plate.css({'clip-path': `polygon(0 0, ${lineX}% 0, ${lineX}% 100%, 0 100%)`});
        
//         if (changeDir) {
//             setTimeout(lineMove, 100);
//         } else {
//             setTimeout(lineMove, 10);
//         }
//     };
//     lineMove();
// });