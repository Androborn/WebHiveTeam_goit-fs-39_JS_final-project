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
  addToStorage(id) {
    const storage = this.getStorageList();
    storage.unshift(id);
    localStorage.setItem(this.key, JSON.stringify(storage));
  }
  removeFromStorage(id) {
    const storage = this.getStorageList();
    const indexOfId = storage.indexOf(id);
    if (indexOfId === -1) return;
    storage.splice(indexOfId, 1);
    localStorage.setItem(this.key, JSON.stringify(storage));
  }

  hasId(id) {
    const storage = this.getStorageList();
    return storage.includes(id);
  }
}
export const watchedStorage = new LibraryStorage('watched');
export const queueStorage = new LibraryStorage('queue');
