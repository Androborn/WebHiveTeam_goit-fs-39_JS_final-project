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

export class CreateCardsMarkup {
  constructor(cards, page) {
    this.cards = cards;
    this.page = page;
    this.genres = JSON.parse(localStorage.getItem(GENRES_LIST_KEY));
    this.currentLng = localStorage.getItem('currentLng');
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
    if (genresNames.length >= 3) {
      const CorrecТame = genresNames.slice(0, 2);
      let others;
      switch (this.currentLng) {
        case 'ru':
          others = 'прочие...';
          break;
        case 'en':
          others = 'Others..';
          break;
        case 'ua':
          others = 'інші...';
          break;
        default:
          others = 'Others..';
          break;
      }
      CorrecТame.push(others);
      return CorrecТame.join(', ');
    }
    return genresNames.join(', ');
  }

  correctedDate(release_date) {
    if (!release_date) {
      let noDate;
      switch (this.currentLng) {
        case 'ru':
          noDate = 'Дата отсутствует';
          break;
        case 'en':
          noDate = 'No date';
          break;
        case 'ua':
          noDate = 'Дата відсутня';
          break;
        default:
          noDate = 'No date';
          break;
      }
      return noDate;
    }
    return release_date.slice(0, 4);
  }

  slicedOriginalTitle(title) {
    if (title.length >= 35) {
      const slisedTitle = title.slice(0, 35);
      return slisedTitle + '...';
    }
    return title;
  }

  createCard() {
    let noGenre;
    switch (this.currentLng) {
      case 'ru':
        noGenre = 'Жанр отсутствует';
        break;
      case 'en':
        noGenre = 'No genre';
        break;
      case 'ua':
        noGenre = 'Жанр відсутній';
        break;
      default:
        noGenre = 'No genre';
        break;
    }

    return this.cards
      .map(
        ({ id, poster_path, title, genre_ids, release_date, vote_average }) =>
          `<li class="card-list__item" id="${id}">
        <img class="card-list__img" src=${
          poster_path === null
            ? sorryPosterImage
            : `https://image.tmdb.org/t/p/w500${poster_path}`
        } alt="${title}" />
        <div class="card-list__info">
          <h2 class="card-list__info-name">${this.slicedOriginalTitle(
            title,
          )}</h2>
          <div class="card-list__description">
             <p class="card-list__genre">${
               this.createGenresList(genre_ids)
                 ? this.createGenresList(genre_ids)
                 : noGenre
             }</p>
            <p class="card-list__date">| ${this.correctedDate(release_date)}</p>
            <span class="card-list__rating">${vote_average}</span>
          </div>
        </div>
      </li>`,
      )
      .join('');
  }
}
