import { createCardsMarkup } from './render-movie-card';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { watchedStorage, queueStorage } from './library-storage';
import Loader from '../../vendors/_icon8';
import Pagination from 'tui-pagination';
import { notiflix } from '../../vendors/notification';

const spinner = new Loader();

class MovieService {
  constructor() {
    this.mainRef = document.querySelector('.card-list');
    this.movies = new ThemoviedbApi();
    this.container = document.getElementById('pagination');
    this.iconSearchRef = document.querySelector('.header-serch__icon');
    this.iconSearchRef.addEventListener('click', event =>
      this.onSearchIconClick(event),
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

    this.inputRef = document.querySelector('.header-serch__input');
    this.inputRef.addEventListener('keydown', event => {
      this.onInputKeydown(event);
    });
    this.inputRef.addEventListener('input', event => {
      this.onInputChange(event);
    });
    this.btnWrapperRef = document.querySelector('.main-section__btn-wrapper');
    this.btnWrapperRef.addEventListener('click', event => { this.getFilmsForRequestId(event)})
  }

  renderPage(page, libraryTab) {
    if (page === 'home') {
      if (this.btnWrapperRef.classList.contains('visually-hidden')) {
        this.btnWrapperRef.classList.remove('visually-hidden');
      }
      this.renderMarkupAtHomePage();
    } else if (page === 'library') {
      this.btnWrapperRef.classList.add('visually-hidden')
      this.renderMarkupAtLibraryPage(libraryTab);
    }
  }

  async renderMarkupAtHomePage() {
    if (this.container.classList.contains('visually-hidden')) {
      this.container.classList.remove('visually-hidden');
    }
    await this.movies.getMovies().then(({ results, total_results }) => {
      if (total_results <= this.options.itemsPerPage) {
        this.container.classList.add('visually-hidden');
      } else if (this.container.classList.contains('visually-hidden')) {
        this.container.classList.remove('visually-hidden');
      }
      const pagin = new Pagination(this.container, {
        ...this.options,
        totalItems: total_results,
      });
      this.renderMovies(results, 'main');
      pagin.on('afterMove', async event => {
        this.movies.currentPage = event.page;
        if (this.movies.currentPage === 1) return;
        await this.movies.getMovies().then(({ results }) => {
          this.renderMovies(results, 'main');
        });
      });
      pagin.movePageTo(this.movies.currentPage);
    });
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
        notiflix.searchResult(total_results);

        this.renderMovies(results, 'main');
        this.iconSearchRef.classList.add('header-serch__icon--disabled');
        if (total_results < this.options.itemsPerPage) return;
        const pagin = new Pagination(this.container, {
          ...this.options,
          totalItems: total_results,
        });
        pagin.on('afterMove', async event => {
          this.movies.currentPage = event.page;
          await this.movies.getMoviesByKeyword().then(({ results }) => {
            this.renderMovies(results, 'main');
          });
          this.movies.resetPage();
        });
      });
    spinner.deleteHeaderspinner();
    spinner.showSearch();
    this.inputRef.blur();
  }

  async onInputKeydown(event) {
    if (event.key !== 'Enter') return;
    const searchQuery = event.target.value.trim();
    if (searchQuery) {
      await this.searchFilmByInputValue(searchQuery);
    } else {
      await this.renderMarkupAtHomePage();
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
    spinner.hideSearch();
    spinner.renderHeaderLoader();
    await this.searchFilmByInputValue(searchQuery);
    spinner.deleteHeaderspinner();
    spinner.showSearch();
    this.inputRef.blur();
  }

  onInputChange(event) {
    if (event) {
      this.iconSearchRef.classList.remove('header-serch__icon--disabled');
    }
  }

  async renderMarkupAtLibraryPage(tab) {
    let movies =
      tab === 'watched'
        ? watchedStorage.getStorageList()
        : queueStorage.getStorageList();
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
    const cardsMarkup = new createCardsMarkup(movies, page, libraryTab);
    const moviesCards = cardsMarkup.createCard(page);
    this.mainRef.innerHTML = moviesCards;
  }
  getFilmsForRequestId(event) {
    const currentActiveBtn = document.querySelector('.common-btn__request--active');
    if (event.target === currentActiveBtn) return
    if (currentActiveBtn) {
      currentActiveBtn.classList.remove('common-btn__request--active');
    }
    
    event.target.classList.add('common-btn__request--active');
    
    const requestName = event.target.getAttribute('id');
    this.renderMoviesForRequest(requestName)
  }
  renderMoviesForRequest(request) {
    this.movies.filmsOn = request;
      this.renderMarkupAtHomePage();
  }
}

export const movieService = new MovieService();
