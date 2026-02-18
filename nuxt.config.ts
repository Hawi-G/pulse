// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/styles.css'],
  app: {
    head: {
      title: 'Pulse - Productivity Dashboard',
      meta: [
        { name: 'description', content: 'Minimal productivity dashboard for medical students' }
      ]
    }
  }
})
