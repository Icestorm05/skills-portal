<template lang="pug">
    v-progress-linear(indeterminate
                      :height="height"
                      :color="color").ma-0#TheProgressBar
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import VProgressLinear from "vuetify/es5/components/VProgressLinear";

@Component({
  components: {
    VProgressLinear
  }
})
export default class TheProgressBar extends Vue {
  @Prop({ type: String, default: "secondary" })
  private color: string;
  @Prop({ type: Number, default: 4 })
  private height: number;
}
</script>
