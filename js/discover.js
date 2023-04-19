export let targetBackgroundColor = [[0, 0, 0], [255, 255, 255], [0, 0, 0]];
export let imagePath = '';

// decided to use json to make it easier to maintain and update
let discoverJson;
fetch('../assets/discover.json')
    .then(response => {return response.json();})
    .then(json => {discoverJson = json;});

$(window).ready(() => {
    // close directions
    $('.close-bg').click(() => {
        $('.popup').animate({ opacity: 0 }, {
            duration: 500,
            complete: () => { $('.popup').hide(); },
        })
    });

    $('.bottom.panel').click(() => { $('.bottom.panel').toggleClass('toggle'); });

    setTimeout(() => { $('.title').animate({ left: '50%' }, 2000); }, 500);
    // let discoverTitleText = titleH.text();
    // titleH.empty();
    // for (let letter of discoverTitleText) {
    //     let span = $('<span>')
    //     span.text(letter);
    //     titleH.append(span);
    // }
});

const changeInformation = (marker) => {
    // move right panel away
    $('.right.panel').animate({ right: '-100vw' }, 300);
    setTimeout(() => {
        // change text
        $('.panel h1').text(discoverJson[marker].title);
        $('.panel p').text(discoverJson[marker].description);
        // move right panel back in
        $('.right.panel').animate({ right: '50px' }, 300);
    }, 300);
}

export const onMarkerClick = (marker) => {
    // changes target color
    targetBackgroundColor = discoverJson[marker].colors;
    // change panels
    changeInformation(marker);
};