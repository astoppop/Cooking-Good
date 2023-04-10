const cutAnimationTime = 750;
const curtainsAnimationTime = 500;
const curtainsStartDelay = 1000;

// would like to construct nav bar in this file as well instead of including boilerplate for every html file
// but curtains must be in html file otherwise there is a split second between loading where there are no curtains

$(window).ready(() => {
    const nav = $('.nav');
    const hamburgerBg = $('.hamburger-bg');
    const hamburger = $('.hamburger');
    const navLinks = $('.nav-links');
    const cuttingPoint = $('.cutting-point');
    const trail = $('.cutting-point-trail');
	const curtains = $('.curtains');

    setTimeout(() => {
        for (let i = 0; i >= -90; i -= 0.1) {
            setTimeout(() => {
                $('div', curtains).css('rotate', `${i}deg`);
            }, curtainsAnimationTime / 90 * -i);
        }
    }, curtainsStartDelay);

    hamburgerBg.click(() => {
        hamburger.toggleClass('toggle');
        // mask reveal in and fade out
        if (navLinks.is(':hidden')) {
            for (let link of navLinks.children()) {
                $(link).stop();
                $(link).css({ opacity: 1 });
                // adjusted maskReveal from impact.js with obsolete parts deleted
                $({ x: 100 }).animate({ x: 0 }, {
                    duration: 500,
                    step: (val) => { $(link).css({ 'clip-path': `polygon(0 ${val}%, 100% ${val}%, 100% 100%, 0 100%)` }); },
                });
            }
            navLinks.toggle();
        } else {
            for (let link of navLinks.children()) {
                $(link).animate({ opacity: 0 }, 200);
            }
            setTimeout(() => { navLinks.toggle(); }, 200);
        }
    });

    const homeLink = $('.link.home');
    const discoverLink = $('.link.discover');
    const ingredientsLink = $('.link.ingredients');
    const impactLink = $('.link.impact');

    // convert a div's text into two spans with the same text
    const prepareParagraphCut = (p) => {
        let text = p.text();
        p.empty();
        p.attr('id', text);

        let topSpan = $('<span>');
        topSpan.addClass('top');
        topSpan.attr('id', text);

        let bottomSpan = $('<span>');
        bottomSpan.addClass('bottom');
        bottomSpan.attr('id', text);

        p.append(topSpan);
        p.append(bottomSpan);

        for (let letter of text) {
            let top = $('<span>');
            top.text(letter);
            top.attr('id', text);

            let bottom = $('<span>');
            bottom.text(letter);
            bottom.attr('id', text);

            topSpan.append(top);
            bottomSpan.append(bottom);
        }
    };
    
    prepareParagraphCut(homeLink);
    prepareParagraphCut(discoverLink);
    prepareParagraphCut(ingredientsLink);
    prepareParagraphCut(impactLink);

    const createParticle = () => {
        let particle = $('<div>');
        trail.append(particle);
        particle.css({
            left: cuttingPoint.offset().left,
            top: cuttingPoint.offset().top + cuttingPoint.height() / 2 - particle.height() / 2 - $(window).scrollTop(),
        });
        particle.animate({
            width: '1px',
            height: '1px',
        }, {
            duration: 100,
            easing: 'linear',
            step: () => { particle.css({ top: cuttingPoint.offset().top + cuttingPoint.height() / 2 - particle.height() / 2 - $(window).scrollTop() }) },
        });
        setTimeout(() => {
            particle.remove();
        }, 100);
    };

    const cutLetter = (top, bottom) => {
        if (top.offset().left > cuttingPoint.offset().left) {
            top.css('transform', 'translateY(-3px)');
            bottom.css('transform', 'translateY(3px)');
        }
    };

    const cut = (text, link) => {
        let [top, bottom] = text.children();
        cuttingPoint.show();
        cuttingPoint.css({
            top: `${text.offset().top + text.height() * 0.5 - cuttingPoint.height() / 2 - $(window).scrollTop()}px`,
            right: `-${cuttingPoint.width()}px`,
        });
        cuttingPoint.animate({
			right: `${$(window).width() + cuttingPoint.width()}px`,
		}, {
            duration: cutAnimationTime,
            easing: 'linear',
            step: () => {
                createParticle();
                for (let i = 0; i < $(top).children().length; i++) {
                    cutLetter($($(top).children().get(i)), $($(bottom).children().get(i)));
                }
            },
        });
        
		setTimeout(() => {
			curtains.show();
            for (let i = -90; i <= 0; i += 0.1) {
                setTimeout(() => {
                    $('div', curtains).css('rotate', `${i}deg`);
                }, curtainsAnimationTime / 90 * (90 + i));
            }
            setTimeout(() => {
                window.location.href = link;
            }, curtainsAnimationTime);
		}, cutAnimationTime);
    };

    navLinks.click((event) => {
        switch ($(event.target).attr('id')) {
            case 'Home':
                cut(homeLink, './index.html');
                return;
            case 'Discover':
                cut(discoverLink, './discover.html');
                return;
            case 'Ingredients':
                cut(ingredientsLink, './ingredients.html');
                return;
            case 'Impact':
                cut(impactLink, './impact.html');
                return;
        }
    });
});