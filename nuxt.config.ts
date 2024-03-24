// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/strapi", "@pinia/nuxt"],
  css: ["bootstrap/dist/css/bootstrap.min.css"],
});
