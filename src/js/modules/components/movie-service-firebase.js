import { CreateCardsMarkup } from './render-movie-card';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import Loader from '../../vendors/_icon8';
import Pagination from 'tui-pagination';
import { notiflix } from '../../vendors/notification';
import debounce from 'lodash.debounce';
import Firebase from '../../vendors/_firebase';

const spinner = new Loader();
let firebase = new Firebase();
class MovieService {
  constructor() {
    this.mainRef = document.querySelector('.card-list');
    this.movies = new ThemoviedbApi();
    this.container = document.getElementById('pagination');
    this.inputRef = document.querySelector('.header-serch__wrapper');
    this.inputRef.addEventListener('submit', event => {
      this.onInputSubmit(event);
    });
    this.inputRef.addEventListener('input', event => {
      this.onInputChange(event);
    });
    this.btnWrapperRef = document.querySelector('.main-section__btn-wrapper');
    this.btnWrapperRef.addEventListener('click', event => {
      this.getFilmsForRequestId(event);
    });
    this.iconSearchRef = document.querySelector('.header-serch__icon');
    this.iconSearchRef.addEventListener('click', () =>
      this.inputRef.requestSubmit(),
    );

    this.options = {
      itemsPerPage: 20,
      visiblePages: 5,
      page: this.movies.currentPage,
      centerAlign: true,
      firstItemClassName: 'tui-first-child',
      lastItemClassName: 'tui-last-child',
      template: {
        page: '<a href="#" class="tui-page-btn">{{page}}</a>',
        currentPage:
          '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
        moveButton:
          '<a href="#" class="tui-page-btn tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</a>',
        disabledMoveButton:
          '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</span>',
        moreButton:
          '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
          '<span class="tui-ico-ellip">...</span>' +
          '</a>',
      },
    };
  }

  renderPage(page, libraryTab) {
    if (page === 'home') {
      if (this.btnWrapperRef.classList.contains('visually-hidden')) {
        this.btnWrapperRef.classList.remove('visually-hidden');
      }
      this.renderMarkupAtHomePage();
    } else if (page === 'library') {
      this.btnWrapperRef.classList.add('visually-hidden');
      this.renderMarkupAtLibraryPage(libraryTab);
    }
  }

  async renderMarkupAtHomePage() {
    window.addEventListener(
      'resize',
      debounce(this.paginationDisplay.bind(this), 150),
    );
    if (this.container.classList.contains('visually-hidden')) {
      this.container.classList.remove('visually-hidden');
    }
    await this.movies
      .getMovies()
      .then(({ results, total_results }) => {
        this.options.totalItems = total_results;
        if (total_results <= this.options.itemsPerPage) {
          this.container.classList.add('visually-hidden');
        } else if (this.container.classList.contains('visually-hidden')) {
          this.container.classList.remove('visually-hidden');
        }
        this.renderMovies(results, 'main');
      })
      .catch(console.log);
    const pagin = new Pagination(this.container, this.options);
    pagin.on('afterMove', async event => {
      if (this.movies.currentPage === event.page) return;
      this.movies.currentPage = event.page;
      await this.movies
        .getMovies()
        .then(({ results }) => {
          this.renderMovies(results, 'main');
        })
        .catch(console.log);
    });
    pagin.movePageTo(this.movies.currentPage);
  }
  async searchFilmByInputValue(searchQuery) {
    this.movies.search = searchQuery;
    if (searchQuery === this.prevSearchQuery) return;
    this.prevSearchQuery = searchQuery;
    spinner.hideSearch();
    spinner.renderHeaderLoader();
    await this.movies
      .getMoviesByKeyword()
      .then(({ results, total_results }) => {
        if (total_results <= this.options.itemsPerPage) {
          this.container.classList.add('visually-hidden');
        } else if (this.container.classList.contains('visually-hidden')) {
          this.container.classList.remove('visually-hidden');
        }
        this.options.totalItems = total_results;
        notiflix.searchResult(total_results);
        this.renderMovies(results, 'main');
        this.iconSearchRef.classList.add('header-serch__icon--disabled');
        if (total_results < this.options.itemsPerPage) return;
      })
      .catch(console.log);
    const pagin = new Pagination(this.container, this.options);
    pagin.on('afterMove', async event => {
      if (this.movies.currentPage === event.page) return;
      this.movies.currentPage = event.page;
      await this.movies
        .getMoviesByKeyword()
        .then(({ results }) => {
          this.renderMovies(results, 'main');
        })
        .catch(console.log);
      this.movies.resetPage();
    });
    spinner.deleteHeaderspinner();
    spinner.showSearch();
    this.inputRef.blur();
  }

  async onInputSubmit(event) {
    event.preventDefault();

    const searchQuery = event.currentTarget.elements.searchQuery.value.trim();

    if (searchQuery) {
      await this.searchFilmByInputValue(searchQuery);
    } else {
      await this.renderMarkupAtHomePage();
    }
  }

  onInputChange(event) {
    if (event) {
      this.iconSearchRef.classList.remove('header-serch__icon--disabled');
    }
  }

  async renderMarkupAtLibraryPage(tab) {
    let movies =
      tab === 'watched'
        ? await firebase.getDbWatched()
        : await firebase.getDbQueue();
    if (movies.length <= this.options.itemsPerPage) {
      this.container.classList.add('visually-hidden');
    } else if (this.container.classList.contains('visually-hidden')) {
      this.container.classList.remove('visually-hidden');
    }
    const pagin = new Pagination(this.container, {
      ...this.options,
      totalItems: movies.length,
    });
    pagin.on('afterMove', async event => {
      const page = event.page;
      await this.renderPageMarkupAtLibraryPage(movies, page);
    });
    await this.renderPageMarkupAtLibraryPage(movies, 1);
  }

  async renderPageMarkupAtLibraryPage(movies, page) {
    const from = (page - 1) * this.options.itemsPerPage;
    const to = page * this.options.itemsPerPage;
    const pageMovies = movies.slice(from, to);
    this.renderMovies(pageMovies, 'library');
  }

  async renderMovies(movies, page, libraryTab) {
    const cardsMarkup = new CreateCardsMarkup(movies, page, libraryTab);
    const moviesCards = cardsMarkup.createCard();
    this.mainRef.innerHTML = moviesCards;
  }
  getFilmsForRequestId(event) {
    const currentActiveBtn = document.querySelector(
      '.common-btn__request--active',
    );
    if (event.target === currentActiveBtn) return;
    if (currentActiveBtn) {
      currentActiveBtn.classList.remove('common-btn__request--active');
    }
    event.target.classList.add('common-btn__request--active');
    if (this.inputRef.children[0].value) {
      this.inputRef.children[0].value = '';
    }
    const requestName = event.target.getAttribute('id');
    this.renderMoviesForRequest(requestName);
  }
  renderMoviesForRequest(request) {
    this.movies.filmsOn = request;
    this.renderMarkupAtHomePage();
  }
  paginationDisplay() {
    if (window.innerWidth <= 767) {
      this.options.visiblePages = 3;
      this.pagin = new Pagination(this.container, this.options);
    } else {
      this.options.visiblePages = 5;
      this.pagin = new Pagination(this.container, this.options);
    }
  }
}

export const movieService = new MovieService();
