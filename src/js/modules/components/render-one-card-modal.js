import { ThemoviedbApi } from '../http-services/themoviedb-api';
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
    console.log(cardsList);
    console.log(this.cardsListId);

    const data = await this.themoviedbApi.getMovieById(this.cardsListId);
    const genre = data.genres.map(id => id.name);
    const genreIds = Object.values(genre).join(', ');

    this.instance.element().innerHTML = `
    <div class="modal">
      <div class="modal__wraper"><div class="modal__image-wraper">
        <img
          src="https://image.tmdb.org/t/p/w500${data.poster_path}"
          alt="tags"
          loading="lazy"
          class="modal__image"
        />
      </div>
      <div class="modal__info">
        <h1 class="modal__info-title">${data.original_title.toUpperCase()}</h1>
        <div class="modal__info-wraper">
          <div class="modal__info-item-wraper">
            <span class="modal__info-item">
              Vote <span class="modal__info-slash"> / </span>
              <span class="modal__info-item"> Votes </span></span
            >
            <span class="modal__info-value modal__info-value--hight">
              <span class="modal__info-value  modal__info-value--border">${
                data.vote_average
              }</span>
              <span class="modal__info-slash"> / </span>${data.vote_count}</span
            >
          </div>
          <div class="modal__info-item-wraper">
            <span class="modal__info-item"> Popularity </span>
            <span class="modal__info-value modal__info-value--hight">${data.popularity.toFixed(
              1,
            )}</span>
          </div>
          <div class="modal__info-item-wraper">
            <span class="modal__info-item"> Original Title </span>
            <span class="modal__info-value">
              ${data.original_title.toUpperCase()}</span></div>
          <div class="modal__info-item-wraper">
            <span class="modal__info-item"> Genre </span
            ><span class="modal__info-value">${genreIds}</span>
          </div>
        </div>
        <div class="modal__info-about-wraper">
          <p class="modal__info-about">
            ABOUT<span class="modal__info-value modal__info-value--hight">${
              data.overview
            }</span>
          </p>
        </div>
      </div><div class="modal__btn-wraper">
          <button
            class="common-btn common-btn--active modal__btn-watched"
            data-action="add-to-watched"
            data-id="${this.cardsListId}"
          >
            ADD TO WATCHED</button
          ><button
            class="common-btn modal__btn-queue"
            data-action="add-to-queue"
            data-id="${this.cardsListId}"
          >
            ADD TO QUEUE
          </button>
        </div></div>
    </div>
    `;

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

`<span class="list_text">
  <span class="list_text_vote">7.2</span>
  <span class="list_text_vote_count">/</span>
  4097
</span>;`;
