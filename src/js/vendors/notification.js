import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class Notification {
    constructor() {
        this.optionsLib = {
            width: '40%',
            position: 'center-center',
            failure: {
                background: '#FF6B08',
            }
        };
    }

    callNotiflix(data) {
        if (data === undefined) {
            return Notify.failure('Search result not successful. Enter the correct movie name', this.optionsLib)
        }
    }
}

