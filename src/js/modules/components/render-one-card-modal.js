import { ThemoviedbApi } from '../http-services/themoviedb-api';
import * as basicLightbox from 'basiclightbox';
// import 'basicLightbox/dist/basicLightbox.min.css';

export class RenderModal {
  constructor() {
    this.instance = null;
    this.cardContainerRef = document.querySelector('.cards-list');
    this.themoviedbApi = new ThemoviedbApi();
    this.cardContainerRef.addEventListener('click', evt =>
      this.onModalOpenClick(evt),
    );
  }

  async onModalOpenClick(evt) {
    evt.preventDefault();

    this.instance = basicLightbox.create(`<div></div>`);
    const cardsList = evt.target.parentNode;
    const cardsListId = cardsList.id;
    const iscardsList = cardsList.classList.contains('cards-list__item');

    if (!iscardsList) {
      return;
    }
    console.log(cardsList);
    console.log(cardsListId);

    const data = await this.themoviedbApi.getMovieById(cardsListId);
    const genre = data.genres.map(id => id.name);
    const genreIds = Object.values(genre).join(', ');

    this.instance.element().innerHTML = `
    <div class="modal">
      <img
        src="https://image.tmdb.org/t/p/w500${data.poster_path}"
        alt="tags"
        loading="lazy"
        class="modal__image"
      />
      <div class="modal__info">
      <H1 class="modal__info-title">${data.original_title.toUpperCase()}</H1>
        <div class ="modal__info-wraper"><p class="modal__info-item">
          Vote<span class="modal__info-value">${data.vote_average}</span>
        </p>
        <p class="modal__info-item">
          Votes<span class="modal__info-value">${data.vote_count}</span>
        </p>
        <p class="modal__info-item">
          Popularity<span class="modal__info-value">${data.popularity.toFixed(
            1,
          )}</span>
        </p>
        <p class="modal__info-item">
          Original Title
          <span class="modal__info-value">${data.original_title.toUpperCase()}</span>
        </p>
        <p class="modal__info-item">
          Genre<span class="modal__info-value">${genreIds}</span>
        </p></div>
        <p class="modal__info-about">
          ABOUT<span class="modal__info-value">${data.overview}</span>
        </p>
      </div>
      <button
  class="common-btn common-btn--active btn-watched"
  data-action="add-to-watched"
  data-id="${cardsListId}"
>ADD TO WATCHED</button><button class="common-btn btn-queue" 
data-action="add-to-queue" 
data-id="${cardsListId}">
  ADD TO QUEUE
</button>
    </div>
    `;

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
}
