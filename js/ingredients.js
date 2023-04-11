const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const lerp = (start, end, t) => { return start * (1 - t)  + end * t; };

let infoShown = false;

// originially created animations for hovering cards, but just didn't look good, might reimplement
// const mouseTrack = (move, change) => {
//     let coords = [0, 0];
//     let lerpCoords = [0, 0];

//     move.mouseleave(() => { coords = [0, 0]; });

//     move.mousemove((event) => {
//         if (!infoShown) { coords = [((event.clientX - move.get(0).getBoundingClientRect().left) / move.width()) * 2 - 1, -((event.clientY - move.get(0).getBoundingClientRect().top) / move.height()) * 2 + 1]; }
//         else { coords = [0, 0]; }
//     });
//     let track = () => {
//         lerpCoords = [lerp(lerpCoords[0], coords[0], 0.05), lerp(lerpCoords[1], coords[1], 0.05)];
//         change.css('background-position', `center ${lerpCoords[0] * -5}px center ${lerpCoords[1] * 5}px`);
//         requestAnimationFrame(track);
//     };
//     requestAnimationFrame(track);
// };

// create event to show ingredients
const link = (card, reveal, color) => {
    card.click(() => {
        card.parent().parent().hide();
        reveal.show();
    });
};

const reset = (card) => {
    card.css({
        'position': 'absolute',
        'z-index': 'inherit',
        width: '100%',
        height: '90vh',
        left: 'initial',
        top: 'initial',
    });
    $('h2', card).css({ opacity: 1});
};

let ingredientsJson;
fetch('../assets/ingredients.json')
    .then(response => {return response.json();})
    .then(json => { ingredientsJson = json; });

$(window).ready(() => {
    $('.info').hide();
    $('.info .card').hide();

    // look above for more information
    // mouseTrack($('.cover'), $('.cover h1'));
    // $('.card').each((i, element) => {
    //     mouseTrack($(element), $(element));
    // });

    link($('.herbs-spices.card'), $('.herbs-spices.bg'));
    link($('.carbs-grains.card'), $('.carbs-grains.bg'));
    link($('.liquids.card'), $('.liquids.bg'));

    $('.back.card').click(() => {
        $('.bg').hide();
        $('.ingredients.bg').show();
    });

    // eventually will have the ability to click on each ingredient card and get information about that ingredient
    // $('.card:not(.info .card)').click((event) => {
    //     let target = $(event.currentTarget);
    //     if (!target.parent().parent().is($('.ingredients.bg')) && !target.hasClass('back')) {
    //         infoShown = true;

    //         $('.info .text').css({ right: '-50vw' });
    //         $('.info').show();
    //         setTimeout(() => { $('.info .text').animate({ right: 0 }, 200); }, 1000);

    //         target.css({
    //             'position': 'fixed',
    //             'z-index': 1,
    //             width: target.width(),
    //             height: target.height(),
    //         });
    //         $('h2', target).animate({ opacity: 0 }, 1000);
    //         target.animate({
    //             left: -$('.layout').offset().left,
    //             top: -target.offset().top,
    //             width: $(window).width() / 2,
    //             height: $(window).height() - 10,
    //         }, {
    //             duration: 1000,
    //             complete: () => {
    //                 $('.info .card').show();
    //                 $('.info .card').removeClass().addClass('card').addClass(target.attr('id'));
    //             },
    //         });

    //         setTimeout(reset, 1200, target);
    //     }
    // });

    // allow horizontal scrolling when using a vertical scroll wheel
    // need this system for smoother scrolling
    let velocity = 0;
    $(window).on('wheel', (event) => {
        velocity += event.originalEvent.deltaY;
        velocity = clamp(velocity, -250, 250);
    });
    const scrollHorizontal = () => {
        // need to round because scroll automatically rounds down (ex. -0.2 -> -1), so just round regularly first
        if (!infoShown) { $('.content').scrollLeft($('.content').scrollLeft() + Math.round(velocity / 4)); }
        velocity = lerp(velocity, 0, 0.2);
        requestAnimationFrame(scrollHorizontal);
    };
    requestAnimationFrame(scrollHorizontal);
});