$(window).ready(() => {
    $(window).scrollTop(($('body').height() - $(window).height()) / 2);
    const cookingVideo = $('video.cooking-video');
    cookingVideo.playbackRate = 1.5;

    const impactBg = $('.impact-bg');
    const title = $('.title');

    let animationIndex = -1;
    let inAnimation = false;
    const animations = [
        [
            [impactBg, { bottom: '-100vh' }, { bottom: '0' }, 500, 0],
            [title, { 'font-size': '20vw' }, { 'font-size': '10vw' }, 400, 100],
        ],
    ];

    const animationHandler = (index, dir) => {
        if (dir == -1) { index += 1; }
        inAnimation = true;
        let time = 0;
        for (let animation of animations[index]) {
            let [element, from, to, duration, delay] = animation;
            time = Math.max(time, duration + delay);
            setTimeout(() => {
                if (dir == 1) {
                    element.css(from);
                    element.animate(to, duration);
                } else if (dir == -1) {
                    element.css(to);
                    element.animate(from, duration);
                }
            }, delay);
        }
        setTimeout(() => { inAnimation = false; }, time);
        
    };

    let ignoreNextScroll = false;
    $(window).scroll(() => {
        if (ignoreNextScroll) {
            ignoreNextScroll = false;
            return;
        }
        let scrolled = Math.sign($(window).scrollTop() - (($('body').height() - $(window).height()) / 2));
        ignoreNextScroll = true;
        $(window).scrollTop(($('body').height() - $(window).height()) / 2);
        if (!inAnimation && -1 <= animationIndex + scrolled && animationIndex + scrolled <= animations.length - 1) {
            animationIndex += scrolled;
            animationHandler(animationIndex, scrolled);
        }
    });
});