import { useEffect, useState } from "react";
import { subscribeToFeedback } from "../services/feedbackService";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ADMIN_EMAILS = ["reddyvamshi607@gmail.com", "webistehosting@gmail.com"];

export default function useFeedbackNotifications() {
  useEffect(() => {
    let unsubFeedback: (() => void) | null = null;
    let first = true;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // Clear previous subscription if any
      if (unsubFeedback) {
        unsubFeedback();
        unsubFeedback = null;
      }

      if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
        unsubFeedback = subscribeToFeedback((data) => {
          if (!first) {
            console.log("📩 New feedback received!");
          }
          first = false;
        });
      }
    });

    return () => {
      unsubAuth();
      if (unsubFeedback) unsubFeedback();
    };
  }, []);
}
