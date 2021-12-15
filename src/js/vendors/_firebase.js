// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { notiflix } from './notification';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAHg08FhSXuCfdH_AQjgkdeIc2viSXKYRE',
  authDomain: 'goit-23aba.firebaseapp.com',
  databaseURL:
    'https://goit-23aba-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'goit-23aba',
  storageBucket: 'goit-23aba.appspot.com',
  messagingSenderId: '1058563251498',
  appId: '1:1058563251498:web:4ffe619412261a8e3e9253',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// console.log(db);

export default class Firebase {
  constructor() {
    this.auth = getAuth();
    this.db = getFirestore();

    this.registerForm = document.querySelector('.form-signup');
    this.signForm = document.querySelector('.form-signin');
    this.storageWatched;
    this.storageQueue;
  }
  registerAndLogin() {
    this.registerForm.addEventListener(
      'submit',
      async e => {
        e.preventDefault();
        const email = e.currentTarget.elements.signup__email.value;
        const password = e.currentTarget.elements.signup__password.value;
        console.log(email);

        this.createAccount(email, password);

        setTimeout(() => {
          this.uid = this.auth.currentUser.uid;
          this.createDb();
        }, 200);
      },
      { once: true },
    );
    this.signForm.addEventListener(
      'submit',
      async e => {
        e.preventDefault();
        try {
          const email = e.currentTarget.elements.email.value;
          const password = e.currentTarget.elements.password.value;
          console.log(email);

          this.signAccount(email, password);
          console.log('Я зашел урааа');
          this.uid = this.auth.currentUser.uid;
          console.log(this.uid);
          this.storageWatched = await this.getDbWatched();
          this.storageQueue = await this.getDbQueue();
          console.log(this.storageWatched);
          document.querySelector('[data-modal]').classList.toggle('is-hidden');
          document.querySelector('body').classList.toggle('overflow');
        } catch {
          console.log(12345);
        }
      },
      { once: true },
    );
  }
  async hasIdWatched(id) {
    this.storageWatched = await this.getDbWatched();

    return this.storageWatched.some(x => x.id == id);
  }
  async hasIdQueue(id) {
    this.storageQueue = await this.getDbQueue();

    return this.storageQueue.some(x => x.id == id);
  }
  createAccount(email, password) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        notiflix.createAccount(
          'You have successfully registered, now sign in to your account',
        );
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
          notiflix.errorNotification(
            error,
            'The user is already registered. Log in to your account.',
          );
        }
      });
  }
  signAccount(email, password) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        notiflix.createAccount(
          'You have successfully signed in to your account',
        );
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage === 'Firebase: Error (auth/wrong-password).') {
          return notiflix.errorNotification(
            error,
            'You entered an incorrect password',
          );
        } else if (errorMessage === 'Firebase: Error (auth/user-not-found).') {
          return notiflix.errorNotification(error, 'User not found');
        }
      });
  }

  createDb(uid) {
    try {
      setDoc(doc(this.db, 'users', `${this.auth.currentUser.uid}`), {
        watched: [],
        queue: [],
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  updeteWatched(id) {
    try {
      updateDoc(doc(this.db, 'users', `${this.auth.currentUser.uid}`), {
        watched: arrayUnion(id),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  updeteQueue(id) {
    try {
      updateDoc(doc(this.db, 'users', `${this.auth.currentUser.uid}`), {
        queue: arrayUnion(id),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  removeQueue(id) {
    try {
      updateDoc(doc(this.db, 'users', `${this.auth.currentUser.uid}`), {
        queue: arrayRemove(id),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  removeWatched(id) {
    try {
      updateDoc(doc(this.db, 'users', `${this.auth.currentUser.uid}`), {
        watched: arrayRemove(id),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  async getDbWatched() {
    const docRef = doc(this.db, 'users', this.auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().watched;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }
  async getDbQueue() {
    const docRef = doc(this.db, 'users', this.auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().queue;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }
}
