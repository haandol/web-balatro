import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        },
      ],
    },
  },

  watch: {
    ignore: ['docs/**', 'specs/**'],
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2025-03-30',
})
