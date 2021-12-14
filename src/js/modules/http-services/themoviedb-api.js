import axios from 'axios';
import { notiflix } from '../../vendors/notification';
import { changeLanguage } from "../components/change-lang"; 

export class ThemoviedbApi {
  constructor() {
    this.API_KEY = 'f979c5d182d240e48ce15515a9f4d973';
    this.keyword = '';
    this.page = 1;
    axios.defaults.baseURL = 'https://api.themoviedb.org/';
    this.trends = 'popular';
    this.lang = `${this.getCurrentClientLang()}`;
  }
  async getMovies() {
    try {
      const response = await axios.get(
        `/3/movie/${this.trends}?api_key=${this.API_KEY}&language=${this.lang}&page=${this.page}&region=UA`,
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  get filmsOn() {
    return this.trends;
  }
  set filmsOn(newTrends) {
    this.trends = newTrends;
  }

  get search() {
    return this.keyword;
  }
  set search(newKeyword) {
    this.keyword = newKeyword;
  }
  async getMoviesByKeyword() {
    try {
      const response = await axios.get(
        `/3/search/movie?api_key=${this.API_KEY}&query=${this.keyword}&language=en-US&page=${this.page}`,
      );
      const data = await response.data;
      return data;
    } catch (error) {
      const errorStatus = error.response.status;
      const message = error.response.data.status_message;
      notiflix.errorNotification(errorStatus, message);
    }
  }
  async getMovieById(id) {
    try {
      const response = await axios.get(
        `/3/movie/${id}?api_key=${this.API_KEY}&append_to_response=videos&language=${this.lang}`,
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  async getMoviesGenresList() {
    try {
      const response = await axios.get(
        `3/genre/movie/list?api_key=${this.API_KEY}&language=${this.lang}`,
      );
      const data = await response.data;
      return data.genres;
    } catch (error) {
      console.log(error);
    }
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get currentPage() {
    return this.page;
  }
  set currentPage(newPage) {
    this.page = newPage;
  }

  getCurrentClientLang() {
    const localLang = changeLanguage();

    if (localLang === null) {
      this.lang = 'en-EN';
    } else {
      this.lang = localLang;
    }
    return this.lang;
  }
}
