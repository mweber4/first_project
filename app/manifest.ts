import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Guard Your Eyes — שמירת עינים",
    short_name: "Guard Your Eyes",
    description:
      "Shiurim, chizuk talks and practical guidance on shmiras einayim — in Hebrew, Yiddish and English.",
    start_url: "/he",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#efeeea",
    theme_color: "#efeeea",
    categories: ["education", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Speeches", url: "/en/speeches", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "שיעורים", url: "/he/speeches", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Speakers", url: "/en/lecturers", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
