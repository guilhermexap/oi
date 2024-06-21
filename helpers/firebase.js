// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
const runtimeConfig = useRuntimeConfig();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: runtimeConfig.public.firebaseApiKey,
  authDomain: runtimeConfig.public.firebaseAuthDomain,
  projectId: runtimeConfig.public.firebaseProjectId,
  storageBucket: runtimeConfig.public.firebaseStorageBucket,
  messagingSenderId: runtimeConfig.public.measurementId,
  appId: runtimeConfig.public.firebaseAppId,
  measurementId: runtimeConfig.public.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { storage, analytics };
