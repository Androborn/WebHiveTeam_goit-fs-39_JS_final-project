export class createCardsMarkup {
  constructor(cards, page) {
      this.cards = cards;
      this.page = page;
  }
 createCard(){
    if(this.page === "main") {
      return this.cards.map(({id, poster_path, original_title, genre_ids, release_date}) =>
      `<li class="cards-list__item" id="${id}">
        <img class="cards-list__img" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${original_title}" />
        <div class="cards-list__info">
          <h2 class="cards-list__info-name">${original_title}</h2>
          <div class="card-list__description">
            <p class="cards-list__genre">${genre_ids}</p>
            <p class="cards-list__date">${release_date}</p>
          </div>
        </div>
      </li>`
    ).join('');
    };
      
      return this.cards.map(({id, poster_path, original_title, genre_ids, release_date, vote_average}) =>
      `<li class="cards-list__item" id="${id}">
        <img class="cards-list__img" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${original_title}" />
        <div class="cards-list__info">
          <h2 class="cards-list__info-name">${original_title}</h2>
          <div class="card-list__description">
            <p class="cards-list__genre">${genre_ids}</p>
            <p class="cards-list__date">${release_date}</p>
            <span class="cards-list__rating">${vote_average}</span>
          </div>
        </div>
      </li>`
    ).join('');
 };
}
