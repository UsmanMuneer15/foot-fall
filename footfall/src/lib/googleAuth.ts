import {
  GoogleAuthProvider,
  signInWithPopup,
  type AuthError,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

/**
 * Firebase Google popup sign-in.
 * Returns the Firebase ID token for backend verification.
 */
export async function signInWithGoogleFirebase(): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase Google sign-in is not configured.");
  }

  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("email");
  provider.addScope("profile");

  try {
    const result = await signInWithPopup(auth, provider);
    // Force refresh so backend always gets a fresh Firebase ID token.
    const idToken = await result.user.getIdToken(true);
    if (!idToken) {
      throw new Error("Google did not return an ID token.");
    }
    return idToken;
  } catch (error) {
    const authError = error as AuthError;
    if (authError?.code === "auth/popup-closed-by-user") {
      throw new Error("Google sign-in was cancelled.");
    }
    if (authError?.code === "auth/popup-blocked") {
      throw new Error(
        "Google popup was blocked. Allow popups for this site and try again.",
      );
    }
    if (authError?.code === "auth/unauthorized-domain") {
      throw new Error(
        "This domain is not authorized in Firebase Authentication settings.",
      );
    }
    throw error instanceof Error
      ? error
      : new Error("Google sign-in failed.");
  }
}
