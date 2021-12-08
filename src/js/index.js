import { Header } from './modules/components/page-switch';
import { MovieService } from './modules/components/movie-service';

// import Loader from './vendors/_icon8';

const movieService = new MovieService();
const header = new Header();
header.onPageChange = (page, tab) => movieService.renderPage(page, tab);

movieService.renderMarkupAtHomePage();
