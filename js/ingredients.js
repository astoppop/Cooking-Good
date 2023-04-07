const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const lerp = (start, end, t) => { return start * (1 - t)  + end * t; };

let allowTrack = true;

const mouseTrack = (move, change) => {
    let coords = [0, 0];
    let lerpCoords = [0, 0];

    move.mouseleave(() => { coords = [0, 0]; });

    move.mousemove((event) => {
        if (allowTrack) { coords = [((event.clientX - move.get(0).getBoundingClientRect().left) / move.width()) * 2 - 1, -((event.clientY - move.get(0).getBoundingClientRect().top) / move.height()) * 2 + 1]; }
        else { coords = [0, 0]; }
    });
    let track = () => {
        lerpCoords = [lerp(lerpCoords[0], coords[0], 0.05), lerp(lerpCoords[1], coords[1], 0.05)];
        change.css('background-position', `${lerpCoords[0] * -5}px ${lerpCoords[1] * 5}px`);
        requestAnimationFrame(track);
    };
    requestAnimationFrame(track);
};

const link = (card, reveal, color) => {
    card.click(() => {
        card.parent().parent().hide();
        reveal.show();
    });
};

$(window).ready(() => {
    if (!params.has('ingredient')) {
        $('.info').hide();
        mouseTrack($('.cover'), $('.cover h1'));
        $('.card').each((i, element) => {
            mouseTrack($(element), $(element));
        });

        link($('.herbs-spices.card'), $('.herbs-spices.bg'));
        link($('.carbs-grains.card'), $('.carbs-grains.bg'));
        link($('.liquids.card'), $('.liquids.bg'));

        $('.back.card').click(() => {
            $('.bg').hide();
            $('.ingredients.bg').show();
        });

        $('.card').click((event) => {
            let target = $(event.currentTarget);
            if (!target.parent().parent().is($('.ingredients.bg')) && !target.hasClass('back')) {
                allowTrack = false;
                target.css({
                    'position': 'fixed',
                    'z-index': 999,
                    width: target.width(),
                    height: target.height(),
                });
                target.animate({
                    left: -$('.layout').offset().left,
                    top: -target.offset().top,
                    width: $(window).width() / 2,
                    height: $(window).height(),
                }, {
                    duration: 300,
                    complete: () => { window.location.href += `?ingredient=${target.attr('id')}`; },
                });
            }
        });

        let velocity = 0;
        $(window).on('wheel', (event) => {
            velocity += event.originalEvent.deltaY;
            velocity = clamp(velocity, -250, 250);
        });
        const scrollHorizontal = () => {
            $('.content').scrollLeft($('.content').scrollLeft() + (velocity / 4));
            velocity = lerp(velocity, 0, 0.2);
            requestAnimationFrame(scrollHorizontal);
        };
        requestAnimationFrame(scrollHorizontal);
    } else {
        $('.content').hide();
    }
});