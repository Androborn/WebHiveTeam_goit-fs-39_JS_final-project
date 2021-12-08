import { createCardsMarkup } from '../templates/render-one-card';
import { RenderModal } from './render-one-card-modal';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { LibraryStorage } from './library-storage';
import Loader from '../../vendors/_icon8';
const spiner = new Loader();
export class MovieService {
  constructor() {
    this.mainRef = document.querySelector('.cards-list');
    this.movies = new ThemoviedbApi();
    this.modalWindow = new RenderModal();
    this.watchedStorage = new LibraryStorage('watched');
    this.queueStorage = new LibraryStorage('queue');
    const inputRef = document.querySelector('.header-serch__input');
    inputRef.addEventListener('keydown', event => {
      this.onInputKeydown(event);
    });
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

  async renderMarkupAtHomePage() {
    this.mainRef.innerHTML = '';
    await this.movies.getMovies().then(({ results }) => {
      this.renderMovies(results, 'main');
    });
  }

  async searchFilmByInputValue(searchQuery) {
    this.movies.search = searchQuery;
    await this.movies.getMoviesByKeyword().then(({ results }) => {
      this.renderMovies(results, 'main');
    });
  }

  async onInputKeydown(event) {
    if (event.key !== 'Enter') return;
    spiner.hideSearch();
    spiner.renderHeaderLoader();
    const searchQuery = event.target.value.trim();
    if (searchQuery) {
      await this.searchFilmByInputValue(searchQuery);
      spiner.deleteHeaderSpiner();
      spiner.showSearch();
    } else {
      await this.renderMarkupAtHomePage();
      spiner.deleteHeaderSpiner();
      spiner.showSearch();
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

  async renderMovies(movies, page, libraryTab) {
    const watchedMarkup = new createCardsMarkup(movies, page, libraryTab);
    const moviesCards = await watchedMarkup.createCard();
    this.mainRef.innerHTML = moviesCards;
  }
}
