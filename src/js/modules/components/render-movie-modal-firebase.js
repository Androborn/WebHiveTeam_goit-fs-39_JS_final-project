import * as basicLightbox from 'basiclightbox';
import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { modalMarkup } from '../templates/modal-markup';
import { trailerMarkup } from '../templates/trailer-markup';
import { movieService } from './movie-service-firebase';
import { header } from './page-switch';
import Loader from '../../vendors/_icon8';
import Firebase from '../../vendors/_firebase';
let spiner = new Loader();
let firebase = new Firebase();
class RenderModal {
  constructor() {
    this.instance = null;
    this.trailer = null;
    this.cardContainerRef = document.querySelector('.card-list');
    this.themoviedbApi = new ThemoviedbApi();
    this.cardContainerRef.addEventListener('click', async evt => {
      if (firebase.auth.currentUser !== null) {
        spiner.renderModalLoader();
        await this.onModalOpenClick(evt);
        spiner.deleteModalspinner();
      } else {
        return;
      }
    });
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
    this.movieAddedtoWatched = await firebase.hasIdWatched(this.cardsListId);
    this.movieAddedtoQueue = await firebase.hasIdQueue(this.cardsListId);

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
  async onBtnWatchedClick() {
    this.btnWatched.classList.add('common-btn__movie-modal--active');
    if (this.movieAddedtoWatched !== true) {
      firebase.updeteWatched({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      this.btnWatched.textContent = 'Remove from watched';
      this.btnWatched.blur();
    } else {
      firebase.removeWatched({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      this.btnWatched.classList.remove('common-btn__movie-modal--active');
      this.btnWatched.textContent = 'Add to watched';
      this.btnWatched.blur();
    }

    this.movieAddedtoWatched = await firebase.hasIdWatched(this.cardsListId);
    if (
      header.currentPage === 'library' &&
      header.currentLibraryTab === 'watched'
    ) {
      await movieService.renderMarkupAtLibraryPage('watched');
    }
  }

  async onBtnQueueClick() {
    this.btnQueue.classList.add('common-btn__movie-modal--active');
    if (this.movieAddedtoQueue !== true) {
      firebase.updeteQueue({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      this.btnQueue.textContent = 'Remove from queue';
      this.btnQueue.blur();
    } else {
      firebase.removeQueue({
        ...this.currentMovie,
        genre_ids: this.currentMovie.genres.map(x => x.id),
      });
      this.btnQueue.classList.remove('common-btn__movie-modal--active');
      this.btnQueue.textContent = 'Add to queue';
      this.btnQueue.blur();
    }
    this.movieAddedtoQueue = await firebase.hasIdQueue(this.cardsListId);
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
    if (evt.target !== this.trailerRef) {
      return;
    }

    this.trailer = basicLightbox.create(trailerMarkup(this.currentMovie));

    this.trailer.show();
    document.addEventListener('keydown', evt => this.onEscTrailerClose(evt), {
      once: true,
    });
  }

  onEscTrailerClose(evt) {
    if (evt.code === 'Escape') {
      this.trailer.close();
    }
  }
}

export const modal = new RenderModal();
