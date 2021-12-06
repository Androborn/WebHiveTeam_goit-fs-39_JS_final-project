import { ThemoviedbApi } from '../http-services/themoviedb-api';
import * as basicLightbox from 'basiclightbox';
import 'basicLightbox/dist/basicLightbox.min.css';

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
        class="modal_image"
      />
      <div class="modal_info">
      <H1 class="modal_info-title">${data.original_title.toUpperCase()}</H1>
        <div class ="modal_info-wraper"><p class="modal_info-item">
          Vote<span class="modal_info-value">${data.vote_average}</span>
        </p>
        <p class="modal_info-item">
          Votes<span class="modal_info-value">${data.vote_count}</span>
        </p>
        <p class="modal_info-item">
          Popularity<span class="modal_info-value">${data.popularity.toFixed(
            1,
          )}</span>
        </p>
        <p class="modal_info-item">
          Original Title
          <span class="modal_info-value">${data.original_title.toUpperCase()}</span>
        </p>
        <p class="modal_info-item">
          Genre<span class="modal_info-value">${genreIds}</span>
        </p></div>
        <p class="modal_info-about">
          ABOUT<span class="modal_info-value">${data.overview}</span>
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

const renderModal = new RenderModal();

{
  /* <button
  class="common-btn common-btn--active btn-watched"
  data-action="add-to-watched"
  data-id="617653"
>
  ADD TO WATCHED
</button>;

<button class="common-btn btn-queue" 
data-action="add-to-queue" 
data-id="617653">
  ADD TO QUEUE
</button>; */
}

{
  /* <button class="modal_btn-close">
  <svg
    class="modal_btn-icon"
    style="fill:red; stroke:blue;"
    width="14"
    height="14"
  >
    <use href="../../../images/sprite.svg#icon-close"></use>
  </svg>
</button>; */
}
