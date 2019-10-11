import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_DATABASE_URL,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
}

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.store = app.firestore();
    this.storage = app.storage();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
  this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  // retrieve authUser
  doRetrieveAuthUser = (authUser) => this.auth.onAuthStateChanged(authUser);

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  // doPasswordUpdate = password =>
  //   this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = '';
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  user = uid => this.store.doc(`users/${uid}`);
  users = () => this.store.collection('users');

  ref = (path) => this.store.doc(path);

  grade = gid => this.store.doc(`grades/${gid}`);
  grades = () => this.store.collection('grades');

  discipline = did => this.store.doc(`disciplines/${did}`);
  disciplines = () => this.store.collection('disciplines');

  chapter = cid => this.store.doc(`chapters/${cid}`);
  chapters = () => this.store.collection('chapters');

  exercice = cid => this.store.doc(`exercises/${cid}`);
  exercices = () => this.store.collection('exercises');

}

export default new Firebase();