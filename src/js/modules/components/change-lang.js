import { langObj } from "./list-lang";
const select = document.querySelector('select');
const allLang = ['ua', 'ru', 'en'];
select.addEventListener('change', changeURLLanguage);
function changeURLLanguage() {
    let lang = select.value;
    location.href = `window.location.pathname${'#'}${lang}`;
    location.reload();
}

export function changeLanguage() {
    let hash = window.location.hash;
    hash = hash.substring(1)
    if (!allLang.includes(hash)) {
        location.href = `window.location.pathname${'#en'}`
    }
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