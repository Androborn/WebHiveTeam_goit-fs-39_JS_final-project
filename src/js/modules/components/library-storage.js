
export class LibraryStorage {
    constructor(key) {
        this.key = key;
        this.storage = [];
        localStorage.setItem(this.key, JSON.stringify(this.storage))
    }
    get libraryKey() {
        return this.key;
    }
    set libraryKey(newKey) {
        this.key = newKey;
    }
    getStorageList() {
        const storageItem = localStorage.getItem(this.key);
        return JSON.parse(storageItem);
    }
    addToStorage(id) {
        this.storage.unshift(id);
        localStorage.setItem(this.key, JSON.stringify(this.storage));
    }
    removeFromStorage(id) {
        if (this.storage.includes(id) === false) return
        const findId = this.storage.indexOf(id);
        this.storage.splice(findId, 1)
        localStorage.setItem(this.key,  JSON.stringify(this.storage));
    }
}
