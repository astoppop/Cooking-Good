const cutAnimationTime = 250;
const curtainsAnimationTime = 500;
const curtainsStartDelay = 1000;

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
        setTimeout(() => {curtains.addClass('hidden');}, curtainsAnimationTime);
    }, curtainsStartDelay);

    hamburgerBg.click(() => {
        hamburger.toggleClass('toggle');
        navLinks.toggleClass('hidden');
    });

    const homeLink = $('.link.home');
    const discoverLink = $('.link.discover');
    const recipesLink = $('.link.recipes');
    const impactLink = $('.link.impact');

    const homeLinkText = 'Home';
    const discoverLinkText = 'Discover';
    const recipesLinkText = 'Recipes';
    const impactLinkText = 'Impact';

    const createNavP = (nav, text) => {
        let p = $('<p>');
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

        nav.append(p);
    };

    createNavP(homeLink, homeLinkText);
    createNavP(discoverLink, discoverLinkText);
    createNavP(recipesLink, recipesLinkText);
    createNavP(impactLink, impactLinkText);

    const createParticle = () => {
        let particle = $('<div>');
        trail.append(particle);
        particle.css({
            left: cuttingPoint.offset().left,
            top: cuttingPoint.offset().top + cuttingPoint.height() / 2 - particle.height() / 2,
        });
        particle.animate({
            width: '1px',
            height: '1px',
        }, {
            duration: 100,
            easing: 'linear',
            step: () => {particle.css({ top: cuttingPoint.offset().top + cuttingPoint.height() / 2 - particle.height() / 2 })},
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
        let [top, bottom] = $('p', text).children();
        cuttingPoint.removeClass('hidden');
        cuttingPoint.css({
            top: `${text.offset().top + text.height() * 0.6 - cuttingPoint.height() / 2}px`,
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
			curtains.removeClass('hidden');
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
            case 'Recipes':
                cut(recipesLink, './recipes.html');
                return;
            case 'Impact':
                cut(impactLink, './impact.html');
                return;
        }
    });
});