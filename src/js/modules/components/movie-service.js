import { createCardsMarkup } from '../templates/render-one-card';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { watchedStorage, queueStorage } from './library-storage';
import Loader from '../../vendors/_icon8';
import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';

const spiner = new Loader();

class MovieService {
  constructor() {
    this.mainRef = document.querySelector('.card-list');
    this.movies = new ThemoviedbApi();
    this.container = document.getElementById('pagination');
    this.iconSearchRef = document.querySelector('.header-serch__icon');
    this.iconSearchRef = document.addEventListener('click', event =>
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

    const inputRef = document.querySelector('.header-serch__input');
    inputRef.addEventListener('keydown', event => {
      this.onInputKeydown(event);
    });
  }
  renderPage(page, libraryTab) {
    if (page === 'home') {
      this.renderMarkupAtHomePage();
    } else if (page === 'library') {
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
        await this.movies.getMovies().then(({ results }) => {
          this.renderMovies(results, 'main');
        });
      });
      pagin.movePageTo(this.movies.currentPage);
    });
  }
  async searchFilmByInputValue(searchQuery) {
    this.movies.search = searchQuery;
    await this.movies
      .getMoviesByKeyword()
      .then(({ results, total_results }) => {
        if (total_results <= this.options.itemsPerPage) {
          this.container.classList.add('visually-hidden');
        } else if (this.container.classList.contains('visually-hidden')) {
          this.container.classList.remove('visually-hidden');
        }
        this.renderMovies(results, 'main');
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
    const watchedMarkup = new createCardsMarkup(movies, page, libraryTab);
    const moviesCards = await watchedMarkup.createCard();
    this.mainRef.innerHTML = moviesCards;
  }
}

export const movieService = new MovieService();
