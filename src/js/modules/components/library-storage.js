export class LibraryStorage {
  constructor(key) {
    this.key = key;
  }
  get libraryKey() {
    return this.key;
  }
  set libraryKey(newKey) {
    this.key = newKey;
  }

  getStorageList() {
    const storageItem = localStorage.getItem(this.key);
    if (!storageItem) {
      return [];
    }
    return JSON.parse(storageItem);
  }
  addToStorage(movie) {
    const storage = this.getStorageList();
    if (storage.some(x => x.id == movie.id)) {
      return;
    }
    storage.unshift(movie);
    localStorage.setItem(this.key, JSON.stringify(storage));
  }
  removeFromStorageById(id) {
    const storage = this.getStorageList();
    const indexOfId = storage.findIndex(x => x.id == id);
    if (indexOfId === -1) return;
    storage.splice(indexOfId, 1);
    localStorage.setItem(this.key, JSON.stringify(storage));
  }
  refreshLocalStorage() {
    let storage = this.getStorageList();
    storage = [];
    localStorage.setItem(this.key, JSON.stringify(storage));
  }

  hasId(id) {
    const storage = this.getStorageList();
    return storage.some(x => x.id == id);
  }
}
export const watchedStorage = new LibraryStorage('watchedMovies');
export const queueStorage = new LibraryStorage('queueMovies');
