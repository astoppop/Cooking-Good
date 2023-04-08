export let targetBackgroundColor = [[0, 0, 0], [255, 255, 255], [0, 0, 0]];
export let imagePath = '';

// decided to use json to make it easier to maintain and update
let discoverJson;
fetch('../assets/discover.json')
    .then(response => {return response.json();})
    .then(json => {discoverJson = json;});

let rightPanel;
let rightPanelTitle;
let rightPanelText;

let popup;
let popupCloseBg;

let title;

$(window).ready(() => {
    rightPanel = $('.right.panel');
    rightPanelTitle = $('.right.panel h1');
    rightPanelText = $('.right.panel p');

    popup = $('.popup');
    popupCloseBg = $('.close-bg');
    popupCloseBg.click(() => {
        popup.animate({ opacity: 0 }, {
            duration: 500,
            complete: () => { popup.hide(); },
        })
    });

    title = $('.title');
    let titleH = $('.title h1');
    let discoverTitleText = titleH.text();
    titleH.empty();
    for (let letter of discoverTitleText) {
        let span = $('<span>')
        span.text(letter);
        titleH.append(span);
    }
});

let firstChange = true;
const changeInformation = (marker) => {
    $('.right.panel').animate({ right: '-100vw' }, 300);
    setTimeout(() => {
        $('.panel h1').text(discoverJson[marker].title);
        $('.panel p').text(discoverJson[marker].description);
        $('.right.panel').animate({ right: '50px' }, 300);
    }, 300);
}

export const onMarkerClick = (marker) => {
    targetBackgroundColor = discoverJson[marker].colors;
    imagePath = `../assets/img/discover/${discoverJson[marker].title}`;
    if (firstChange) {
        title.animate({right: '-35vmax'}, 300);
        firstChange = false;
    }
    changeInformation(marker);
};