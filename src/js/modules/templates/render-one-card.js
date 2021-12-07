import { ThemoviedbApi } from "../http-services/themoviedb-api";
const moviesApi = new ThemoviedbApi();
const GENRES_LIST_KEY = "Genres list";
moviesApi.getMoviesGenresList().then(list => {
  localStorage.setItem(GENRES_LIST_KEY, JSON.stringify(list))
}).catch(console.log);

export class createCardsMarkup {
  constructor(cards, page) {
    this.cards = cards;
    this.page = page;
    this.genres = JSON.parse(localStorage.getItem(GENRES_LIST_KEY));
    
  }
  getMovieGenresName(genreId) {
    const filmGenre = this.genres.find(genre => genre.id === genreId);
      return filmGenre.name;
  }
  createGenresList(genresId) {
    const genresNames = genresId.map(id => this.getMovieGenresName(id)).join(', ');
    return genresNames;
  }
createCard() {
   if (this.page === "main") {
     return this.cards.map(({ id, poster_path, original_title, genre_ids, release_date, original_name }) => 
      `<li class="cards-list__item" id="${id}">
        <img class="cards-list__img" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${original_title}" />
        <div class="cards-list__info">
          <h2 class="cards-list__info-name">${original_name || original_title}</h2>
          <div class="card-list__description">
            <p class="cards-list__genre">${this.createGenresList(genre_ids)}</p>
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
