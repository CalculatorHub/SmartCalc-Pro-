import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const ADMIN_EMAIL = "webistehosting@gmail.com";

export const loginAdmin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (user.email !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error("Access Denied: You are not authorized as an admin.");
    }

    localStorage.setItem("admin", "true");
    return user;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

export const logoutAdmin = async () => {
  await signOut(auth);
  localStorage.removeItem("admin");
};

export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && user.email === ADMIN_EMAIL) {
      localStorage.setItem("admin", "true");
      callback(user);
    } else {
      localStorage.removeItem("admin");
      callback(null);
    }
  });
};

export const isAdmin = () => {
  return localStorage.getItem("admin") === "true";
};
