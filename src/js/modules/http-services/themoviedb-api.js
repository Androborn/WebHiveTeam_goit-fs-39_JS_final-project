import axios from 'axios';

export class ThemoviedbApi {
  constructor() {
    this.API_KEY = 'f979c5d182d240e48ce15515a9f4d973';
    this.keyword = '';
    axios.defaults.baseURL = 'https://api.themoviedb.org/';
  }
  async getMovies() {
    try {
      const response = await axios.get(
        `/3/trending/all/day?api_key=${this.API_KEY}`,
      );
      const data = await response.data;
      return data; //{page: 1, results: Array(20), total_pages: 1000, total_results: 20000}
    } catch (error) {
      console.log(error);
    }
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
        `/3/search/movie?api_key=${this.API_KEY}&query=${this.keyword}`,
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
