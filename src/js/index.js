import { createCardsMarkup } from './modules/templates/render-one-card';
import { RenderModal } from './modules/components/render-one-card-modal';
import { Header } from './modules/components/page-switch';
import { ThemoviedbApi } from './modules/http-services/themoviedb-api';
import { LibraryStorage } from './modules/components/library-storage';
import 'basicLightbox/dist/basicLightbox.min.css';
import Loader from './vendors/_icon8';

const header = new Header();
// Add a cards markup to the main page
const mainRef = document.querySelector('.cards-list');
const movies = new ThemoviedbApi();
const modalWindow = new RenderModal();

movies
  .getMovies()
  .then(({ results }) => {
    const moviesCardMarkup = new createCardsMarkup(results, 'main');
    const moviesCards = moviesCardMarkup.createCard();
    mainRef.insertAdjacentHTML('beforeend', moviesCards);
  })
  .catch(console.log);
//========================================
// Add a cards markup for searched keyword
const inputRef = document.querySelector('.header-serch__input');
inputRef.addEventListener('input', searchFilms);
function searchFilms(event) {
  const keyword = event.currentTarget.value.trim();
  if (keyword === '') return;
  movies.search = keyword;
  inputRef.addEventListener('keydown', renderSearchedFilmsMarkup);
}
async function renderSearchedFilmsMarkup(event) {
  if (event.key === 'Enter') {
    await movies
      .getMoviesByKeyword()
      .then(({ results }) => {
        const moviesCardMarkup = new createCardsMarkup(results, 'main');
        const moviesCards = moviesCardMarkup.createCard();
        mainRef.innerHTML = moviesCards;
      })
      .catch(console.error);
    inputRef.removeEventListener('keydown', renderSearchedFilmsMarkup);
  }
}
//========================================
