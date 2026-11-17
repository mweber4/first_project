"use client";

import { useEffect } from "react";

export function ServiceWorker() {
  useEffect(() => {
    // Dev builds change chunk files constantly; only cache in production.
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
