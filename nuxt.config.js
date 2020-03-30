
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'OneTwoOneTwo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'image', content: '/logo.png' },
      { itemprop: 'name', content: 'OneTwoOneTwo' },
      { itemprop: 'description', content: process.env.npm_package_description || '' },
      { itemprop: 'image', content: '/logo.png' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'OneTwoOneTwo' },
      { name: 'twitter:description', content: process.env.npm_package_description || '' },
      { name: 'twitter:image:src', content: '/logo-tw.png' },
      { name: 'og:title', content: 'OneTwoOneTwo' },
      { name: 'og:description', content: process.env.npm_package_description || '' },
      { name: 'og:image', content: '/logo-og.png' },
      { name: 'og:url', content: this.BASE_URL },
      { name: 'og:site_name', content: 'OneTwoOneTwo' },
      { name: 'og:type', content: 'website' },
      { name: 'msapplication-TileColor', content: '#f17041' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#f17041' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu+Mono:400,700&display=swap&subset=latin-ext' },
    ],
    script: [
      { src: '/atx.js' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/global.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/assets/js/lazy-load.js', mode: 'client' },
    { src: '~/plugins/highcharts.js', mode: 'client' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    // eslint-disable-next-line no-unused-vars
    extend(config, ctx) {

    },
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/scores/:season/:week/:conf?',
        component: resolve(__dirname, 'pages/scores/_season/_week/index.vue'),
        name: 'scores-season-week-conf',
      });
    },
  },
};
