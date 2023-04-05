// animation function
const maskReveal = (element, direction, duration) => {
    $({ x: 0 }).animate({ x: 100 }, {
        duration: duration,
        step: (val) => {
            // adjustedVal is val accounting for direction
            let adjustedVal = direction == 1 ? 100 - val : val;
            element.css({ 'clip-path': `polygon(0 ${adjustedVal}%, 100% ${adjustedVal}%, 100% 100%, 0 100%)` });
            // makes sure images in an image stack that are meant to be hidden don't get shown
            if (!element.hasClass('image-stack-clicked')) { element.show(); }
        },
        complete: () => { if (direction == -1) { element.hide(); } },
    });
};

// animation function
// simply calls maskReveal on every span in a paragraph element
const maskRevealParagraph = (paragraph, direction, duration) => {
    for (let i = 0; i < paragraph.children().length; i++) {
        setTimeout(maskReveal, i * 2, $(paragraph.children().get(i)), direction, duration);
    }
};

// animation function
// sole purpose is to slowly reduce the translate of the IMPACT title at the start
// the translate isn't 0 in the first place in order to center the IMPACT title
const adjustTranslate = (element, direction, duration) => {
    $({ x: 0 }).animate({ x: 50 }, {
        duration: duration,
        step: (val) => {
            let adjustedVal = direction == 1 ? 50 - val : val;
            element.css({ 'transform': `translate(-50%, ${adjustedVal}%)` });
        },
    });
};

// turns each word in a paragraph element into its own span
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

// show every image in an image stack again
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
    // top most image gets pointer cursor
    $(images.get(shown)).css({ 'cursor': 'pointer' });
    imageStack.click((event) => {
        let image = $(images.get(shown));
        // click icon will only be shown at start
        clickIcon.hide();
        // if the bottom most image is clicked
        if (shown == 0) {
            $(images.get(shown)).css({ 'cursor': 'auto' });
            restoreImageStack(imageStack);
            shown = 2;
            $(images.get(shown)).css({ 'cursor': 'pointer' });
        // if anything that is not the bottom most image is clicked
        } else if (event.target == image[0]) {
            // set the image that was clicked to have a regular cursor
            $(images.get(shown)).css({ 'cursor': 'auto' });
            // set the image that was clicked to disappear
            image.animate({ opacity: 0 }, {
                duration: 300,
                complete: () => {
                    // flag to make sure the image doesn't get shown in maskReveal
                    image.addClass('image-stack-clicked');
                    // must hide to make sure pointer events go through
                    image.hide();
                    shown -= 1;
                    // set new top most image to have a pointer cursor
                    $(images.get(shown)).css({ 'cursor': 'pointer' });
                },
            });
        }
    });
};

$(window).ready(() => {
    const cookingVideo = $('video.cooking-video');
    cookingVideo.playbackRate = 2;

    let animationIndex = -1;
    let inAnimation = false;

    // call functions to turn paragraph into spans, manage image stacks, etc.
    prepareParagraphMaskReveal($('.impact-text'));
    manageImageStackClick($('.impact.bg .img-stack'));
    manageImageStackClick($('.health.bg .img-stack'));

    // idea is to have each slide have its own list of animations that it needs
    // for example, if you are on slide 1 and want to go slide 2, you would execute the first array of animations here (animations[0])
    // explained more in the for loop that goes through this
    const animations = [
        [
            [$('.impact.bg'), { bottom: '-100vh' }, { bottom: '0' }, 500, 0],
            [$('.impact.bg .impact-text'), { top: '115vh' }, { top: '15vh' }, 500, 0],
            [$('.impact.bg .img-stack'), { top: '150vh' }, { top: '50vh' }, 500, 0],
            [$('.impact.bg .img-stack img.click-icon'), { opacity: '0' }, { opacity: '1' }, 500, 500],
            [$('.impact.bg .img-stack .line'), { top: '105vh' }, { top: '5vh' }, 500, 0],
            [$('.impact-title'), { 'font-size': '20rem', color: '#000000', left: '50%', bottom: '50%' }, { 'font-size': '16rem', color: '#ffffff', left: '32vw', bottom: '1vmax' }, 400, 100],
        ],
        [
            [$('.health.bg'), { right: '-100vw' }, { right: '0' }, 500, 0],
            [$('.health.bg .health-text'), { left: '140vmax' }, { left: '40vmax' }, 500, 0],
            [$('.health.bg .img-stack'), { left: '120vmax' }, { left: '20vmax' }, 500, 0],
            [$('.health.bg .img-stack img.click-icon'), { opacity: '0' }, { opacity: '1' }, 500, 500],
        ],
        [
            [$('.health-stats-panel'), { top: '-100vh' }, { top: '0' }, 500, 0],
        ],
        [
            [$('.environment.bg'), { top: '-100vh' }, { top: '0' }, 500, 0],
        ],
        [
            [$('.money.bg'), { left: '-100vw' }, { left: '0' }, 500, 0],
        ],
        [
            [$('.creative.bg'), { right: '-100vw' }, { right: '0' }, 500, 0],
        ],
    ];

    // jQuery doesn't support certain animations so I pass in a function that does the animation I need
    const customPropertyAnimations = [
        [
            [$('.impact.bg .impact-text'), maskRevealParagraph, 300, 400],
            [$('.impact.bg .img-stack img:nth-child(1)'), maskReveal, 400, 300],
            [$('.impact.bg .img-stack img:nth-child(2)'), maskReveal, 400, 600],
            [$('.impact.bg .img-stack img:nth-child(3)'), maskReveal, 400, 900],
            [$('.impact-title'), adjustTranslate, 400, 100],
        ],
        [
            [$('.health.bg .img-stack img:nth-child(1)'), maskReveal, 400, 300],
            [$('.health.bg .img-stack img:nth-child(2)'), maskReveal, 400, 600],
            [$('.health.bg .img-stack img:nth-child(3)'), maskReveal, 400, 900],
            [$('.health-title'), maskReveal, 400, 0],
        ],
        [

        ],
        [

        ],
        [

        ],
        [

        ],
    ];

    const animationHandler = (index, direction) => {
        if (direction == -1) { index += 1; }

        inAnimation = true;
        // time is the most amount of time a slide's animations will take
        let time = 0;
        for (let animation of animations[index]) {
            // get each property of the animation
            let [element, from, to, duration, delay] = animation;
            time = Math.max(time, duration + delay);
            // if direction is negative (scrolling up), just switch to and from
            if (direction == -1) { [from, to] = [to, from]; }
            // timeout to account for delay
            setTimeout(() => {
                // start at from
                element.css(from);
                // end at to
                if (duration == 0) {element.css(to);}
                else {element.animate(to, duration);}
            }, delay);
        }
        for (let animation of customPropertyAnimations[index]) {
            // get each property of the animation
            let [element, type, duration, delay] = animation;
            time = Math.max(time, duration + delay);
            // timeout to account for delay
            setTimeout(() => {
                // call the wanted function and send the important information
                type(element, direction, duration);
            }, delay);
        }
        setTimeout(() => { inAnimation = false; }, time);
    };

    let ignoreNextScroll = false;
    let prevScroll = $(window).scrollTop();
    $(window).scroll(() => {
        if (ignoreNextScroll) {
            ignoreNextScroll = false;
            return;
        }
        let scrolled = Math.sign($(window).scrollTop() - prevScroll);
        ignoreNextScroll = true;
        // this triggers the event so the ignoreNextScroll flag is used to just ignore the trigger
        $(window).scrollTop(($('body').height() - $(window).height()) / animations.length * (animationIndex + 1));
        prevScroll = $(window).scrollTop();

        // if the new index isn't in bounds ignore it
        // also make sure animation isn't in place, without this there would be no cooldown for scrolling between slides
        if (!inAnimation && -1 <= animationIndex + scrolled && animationIndex + scrolled <= animations.length - 1) {
            animationIndex += scrolled;
            animationHandler(animationIndex, scrolled);
        }
    });
});