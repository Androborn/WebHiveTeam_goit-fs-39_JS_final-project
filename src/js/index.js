// import z from './modules/templates/set-card-markup.js';
import { createCardsMarkup } from './modules/templates/render-one-card'
import { Header } from './modules/components/page-switch.js';
import { ThemoviedbApi } from '/js/modules/http-services/themoviedb-api.js';
import { LibraryStorage } from './modules/components/library-storage.js';

import Loader from '/js/vendors/_icon8.js';

const header = new Header();
// Add a cards markup to the main page
const mainRef = document.querySelector('.cards-list');
const movies = new ThemoviedbApi()
movies.getMovies().then(({ results }) => {
    const moviesCardMarkup = new createCardsMarkup(results, 'main')
    const moviesCards = moviesCardMarkup.createCard();
    mainRef.insertAdjacentHTML('beforeend', moviesCards)
}).catch(console.log)
//========================================

