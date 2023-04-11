const imageFiles = [
    'crock_pot.png',
    'knife_set.png',
    'knife.png',
    'pan.png',
    'pot.png',
    'stove.png',
];

$(window).ready(() => {
    let images = [];

    let counter = 200;
    const createImages = () => {
        if (counter == 200) {
            for (let i = 0; i < $('.cover .images').children().length; i++) {
                setTimeout(() => {
                    // create image and randomly choose source from imageFiles
                    let image = $('<img>');
                    images.push(image);
                    image.attr('src', `../assets/img/index/${imageFiles[Math.floor(Math.random() * imageFiles.length)]}`);
                    $($('.cover .images').children().get(i)).append(image);
                    // animate going up
                    image.animate({ top: 0 }, {
                        duration: 8000,
                        easing: 'linear',
                    });
                    $({ x: 0 }).animate({ x: -100 }, {
                        duration: 8000,
                        easing: 'linear',
                        step: (val) => { image.css({ 'transform': `translate(-50%, ${val}%)` }); },
                        complete: () => { image.remove() },
                    });
                }, i * 1000);
            }
            counter = 0;
        }
        counter++;
        requestAnimationFrame(createImages);
    };
    requestAnimationFrame(createImages);
});