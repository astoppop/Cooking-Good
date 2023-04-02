export let targetBackgroundColor = [[0, 0, 0], [255, 255, 255], [0, 0, 0]];
export let imagePath = '';

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
const discoverTitleText = 'Discover';

$(window).ready(() => {
    rightPanel = $('.right-panel');
    rightPanelTitle = $('.right-panel h1');
    rightPanelText = $('.right-panel p');

    popup = $('.popup');
    popupCloseBg = $('.close-bg');
    popupCloseBg.click(() => { popup.addClass('hidden'); });

    title = $('.title');
    let titleH = $('.title h1');
    for (let letter of discoverTitleText) {
        let span = $('<span>')
        span.text(letter);
        titleH.append(span);
    }
});

let firstChange = true;
const changeInformation = (marker) => {
    rightPanel.animate({ right: '-100vw' }, {
        duration: 300,
        complete: () => {
            rightPanelTitle.text(discoverJson[marker].title);
            rightPanelText.text(discoverJson[marker].description);
            rightPanel.animate({ right: '50px' }, 300);
        },
    });
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