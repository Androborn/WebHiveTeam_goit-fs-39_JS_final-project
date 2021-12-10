export class LibraryStorage {
  constructor(key) {
    this.key = key;
    this.storage = [];
  }
  get libraryKey() {
    return this.key;
  }
  set libraryKey(newKey) {
    this.key = newKey;
  }
  createStorage() {
    if (localStorage.getItem(this.key)) return
    localStorage.setItem(this.key, JSON.stringify(this.storage));
  }
  getStorageList() {
    const storageItem = localStorage.getItem(this.key);
    return JSON.parse(storageItem);
  }
  addToStorage(id) { 
    if (localStorage.getItem(this.key)) {
      this.storage = JSON.parse(localStorage.getItem(this.key))
    }
    this.storage.unshift(id);
    localStorage.setItem(this.key, JSON.stringify(this.storage));
  }
  removeFromStorage(id) {
    if (this.storage.includes(id) === false) return;
    const findId = this.storage.indexOf(id);
    this.storage.splice(findId, 1);
    localStorage.setItem(this.key, JSON.stringify(this.storage));
  }

  hasId(id) {
    return this.storage.includes(id);
  }
}
export const watchedStorage = new LibraryStorage('watched'); 
export const queueStorage = new LibraryStorage('queue');