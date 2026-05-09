import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously,
  User 
} from 'firebase/auth';
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

export const loginAdminPassword = (password: string) => {
  const DEFAULT_PASS = "Patel@9488";
  if (password === DEFAULT_PASS) {
    localStorage.setItem("admin_password_verified", "true");
    return true;
  }
  throw new Error("Invalid Access Key ❌");
};

export const loginAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error: any) {
    throw new Error("Failed to initialize session: " + error.message);
  }
};

export const logoutAdmin = async () => {
  await signOut(auth);
  localStorage.removeItem("admin");
  localStorage.removeItem("admin_password_verified");
};

export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const isAdmin = () => {
  return localStorage.getItem("admin") === "true" || localStorage.getItem("admin_password_verified") === "true";
};
