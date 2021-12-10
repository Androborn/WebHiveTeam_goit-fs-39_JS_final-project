import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class Notification {
    constructor() {
        this.optionsLib = {
            width: '40%',
            position: 'center-center',
        };
    }

    searchResult(data) {
        if (data === 0) {
            return Notify.failure('Search result not successful. Enter the correct movie name', this.optionsLib)
        } return Notify.success(`We found ${data} results`, this.optionsLib);
    }

    errorNotification(err, messege) {
        if (err.toString()[0] === '4') {
            return Notify.failure(`${messege}`, this.optionsLib)
        }
    }
}
