import Vue from "vue";
import Vuetify from "vuetify/es5/components/Vuetify";
import theme from "~/assets/json/theme.json";

Vue.use(Vuetify, {
  components: {
    Vuetify
  },
  theme
});
