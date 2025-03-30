// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["primeicons/primeicons.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: "당근 퍼즐 게임",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "합이 10의 배수가 되는 당근들을 선택하여 제거하는 게임입니다.",
        },
        { property: "og:title", content: "당근 퍼즐 게임" },
        {
          property: "og:description",
          content:
            "합이 10의 배수가 되는 당근들을 선택하여 제거하는 게임입니다.",
        },
        {
          property: "og:image",
          content: "https://nuxt3-carrot-game.vercel.app/preview.png",
        },
        {
          property: "og:url",
          content: "https://nuxt3-carrot-game.vercel.app/",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "당근 퍼즐 게임" },
        {
          name: "twitter:description",
          content:
            "합이 10의 배수가 되는 당근들을 선택하여 제거하는 게임입니다.",
        },
        {
          name: "twitter:image",
          content: "https://nuxt3-carrot-game.vercel.app/preview.png",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
});
