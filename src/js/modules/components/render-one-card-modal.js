import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { modalMarkup } from '../templates/modal-markup';
import { queueStorage, watchedStorage } from './library-storage';
import { movieService } from './movie-service';
import { header } from './page-switch';
import Loader from '../../vendors/_icon8';
let spiner = new Loader();

class RenderModal {
  constructor() {
    this.instance = null;
    this.cardContainerRef = document.querySelector('.card-list');
    this.themoviedbApi = new ThemoviedbApi();
    this.cardContainerRef.addEventListener('click', async evt => {
      spiner.renderModalLoader();
      await this.onModalOpenClick(evt);
      spiner.deleteModalSpiner();
    });
  }

  async onModalOpenClick(evt) {
    evt.preventDefault();

    document.body.style.overflow = 'hidden';
    document.body.style.marginRight = '17px';

    this.instance = basicLightbox.create(`<div></div>`, {
      onShow: instance => {
        instance
          .element()
          .querySelector('.close-btn--movie-card-modal').onclick =
          instance.close;
      },
      onClose: () => {
        document.body.style.overflow = '';
        document.body.style.marginRight = '';
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
    console.log(this.movieAdded);

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
    document.addEventListener('keydown', evt => this.onEscModalClose(evt), {
      once: true,
    });
  }
  onBtnWatchedClick() {
    this.btnWatched.classList.add('modal__btn-watched--active');
    if (this.movieAddedtoWatched !== true) {
      watchedStorage.addToStorage({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      this.btnWatched.textContent = 'Remove from watched';
      this.btnWatched.blur();
    } else {
      watchedStorage.removeFromStorageById(this.cardsListId);
      this.btnWatched.classList.remove('modal__btn-watched--active');
      this.btnWatched.textContent = 'Add to watched';
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
    this.btnQueue.classList.add('modal__btn-queue--active');
    if (this.movieAddedtoQueue !== true) {
      queueStorage.addToStorage({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      this.btnQueue.textContent = 'Remove from queue';
      this.btnQueue.blur();
    } else {
      queueStorage.removeFromStorageById(this.cardsListId);
      this.btnQueue.classList.remove('modal__btn-queue--active');
      this.btnQueue.textContent = 'Add to queue';
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
}

export const modal = new RenderModal();
