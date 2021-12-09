import { ThemoviedbApi } from '../http-services/themoviedb-api';
import { modalMarkup } from '../templates/modal-markup';
import { LibraryStorage } from './library-storage';
import Loader from '../../vendors/_icon8';
let spiner = new Loader();
export class RenderModal {
  constructor() {
    this.instance = null;
    this.cardContainerRef = document.querySelector('.cards-list');
    this.themoviedbApi = new ThemoviedbApi();
    this.cardContainerRef.addEventListener('click', async evt => {
      spiner.renderModalLoader();
      await this.onModalOpenClick(evt);
      spiner.deleteModalSpiner();
    });
    this.watchedStorage = new LibraryStorage('watched');
    this.queueStorage = new LibraryStorage('queue');
  }

  async onModalOpenClick(evt) {
    evt.preventDefault();

    this.instance = basicLightbox.create(`<div></div>`);
    const cardsList = evt.target.parentNode;
    this.cardsListId = cardsList.id;
    const iscardsList = cardsList.classList.contains('cards-list__item');

    if (!iscardsList) {
      return;
    }

    const data = await this.themoviedbApi.getMovieById(this.cardsListId);
    const genre = data.genres.map(id => id.name);
    const genreIds = Object.values(genre).join(', ');

    this.instance.element().innerHTML = modalMarkup(
      data,
      genreIds,
      this.cardsListId,
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

  onEscModalClose(evt) {
    if (evt.code === 'Escape') {
      this.instance.close();
    }
  }

  onBtnWatchedClick() {
    this.watchedStorage.addToStorage(this.cardsListId);
    this.btnWatched.textContent = 'Remove from Watched';
    this.btnWatched.disabled = true;
  }

  onBtnQueueClick() {
    this.queueStorage.addToStorage(this.cardsListId);
    this.btnQueue.textContent = 'Remove from Queue';
    this.btnQueue.disabled = true;
  }
}
