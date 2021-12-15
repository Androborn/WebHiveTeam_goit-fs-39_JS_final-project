import Firebase from '../../vendors/_firebase';
const firebase = new Firebase();
(() => {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
    body: document.querySelector('body'),
    btns: document.querySelectorAll('.btn'),
  };

  refs.openModalBtn.addEventListener('click', e => {
    refs.modal.classList.toggle('is-hidden');
    refs.body.classList.toggle('overflow');
    firebase.registerAndLogin();
  });
  refs.closeModalBtn.addEventListener('click', e => {
    refs.modal.classList.toggle('is-hidden');
    refs.body.classList.toggle('overflow');
  });
  refs.btns[0].addEventListener('click', e => {
    console.log(document.querySelector('.form-signin'));
    document.querySelector('.form-signin').classList.toggle('form-signin-left');
    document.querySelector('.form-signup').classList.toggle('form-signup-left');
    document.querySelector('.frame').classList.toggle('frame-long');
    document
      .querySelector('.signup-inactive')
      .classList.toggle('signup-active');
    document
      .querySelector('.signin-active')
      .classList.toggle('signin-inactive');
  });
  refs.btns[1].addEventListener('click', e => {
    document.querySelector('.form-signin').classList.toggle('form-signin-left');
    document.querySelector('.form-signup').classList.toggle('form-signup-left');
    document.querySelector('.frame').classList.toggle('frame-long');
    document
      .querySelector('.signup-inactive')
      .classList.toggle('signup-active');
    document
      .querySelector('.signin-active')
      .classList.toggle('signin-inactive');
  });
  function toggleModal() {}
})();
