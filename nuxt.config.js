const config = require("./server/config");

module.exports = {
  head: {
    title: "Skills Portal",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Skills Portal" },
      { name: "msapplication-TileColor", content: "#da532c" },
      { name: "theme-color", content: "#ffffff" }
    ],
    link: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
      },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" }
    ]
  },
  manifest: {
    name: "Skills Portal",
    background_color: "#0c499c",
    theme_color: "#0c499c",
    short_name: "Skills",
    orientation: "portrait"
  },
  render: {
    resourceHints: false
  },
  loading: false,
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#0c499c" },
  /*
  ** Build configuration
  */
  css: ["~/assets/styl/main.styl"],
  build: {
    postcss: [
      require('postcss-object-fit-images')
    ],
    vendor: [
      "core-js/es7/array",
      "core-js/es7/object",
      "core-js/es6/array",
      "core-js/es6/object",
      "core-js/es6/string",
      "core-js/es6/math",
      "core-js/es6/map",
      "core-js/es6/symbol",
      "core-js/es6/typed"
    ],
    extractCSS: {
      allChunks: true
    }
  },
  plugins: [
    "~plugins/axios",
    "~plugins/veeValidate",
    "~plugins/vuetify",
    "~plugins/vuexRouterSync",
    "~plugins/vVisible",
    "~plugins/vScrollTo"
  ],
  axios: {
    baseURL: "/api"
  },
  modules: [
    "~modules/typescript.ts",
    "~modules/tslint.ts",
    "@nuxtjs/pwa",
    "@nuxtjs/axios",
    "~modules/vuetify.ts"
  ]
};
