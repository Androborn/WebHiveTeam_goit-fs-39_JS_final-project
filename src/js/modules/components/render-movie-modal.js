import * as basicLightbox from 'basiclightbox';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { modalMarkup } from '../templates/modal-markup';
import { trailerMarkup } from '../templates/trailer-markup';
import { queueStorage, watchedStorage } from './library-storage';
import { movieService } from './movie-service';
import { header } from './page-switch';
import Loader from '../../vendors/_icon8';
let spinner = new Loader();

class RenderModal {
  constructor() {
    this.instance = null;
    this.trailer = null;
    this.cardContainerRef = document.querySelector('.card-list');
    this.themoviedbApi = new ThemoviedbApi();
    this.cardContainerRef.addEventListener('click', async evt => {
      spinner.renderModalLoader();
      await this.onModalOpenClick(evt);
      spinner.deleteModalspinner();
    });
    this.currentLng = localStorage.getItem('currentLng');
  }

  async onModalOpenClick(evt) {
    evt.preventDefault();

    this.instance = basicLightbox.create(`<div></div>`, {
      onShow: instance => {
        instance
          .element()
          .querySelector('.close-btn--movie-card-modal').onclick =
          instance.close;
      },
      onClose: () => {
        setTimeout(() => {
          document.body.style.overflow = '';
        }, 300);
      },
    });

    const cardsList = evt.target.parentNode;
    this.cardsListId = cardsList.id;
    const iscardsList = cardsList.classList.contains('card-list__item');
    this.movieAddedtoWatched = watchedStorage.hasId(this.cardsListId);
    this.movieAddedtoQueue = queueStorage.hasId(this.cardsListId);

    if (!iscardsList) {
      return;
    }

    this.currentMovie = await this.themoviedbApi.getMovieById(this.cardsListId);
    const genre = this.currentMovie.genres.map(id => id.name);
    const genreIds = Object.values(genre).join(', ');

    this.instance.element().innerHTML = modalMarkup(
      this.currentMovie,
      genreIds,
      this.cardsListId,
      this.movieAddedtoWatched,
      this.movieAddedtoQueue,
    );

    this.btnWatched = this.instance
      .element()
      .querySelector('[data-action="add-to-watched"]');

    this.btnWatched.addEventListener('click', event =>
      this.onBtnWatchedClick(event),
    );

    this.btnQueue = this.instance
      .element()
      .querySelector('[data-action="add-to-queue"]');

    this.btnQueue.addEventListener('click', event =>
      this.onBtnQueueClick(event),
    );

    this.instance.show();
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', evt => this.onEscModalClose(evt), {
      once: true,
    });

    this.trailerRef = document.querySelector('.trailer');

    if (this.currentMovie.videos.results.length === 0) {
      return;
    }

    this.trailerRef.addEventListener('click', async evt =>
      this.openTrailer(evt),
    );
  }
  onBtnWatchedClick() {
    this.btnWatched.classList.add('common-btn__movie-modal--active');
    if (this.movieAddedtoWatched !== true) {
      watchedStorage.addToStorage({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      let btnWatchedRemove;
      switch (this.currentLng) {
        case 'ru':
          btnWatchedRemove = 'Удалить из просмотренных';
          break;
        case 'en':
          btnWatchedRemove = 'Remove from Watched';
          break;
        case 'ua':
          btnWatchedRemove = 'Видалити з переглянутих';
          break;
        default:
          btnWatchedRemove = 'Remove from Watched';
          break;
      }
      this.btnWatched.textContent = btnWatchedRemove;
      this.btnWatched.blur();
    } else {
      watchedStorage.removeFromStorageById(this.cardsListId);
      this.btnWatched.classList.remove('common-btn__movie-modal--active');
      let btnWatchedAdd;
      switch (this.currentLng) {
        case 'ru':
          btnWatchedAdd = 'Добавить в просмотренные';
          break;
        case 'en':
          btnWatchedAdd = 'Add to Watched';
          break;
        case 'ua':
          btnWatchedAdd = 'Додати в переглянуті';
          break;
        default:
          btnWatchedAdd = 'Add to Watched';
          break;
      }
      this.btnWatched.textContent = btnWatchedAdd;
      this.btnWatched.blur();
    }
    this.movieAddedtoWatched = watchedStorage.hasId(this.cardsListId);
    if (
      header.currentPage === 'library' &&
      header.currentLibraryTab === 'watched'
    ) {
      movieService.renderMarkupAtLibraryPage('watched');
    }
  }

  onBtnQueueClick() {
    this.btnQueue.classList.add('common-btn__movie-modal--active');
    if (this.movieAddedtoQueue !== true) {
      queueStorage.addToStorage({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      let btnQueueRemove;
      switch (this.currentLng) {
        case 'ru':
          btnQueueRemove = 'Удалить из очереди';
          break;
        case 'en':
          btnQueueRemove = 'Remove from Queue';
          break;
        case 'ua':
          btnQueueRemove = 'Видалити з черги';
          break;
        default:
          btnQueueRemove = 'Remove from Queue';
          break;
      }
      this.btnQueue.textContent = btnQueueRemove;

      this.btnQueue.blur();
    } else {
      queueStorage.removeFromStorageById(this.cardsListId);
      this.btnQueue.classList.remove('common-btn__movie-modal--active');
      let btnQueueAdd = '';
      switch (this.currentLng) {
        case 'ru':
          btnQueueAdd = 'Добавить в очередь';
          break;
        case 'en':
          btnQueueAdd = 'Add to Queue';
          break;
        case 'ua':
          btnQueueAdd = 'Додати в чергу';
          break;
        default:
          btnQueueAdd = 'Add to Queue';
          break;
      }
      this.btnQueue.textContent = btnQueueAdd;
      this.btnQueue.blur();
    }
    this.movieAddedtoQueue = queueStorage.hasId(this.cardsListId);
    if (
      header.currentPage === 'library' &&
      header.currentLibraryTab === 'queue'
    ) {
      movieService.renderMarkupAtLibraryPage('queue');
    }
  }

  onEscModalClose(evt) {
    if (evt.code === 'Escape') {
      this.instance.close();
    }
  }

  openTrailer(evt) {
    if (evt.currentTarget !== this.trailerRef) {
      return;
    }
    this.trailer = basicLightbox.create(trailerMarkup(this.currentMovie));
    this.trailer.show();
    document.body.addEventListener(
      'keydown',
      evt => this.onEscTrailerClose(evt),
      {
        once: true,
      },
    );
  }

  onEscTrailerClose(evt) {
    if (evt.code === 'Escape') {
      this.trailer.close();
      evt.stopPropagation();
    }
  }
}

export const modal = new RenderModal();
