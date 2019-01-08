<template lang="pug">
    v-snackbar(:color="color"
               :timeout="timeout"
               :value="visible"
               @input="hide")#TheSnackbar
        span#TheSnackbarMessage
            b(v-if="color === 'error'").mr-1 Error:
            b(v-if="color === 'warning'").mr-1 Warning:
            slot
        v-btn(flat
              aria-label="Close Snackbar"
              @click="hide").ml-3#TheSnackbarCloseButton Close
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";

import VBtn from "vuetify/es5/components/VBtn";
import VIcon from "vuetify/es5/components/VIcon";
import VSnackbar from "vuetify/es5/components/VSnackbar";

@Component({
  components: {
    VBtn,
    VIcon,
    VSnackbar
  }
})
export default class TheSnackbar extends Vue {
  @Prop({ type: String, default: "primary" })
  private color: string;
  @Prop({ type: Number, default: 5000 })
  private timeout: number;
  @Prop({ type: Boolean, default: false })
  private visible: boolean;

  private timer: number = 0;

  @Watch("visible")
  private visibilityChanged(visibility: boolean) {
    if (visibility) {
      this.timer = window.setTimeout(this.hide, this.timeout);
    } else {
      window.clearTimeout(this.timer);
    }
  }

  private hide() {
    this.$emit("timeout-elapsed");
  }
}
</script>
