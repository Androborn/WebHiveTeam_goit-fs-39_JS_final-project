import { refs } from './refs';
const { aboutDev, teamModalBtnClose, backdrop } = refs;
aboutDev.addEventListener('click', openTeamModal);
teamModalBtnClose.addEventListener('click', closeTeamModal);
window.addEventListener('click', closeTeamModal);
window.addEventListener('keydown', closeTeamModal);

function openTeamModal() {
  backdrop.classList.remove('is-hidden');
}

function closeTeamModal(ev) {
  if (
    ev.target === backdrop ||
    ev.keyCode === 27 ||
    ev.target === teamModalBtnClose
  ) {
    backdrop.classList.add('is-hidden');
  }
}
