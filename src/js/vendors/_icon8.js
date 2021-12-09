export default class Loader {
  constructor() {
    this.serch = document.querySelector(`.header-serch__icon`);
    this.input = document.querySelector(`.header-serch__input`);
    this.wrapper = document.querySelector(`.header-serch__wrapper`);
    this.body = document.querySelector('body');
    this.spiner = '';
    // hidden && this.hideBtn();
    // loading && this.disableLoadState();
  }
  renderHeaderLoader() {
    this.wrapper.insertAdjacentHTML(
      'beforeend',
      `      <div id="floatingCirclesG" class="header__spiner">
  <div class="f_circleG" id="frotateG_01"></div>
  <div class="f_circleG" id="frotateG_02"></div>
  <div class="f_circleG" id="frotateG_03"></div>
  <div class="f_circleG" id="frotateG_04"></div>
  <div class="f_circleG" id="frotateG_05"></div>
  <div class="f_circleG" id="frotateG_06"></div>
  <div class="f_circleG" id="frotateG_07"></div>
  <div class="f_circleG" id="frotateG_08"></div>
</div>`,
    );
    this.spiner = document.querySelector('.header__spiner');
  }
  renderModalLoader() {
    this.body.insertAdjacentHTML(
      'afterbegin',
      `      <div class="backdrop">
      <div id="floatingCirclesModal" class="modal__loader">
	<div class="f_circleModal" id="frotateModal_01"></div>
	<div class="f_circleModal" id="frotateModal_02"></div>
	<div class="f_circleModal" id="frotateModal_03"></div>
	<div class="f_circleModal" id="frotateModal_04"></div>
	<div class="f_circleModal" id="frotateModal_05"></div>
	<div class="f_circleModal" id="frotateModal_06"></div>
	<div class="f_circleModal" id="frotateModal_07"></div>
	<div class="f_circleModal" id="frotateModal_08"></div>
</div></div>`,
    );
    this.spiner = document.querySelector('.backdrop');
  }
  deleteModalSpiner() {
    document.querySelector('.backdrop').remove();
  }
  deleteHeaderSpiner() {
    document.querySelector('.header__spiner').remove();
  }
  showSearch() {
    this.serch.classList.remove('visually-hidden');
  }
  hideSearch() {
    this.serch.classList.add('visually-hidden');
  }
}
