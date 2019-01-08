<template lang="pug">
    v-fab-transition
        v-btn(color="primary"
              fab
              fixed
              bottom
              left
              :aria-label="pageYOffset ? 'Scroll Up' : 'Scroll Down'"
              v-scroll-to="{ el: pageYOffset ? top : bottom, offset }").ScrollButton
            v-icon(v-if="pageYOffset").ScrollButtonIcon keyboard_arrow_up
            v-icon(v-else).ScrollButtonIcon keyboard_arrow_down
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import { VFabTransition } from "vuetify/es5/components/transitions";
import VBtn from "vuetify/es5/components/VBtn";
import VIcon from "vuetify/es5/components/VIcon";

@Component({
  components: {
    VBtn,
    VFabTransition,
    VIcon
  }
})
export default class ScrollButton extends Vue {
  @Prop({ type: String, required: true })
  private bottom: string;
  @Prop({ type: String, required: true })
  private top: string;
  @Prop({ type: Number, default: -150 })
  private offset: number;

  private pageYOffset: number = window.pageYOffset;
  private mounted() {
    window.addEventListener("scroll", (e: Event) => {
      this.pageYOffset = window.pageYOffset;
    });
  }
}
</script>