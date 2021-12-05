export default class Loader {
  constructor() {
    this.serch = document.querySelector(`.header-serch__icon`);
    this.input = document.querySelector(`.header-serch__input`);
    this.wrapper = document.querySelector(`.header-serch__wrapper`);
    this.spiner = '';
    // hidden && this.hideBtn();
    // loading && this.disableLoadState();
  }
  renderLoader() {
    this.wrapper.insertAdjacentHTML(
      'beforeend',
      `      <div id="floatingCirclesG" class="G">
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
    this.spiner = document.querySelector('.G');
  }
  deleteSpiner() {
    document.querySelector('.G').remove();
  }
  showSerch() {
    this.serch.classList.remove('visually-hidden');
  }
  hideSerch() {
    this.serch.classList.add('visually-hidden');
  }
}
