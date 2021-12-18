import sorryPosterImage from '../../../images/home/sorry-poster.jpg';

export function modalMarkup(
  data,
  genreIds,
  cardsListId,
  movieAddedtoWatched,
  movieAddedtoQueue,
) {
  const currentLng = localStorage.getItem('currentLng');
  let addToWatched;
  let removeFromWatched;
  let addToQueue;
  let removeFromQueue;
  let noGenre;
  let noTrailer;
  let noInformation;
  let watchTrailer;
  let vote;
  let votes;
  let popularity;
  let title;
  let genre;
  let trailer;
  let about;
  switch (currentLng) {
    case 'ru':
      about = 'О фильме';
      trailer = 'Трейлер';
      genre = 'Жанр';
      title = 'Оригинальное название';
      noGenre = 'Жанр отсутствует';
      noTrailer = 'Трейлер отсутствует';
      noInformation = 'Информация отсутствует';
      watchTrailer = 'Смотреть трейлер';
      vote = 'Рейтинг';
      votes = 'Голосование';
      popularity = 'Популярность';
      addToWatched = 'Добавить в просмотренные';
      removeFromWatched = 'Удалить из просмотренных';
      addToQueue = 'Добавить в очередь';
      removeFromQueue = 'Удалить из очереди';
      break;
    case 'en':
      about = 'ABOUT';
      trailer = 'Trailer';
      genre = 'Genre';
      title = 'Original title';
      noGenre = 'Жанр отсутствует';
      noTrailer = 'No trailer';
      noInformation = 'No Information';
      watchTrailer = 'Watch trailer';
      vote = 'Vote';
      votes = 'Votes';
      popularity = 'Popularity';
      addToWatched = 'Add to watched';
      removeFromWatched = 'Remove from Watched';
      addToQueue = 'Add to queue';
      removeFromQueue = 'Remove from Queue';
      break;
    case 'ua':
      about = 'Про фільм';
      trailer = 'Трейлер';
      genre = 'Жанр';
      title = 'Оригінальна назва';
      noGenre = 'Жанр відсутній';
      noTrailer = 'Трейлер відсутній';
      noInformation = 'Інформація відсутня';
      watchTrailer = 'Дивитись трейлер';
      vote = 'Рейтинг';
      votes = 'Голосування';
      popularity = 'Популярнiсть';
      addToWatched = 'Додати в переглянутi';
      removeFromWatched = 'Видалити з переглянутих';
      addToQueue = 'Додати в чергу';
      removeFromQueue = 'Видалити з черги';
      break;
    default:
      about = 'ABOUT';
      trailer = 'Trailer';
      genre = 'Genre';
      title = 'Original title';
      noGenre = 'No genre';
      noTrailer = 'No trailer';
      noInformation = 'No information';
      watchTrailer = 'Watch trailer';
      vote = 'Vote';
      votes = 'Votes';
      popularity = 'Popularity';
      addToWatched = 'Add to watched';
      removeFromWatched = 'Remove from Watched';
      addToQueue = 'Add to queue';
      removeFromQueue = 'Remove from Queue';
      break;
  }
  return `
    <div class="modal">
      <div class="modal__wraper"><div class="modal__image-wraper">
        <img
        src=${
          data.poster_path === null
            ? sorryPosterImage
            : `https://image.tmdb.org/t/p/w500${data.poster_path}`
        }
        />
      </div>
      <div class="modal__info-container"><div class="modal__info">
        <h1 class="modal__info-title">${data.title.toUpperCase()}</h1>
        <div class="modal__info-wraper">
          <div class="modal__info-item-wraper">
            <span class="modal__info-item" >
              ${vote} <span class="modal__info-slash"> / </span>
              <span class="modal__info-item" > ${votes} </span></span
            >
            <span class="modal__info-value modal__info-value--hight">
              <span class="modal__info-value  modal__info-value--border">${
                data.vote_average
              }</span>
              <span class="modal__info-slash"> / </span><span class="modal__info-value--transparent">${
                data.vote_count
              }</span></span
            >
          </div>
          <div class="modal__info-item-wraper">
            <span class="modal__info-item" > ${popularity} </span>
            <span class="modal__info-value modal__info-value--hight">${data.popularity.toFixed(
              1,
            )}</span>
          </div>
          <div class="modal__info-item-wraper">
            <span class="modal__info-item" > ${title} </span>
            <span class="modal__info-value">
              ${data.title.toUpperCase()}</span></div>
          <div class="modal__info-item-wraper">
            <span class="modal__info-item" > ${genre} </span
            ><span class="modal__info-value" >${
              genreIds ? genreIds : noGenre
            }</span>
          </div><div class="modal__info-item-wraper">
  <span class="modal__info-item" > ${trailer} </span>
  ${
    data.videos.results.length === 0
      ? `<span class="modal__info-value"> ${noTrailer}</span>`
      : `<span class="modal__info-value trailer"><span>${watchTrailer}</span><img class="trailer__img" src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube"></span>`
  }
</div>
        </div>
        <div class="modal__info-about-wraper">
          <p class="modal__info-about" >
            ${about.toLocaleUpperCase()}<span class="modal__info-value modal__info-value--descrip" >${
    data.overview ? data.overview : noInformation
  }</span>
          </p>
        </div><span class="close-btn close-btn--movie-card-modal"></span>
      </div><div class="modal__btn-wraper">
          <button
            class="common-btn common-btn__movie-modal ${
              movieAddedtoWatched === true
                ? 'common-btn__movie-modal--active'
                : ''
            }"
            data-action="add-to-watched"
            data-id="${cardsListId}"
          >
           ${
             movieAddedtoWatched === true ? removeFromWatched : addToWatched
           }</button
          ><button
            class="common-btn common-btn__movie-modal ${
              movieAddedtoQueue === true
                ? 'common-btn__movie-modal--active'
                : ''
            }"
            data-action="add-to-queue"
            data-id="${cardsListId}"
          >
          ${movieAddedtoQueue === true ? removeFromQueue : addToQueue}
          </button>
        </div>
    <div class="modal__background">
        <img class="modal__background-img"
            src=${
              data.backdrop_path === null
                ? ''
                : `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            }
            alt="${data.title}" />
            </div>
    </div></div>
    </div>
    `;
}
