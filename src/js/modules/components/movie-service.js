import { createCardsMarkup } from '../templates/render-one-card';
import { RenderModal } from './render-one-card-modal';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { LibraryStorage } from './library-storage';

export class MovieService {
  constructor() {
    this.mainRef = document.querySelector('.cards-list');
    this.movies = new ThemoviedbApi();
    this.modalWindow = new RenderModal();
    this.watchedStorage = new LibraryStorage('watched');
    this.queueStorage = new LibraryStorage('queue');
    const inputRef = document.querySelector('.header-serch__input');
    inputRef.addEventListener('keydown', event => this.onInputKeydown(event));
  }

  renderPage(page, libraryTab) {
    if (page === 'home') {
      this.renderMarkupAtHomePage();
    } else if (page === 'library' && libraryTab === 'watched') {
      this.renderMarkupAtLibraryWatchedPage();
    } else if (page === 'library' && libraryTab === 'queue') {
      this.renderMarkupAtLibraryQueuePage();
    }
  }

  renderMarkupAtHomePage() {
    this.mainRef.innerHTML = '';
    this.movies.getMovies().then(({ results }) => {
      this.renderMovies(results, 'main');
    });
  }

  searchFilmByInputValue(searchQuery) {
    this.movies.search = searchQuery;
    this.movies.getMoviesByKeyword().then(({ results }) => {
      this.renderMovies(results, 'main');
    });
  }

  onInputKeydown(event) {
    if (event.key !== 'Enter') return;
    const searchQuery = event.target.value.trim();
    if (searchQuery) {
      this.searchFilmByInputValue(searchQuery);
    } else {
      this.renderMarkupAtHomePage();
    }
  }

  async renderMarkupAtLibraryWatchedPage() {
    let ids = this.watchedStorage.getStorageList();
    const movies = await Promise.all(
      ids.map(id => this.movies.getMovieById(id)),
    );
    for (let movie of movies) {
      movie.genre_ids = movie.genres.map(x => x.id);
    }
    this.renderMovies(movies, 'library');
  }

  async renderMarkupAtLibraryQueuePage() {
    let ids = this.queueStorage.getStorageList();
    const movies = await Promise.all(
      ids.map(id => this.movies.getMovieById(id)),
    );
    for (let movie of movies) {
      movie.genre_ids = movie.genres.map(x => x.id);
    }
    this.renderMovies(movies, 'library');
  }

  renderMovies(movies, page, libraryTab) {
    const watchedMarkup = new createCardsMarkup(movies, page, libraryTab);
    const moviesCards = watchedMarkup.createCard();
    this.mainRef.innerHTML = moviesCards;
  }
}
