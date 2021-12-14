import { langObj } from "./list-lang";
const select = document.querySelector('select');
select.addEventListener('change', setLngToLocalStor);
function setLngToLocalStor() {
    let lang = select.value;
    localStorage.setItem("currentLng", lang);
    location.reload();
}

export function changeLanguage() {
    let hash = localStorage.getItem("currentLng");
    select.value = hash;
    let lang;
    switch (select.value) {
        case 'ru': 
            lang = 'ru-RU'
            break;
        case 'en': 
            lang = 'en-EN'
            break;
        case 'ua': 
            lang = 'uk-UA'
            break;
    
        default:
            lang = 'en-EN';
            break;
    }

    for (let key in langObj) {
        let elem = document.querySelector('.lng-' + key);
        if (elem) {
            elem.innerHTML = langObj[key][hash];
        }
    }
    return lang;
}
changeLanguage()