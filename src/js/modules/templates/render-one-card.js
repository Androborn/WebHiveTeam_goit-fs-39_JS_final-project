import sorryPosterImage from '../../../images/home/sorry-poster.jpg';
import { ThemoviedbApi } from '../http-services/themoviedb-api';

const moviesApi = new ThemoviedbApi();
const GENRES_LIST_KEY = 'Genres list';
moviesApi
  .getMoviesGenresList()
  .then(list => {
    localStorage.setItem(GENRES_LIST_KEY, JSON.stringify(list));
  })
  .catch(console.log);

export class createCardsMarkup {
  constructor(cards, page) {
    this.cards = cards;
    this.page = page;
    this.moviesApi = new ThemoviedbApi();
    this.genres = JSON.parse(localStorage.getItem(GENRES_LIST_KEY));
  }

  getMovieGenresName(genreId) {
    const filmGenre = this.genres.find(genre => genre.id === genreId);
    return filmGenre.name;
  }
  createGenresList(genresId) {
    const genresNames = genresId.map(id => this.getMovieGenresName(id));
    if (genresNames === []) {
      ('Жанр отсутствует');
    }
    if (genresNames.length >= 4) {
      const CorrecТame = genresNames.slice(0, 2);
      CorrecТame.push('Other...');
      return CorrecТame.join(', ');
    }
    return genresNames.join(', ');
  }

  correctedDate(release_date) {
    if (!release_date) {
      return 'Дата отсутствует';
    }
    return release_date.slice(0, 4);
  }

  slicedOriginalTitle(original_title) {
    if (original_title.length >= 35) {
      const slisedTitle = original_title.slice(0, 35);
      return slisedTitle + ' ...';
    }
    return original_title;
  }

  async createCard() {
    if (this.page === 'main') {
      return await this.cards
        .map(
          ({ id, poster_path, original_title, genre_ids, release_date }) =>
            `<li class="cards-list__item" id="${id}">
        <img class="cards-list__img" src=${
          poster_path === null
            ? sorryPosterImage
            : `https://image.tmdb.org/t/p/w500${poster_path}`
        } alt="${original_title}" />
        <div class="cards-list__info">
          <h2 class="cards-list__info-name">${this.slicedOriginalTitle(
            original_title,
          )}</h2>
          <div class="card-list__description">
             <p class="cards-list__genre">${
               this.createGenresList(genre_ids)
                 ? this.createGenresList(genre_ids)
                 : 'Жанр отсутствует'
             }</p>
            <p class="cards-list__date">| ${this.correctedDate(
              release_date,
            )}</p>
          </div>
        </div>
      </li>`,
        )
        .join('');
    }
    return await this.cards
      .map(
        ({
          id,
          poster_path,
          original_title,
          genre_ids,
          release_date,
          vote_average,
        }) =>
          `<li class="cards-list__item" id="${id}">
        <img class="cards-list__img" src=${
          poster_path === null
            ? sorryPosterImage
            : `https://image.tmdb.org/t/p/w500${poster_path}`
        } alt="${original_title}" />
        <div class="cards-list__info">
          <h2 class="cards-list__info-name">${this.slicedOriginalTitle(
            original_title,
          )}</h2>
          <div class="card-list__description">
             <p class="cards-list__genre">${
               this.createGenresList(genre_ids)
                 ? this.createGenresList(genre_ids)
                 : 'Жанр отсутствует'
             }</p>
            <p class="cards-list__date">| ${this.correctedDate(
              release_date,
            )}</p>
            <span class="cards-list__rating">${vote_average}</span>
          </div>
        </div>
      </li>`,
      )
      .join('');
  }
}
