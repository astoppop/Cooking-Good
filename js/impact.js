const maskReveal = (element, direction, duration) => {
    $({ x: 0 }).animate({ x: 100 }, {
        duration: duration,
        step: (val) => {
            let adjustedVal = direction == 1 ? 100 - val : val;
            element.css({ 'clip-path': `polygon(0 ${adjustedVal}%, 100% ${adjustedVal}%, 100% 100%, 0 100%)` });
            if (!element.hasClass('image-stack-clicked')) { element.show(); }
        },
        complete: () => { if (direction == -1) { element.hide(); } },
    });
};

const maskRevealParagraph = (paragraph, direction, duration) => {
    for (let span of paragraph.children()) {
        maskReveal($(span), direction, duration);
    }
};

const adjustTranslate = (element, direction, duration) => {
    $({ x: 0 }).animate({ x: 50 }, {
        duration: duration,
        step: (val) => {
            let adjustedVal = direction == 1 ? 50 - val : val;
            element.css({ 'transform': `translate(${-adjustedVal}%, ${adjustedVal}%)` });
        },
    });
};

const prepareParagraphMaskReveal = (paragraph) => {
    let wordList = paragraph.text().split(' ');
    paragraph.empty()
    for (let word of wordList) {
        let span = $('<span>');
        span.text(word + ' ');
        span.addClass('mask-reveal');
        paragraph.append(span);
    }
};

const restoreImageStack = (imageStack) => {
    for (let image of imageStack.children()) {
        image = $(image);
        image.animate({ opacity: 1 }, 300);
        image.removeClass('image-stack-clicked');
        image.show();
    }
};

const manageImageStackClick = (imageStack) => {
    let shown = 2;
    let images = imageStack.children();
    let clickIcon = $('.click-icon', imageStack);
    $(images.get(shown)).css({ 'cursor': 'pointer' });
    imageStack.click((event) => {
        let image = $(images.get(shown));
        clickIcon.hide();
        if (shown == 0) {
            $(images.get(shown)).css({ 'cursor': 'auto' });
            restoreImageStack(imageStack);
            shown = 2;
            $(images.get(shown)).css({ 'cursor': 'pointer' });
        } else if (event.target == image[0]) {
            $(images.get(shown)).css({ 'cursor': 'auto' });
            image.animate({
                opacity: 0,
            }, {
                duration: 300,
                complete: () => {
                    image.addClass('image-stack-clicked');
                    image.hide();
                    shown -= 1;
                    $(images.get(shown)).css({ 'cursor': 'pointer' });
                },
            });
        }
    });
};

$(window).ready(() => {
    $(window).scrollTop(($('body').height() - $(window).height()) / 2);
    const cookingVideo = $('video.cooking-video');
    cookingVideo.playbackRate = 10;

    let animationIndex = -1;
    let inAnimation = false;

    prepareParagraphMaskReveal($('.impact-text'));
    manageImageStackClick($('.impact-bg .img-stack'));
    manageImageStackClick($('.health-bg .img-stack'));

    const animations = [
        [
            [$('.impact-bg'), { bottom: '-100vh' }, { bottom: '0' }, 500, 0],
            [$('.impact-bg .impact-text'), { top: '115vh' }, { top: '15vh' }, 500, 0],
            [$('.impact-bg .img-stack'), { top: '150vh' }, { top: '50vh' }, 500, 0],
            [$('.impact-bg .img-stack img.click-icon'), { opacity: '0' }, { opacity: '1' }, 500, 500],
            [$('.impact-bg .img-stack .line'), { top: '105vh' }, { top: '5vh' }, 500, 0],
            [$('.impact-title'), { 'font-size': '20rem', color: '#000000', width: '60rem', left: '50%', bottom: '50%' }, { 'font-size': '16rem', color: '#ffffff', width: '50rem', left: '1vmax', bottom: '1vmax' }, 400, 100],
        ],
        [
            [$('.health-bg'), { right: '-100vw' }, { right: '0' }, 500, 0],
            [$('.health-bg .health-text'), { left: '140vmax' }, { left: '40vmax' }, 500, 0],
            [$('.health-bg .img-stack'), { left: '120vmax' }, { left: '20vmax' }, 500, 0],
            [$('.health-bg .img-stack img.click-icon'), { opacity: '0' }, { opacity: '1' }, 500, 500],
            
        ],
    ];
    const customPropertyAnimations = [
        [
            [$('.impact-bg .impact-text'), maskRevealParagraph, 300, 400],
            [$('.impact-bg .img-stack img:nth-child(1)'), maskReveal, 800, 300],
            [$('.impact-bg .img-stack img:nth-child(2)'), maskReveal, 800, 600],
            [$('.impact-bg .img-stack img:nth-child(3)'), maskReveal, 800, 900],
            [$('.impact-title'), adjustTranslate, 400, 100]
        ],
        [
            [$('.health-bg .img-stack img:nth-child(1)'), maskReveal, 800, 300],
            [$('.health-bg .img-stack img:nth-child(2)'), maskReveal, 800, 600],
            [$('.health-bg .img-stack img:nth-child(3)'), maskReveal, 800, 900],
            [$('.health-title'), maskReveal, 400, 0],
        ],
    ];

    const animationHandler = (index, direction) => {
        if (direction == -1) { index += 1; }

        inAnimation = true;
        let time = 0;
        for (let animation of animations[index]) {
            let [element, from, to, duration, delay] = animation;
            time = Math.max(time, duration + delay);
            if (direction == -1) { [from, to] = [to, from]; }
            setTimeout(() => {
                element.css(from);
                if (duration == 0) {element.css(to);}
                else {element.animate(to, duration);}
            }, delay);
        }
        for (let animation of customPropertyAnimations[index]) {
            let [element, type, duration, delay] = animation;
            time = Math.max(time, duration + delay);
            setTimeout(() => {
                type(element, direction, duration);
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