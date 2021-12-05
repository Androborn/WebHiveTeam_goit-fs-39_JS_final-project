import { ThemoviedbApi } from '../http-services/themoviedb-api';
import * as basicLightbox from 'basiclightbox';
import 'basicLightbox/dist/basicLightbox.min.css';

export class RenderModal {
  constructor() {
    this.instance = null;
    this.cardContainerRef = document.querySelector('.main-container');
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
    <div class="modal__item">
      <img
        src="https://image.tmdb.org/t/p/w500${data.poster_path}"
        width="120"
        alt="tags"
        loading="lazy"
        class="modal__image"
      />
      <div class="modal_info">
      <H1 class="modal_info-value">${data.original_title.toUpperCase()}</H1>
        <p class="modal_info-item">
          vote_average<span class="modal_info-value">${data.vote_average}</span>
        </p>
        <p class="modal_info-item">
          vote_count<span class="modal_info-value">${data.vote_count}</span>
        </p>
        <p class="modal_info-item">
          popularity<span class="modal_info-value">${data.popularity.toFixed(
            1,
          )}</span>
        </p>
        <p class="modal_info-item">
          original_title
          ><span class="modal_info-value">${data.original_title.toUpperCase()}</span>
        </p>
        <p class="modal_info-item">
          genre_ids<span class="modal_info-value">${genreIds}</span>
        </p>
        <p class="modal_info-item">
          About<span class="modal_info-value">${data.overview}</span>
        </p>
      </div>
    </div>
    <a>Close</a>`;

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

const renderModal = new RenderModal();
