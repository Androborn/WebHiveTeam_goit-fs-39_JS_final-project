import { Notify } from 'notiflix/build/notiflix-notify-aio';

class Notification {
    constructor() {
        this.optionsLib = {
            width: '280px',
            position: 'center-top',
        };
    }
    searchResult(data) {
        if (data === 0) {
            return Notify.failure('Search result not successful. Enter the correct movie name', this.optionsLib)
        } return Notify.success(`We found ${data} results`, this.optionsLib);
    }
}
export const notiflix = new Notification()