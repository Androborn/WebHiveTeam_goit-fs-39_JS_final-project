import { createCardsMarkup } from '../templates/render-one-card';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { queueStorage, watchedStorage } from './library-storage';
import { modal } from './render-one-card-modal';
import Loader from '../../vendors/_icon8';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

const spiner = new Loader();

class MovieService {
  constructor() {
    this.mainRef = document.querySelector('.cards-list');
    this.movies = new ThemoviedbApi();
    this.container = document.getElementById('pagination');
    this.modalWindow = modal;
    this.watchedStorage = watchedStorage; // наново створюэ бібліотеку при кожній перезагрузці сторінки.
    this.queueStorage = queueStorage;
    this.iconSearchRef = document.querySelector('.header-serch__icon');
    this.iconSearchRef = document.addEventListener('click', event =>
      this.onSearchIconClick(event),
    );
    this.options = {
      totalItems: 20000,
      itemsPerPage: 20,
      visiblePages: 5,
      page: this.movies.currentPage,
      centerAlign: true,
      firstItemClassName: 'tui-first-child',
      lastItemClassName: 'tui-last-child',
      template: {
        page: '<a href="#" class="tui-page-btn" style="width:30px; height:30px; border:1px solid transparent;border-radius: 5px;">{{page}}</a>',
        currentPage:
          '<strong class="tui-page-btn tui-is-selected" style="width:30px; height:30px; background-color:#ff6b08; border:1px solid; border-radius: 5px;">{{page}}</strong>',
        moveButton:
          '<a href="#" class="tui-page-btn tui-{{type}}"style="width:30px; height:30px; border-radius:5px; border:none;">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</a>',
        disabledMoveButton:
          '<span class="tui-page-btn tui-is-disabled tui-{{type}}" style="border:none;">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</span>',
        moreButton:
          '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip" style="border-radius:5px; border:none;">' +
          '<span class="tui-ico-ellip">...</span>' +
          '</a>',
      },
    };

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
    // this.mainRef.innerHTML = ''; // можливо не потрібно

    if (this.container.classList.contains('visually-hidden')) {
      this.container.classList.remove('visually-hidden');
    }
    await this.movies.getMovies().then(({ results }) => {
      const pagin = new Pagination(this.container, this.options);
      this.renderMovies(results, 'main');
      pagin.on('afterMove', async event => {
        this.movies.currentPage = event.page;
        await this.movies.getMovies().then(({ results }) => {
          this.renderMovies(results, 'main');
        });
        this.movies.resetPage();
      });
    });
  }
  async searchFilmByInputValue(searchQuery) {
    this.movies.search = searchQuery;
    await this.movies
      .getMoviesByKeyword()
      .then(({ results, total_results }) => {
        this.options.totalItems = total_results;
        this.renderMovies(results, 'main');
        if (total_results < this.options.itemsPerPage) return;
        const pagin = new Pagination(this.container, this.options);
        pagin.on('afterMove', async event => {
          this.movies.currentPage = event.page;
          await this.movies.getMoviesByKeyword().then(({ results }) => {
            this.renderMovies(results, 'main');
          });
          this.movies.resetPage();
        });
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

  async onSearchIconClick(event) {
    if (event.target.nodeName != 'svg') {
      return;
    }
    const searchQuery = event.target.previousElementSibling.value;

    if (searchQuery === '' || searchQuery === undefined) {
      return;
    }
    await this.searchFilmByInputValue(searchQuery);
  }

  async renderMarkupAtLibraryWatchedPage() {
    watchedStorage.createStorage();
    let ids = watchedStorage.getStorageList();
    const movies = await Promise.all(
      ids.map(id => this.movies.getMovieById(id)),
    );
    for (let movie of movies) {
      movie.genre_ids = movie.genres.map(x => x.id);
    }
    this.renderMovies(movies, 'library');

    if (ids.length < this.options.itemsPerPage) {
      this.container.classList.add('visually-hidden');
    } else {
      this.options.totalItems = ids.length;
      const pagin = new Pagination(this.container, this.options);
    }
  }

  async renderMarkupAtLibraryQueuePage() {
    queueStorage.createStorage();
    let ids = queueStorage.getStorageList();
    const movies = await Promise.all(
      ids.map(id => this.movies.getMovieById(id)),
    );
    for (let movie of movies) {
      movie.genre_ids = movie.genres.map(x => x.id);
    }
    this.renderMovies(movies, 'library');

    if (ids.length < this.options.itemsPerPage) {
      this.container.classList.add('visually-hidden');
    } else {
      this.options.totalItems = ids.length;
      const pagin = new Pagination(this.container, this.options);
    }
  }

  async renderMovies(movies, page, libraryTab) {
    const watchedMarkup = new createCardsMarkup(movies, page, libraryTab);
    const moviesCards = await watchedMarkup.createCard();
    this.mainRef.innerHTML = moviesCards;
  }
}

export const movieService = new MovieService();
