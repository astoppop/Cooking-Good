const createCard = (cards, recipe) => {
    let card = $('<div>');

    let title = $('<h1>');
    title.text(recipe.title);
    card.append(title);

    let description = $('<p>');
    description.text(recipe.description);
    card.append(description);

    cards.append(card);
    console.log(recipe);
}

fetch('../assets/recipes.json')
    .then(response => {return response.json();})
    .then(json => {
        $(window).ready(() => {
            const cards = $('.cards');
            json.forEach(recipe => {
                createCard(cards, recipe);
            });
        });
    });