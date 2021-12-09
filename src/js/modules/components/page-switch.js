import { movieService } from './movie-service';

class Header {
  constructor() {
    this.headerRef = document.querySelector('.header');
    this.centerDivRef = this.headerRef.querySelector('.header-center');
    this.navRef = this.headerRef.querySelector('.header-nav');
    this.navRef.addEventListener('click', event => this.onPageBtnClick(event));
    this.centerDivRef.addEventListener('click', event =>
      this.onLibraryTabClick(event),
    );
    this.currentPage = 'home';
    this.currentLibraryTab = 'watched';
  }
  onPageBtnClick(event) {
    event.preventDefault();
    const page = event.target.getAttribute('data-page');
    if (page && this.currentPage != page) {
      const activePage = this.navRef.querySelector('.header-nav__link--active');
      activePage.classList.remove('header-nav__link--active');
      event.target.classList.add('header-nav__link--active');
      this.currentPage = page;
      this.updateHeader();
    }
  }
  updateHeader() {
    this.headerRef.classList.remove('header--library');
    this.removeBtns();
    if (this.currentPage === 'library') {
      this.headerRef.classList.add('header--library');
      this.renderBtns();
    }

    movieService.renderPage(this.currentPage, this.currentLibraryTab);
  }

  renderBtns() {
    this.centerDivRef.insertAdjacentHTML(
      'beforeend',
      ` <div class="header-center__wrapper">
            <button data-tab="watched" class="common-btn ${
              this.currentLibraryTab === 'watched'
                ? 'common-btn--active-header'
                : ''
            }">Watched</button>
            <button data-tab="queue" class="common-btn ${
              this.currentLibraryTab === 'queue'
                ? 'common-btn--active-header'
                : ''
            }">Queue</button>
        </div>`,
    );
  }
  removeBtns() {
    const btnWrapper = this.centerDivRef.querySelector(
      '.header-center__wrapper',
    );
    if (btnWrapper) {
      btnWrapper.remove();
    }
  }
  onLibraryTabClick(event) {
    event.preventDefault();
    const tab = event.target.getAttribute('data-tab');
    if (tab && this.currentLibraryTab != tab) {
      this.currentLibraryTab = tab;
      this.updateHeader();
    }
  }
}
export const header = new Header();
