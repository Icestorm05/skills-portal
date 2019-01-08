<template lang="pug">
    #FaqPage.text-xs-center
        h2.primary--text.mb-3 Frequently Asked Questions
        faq-list(:faqs="faqs")
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { State } from "vuex-class";

import { IFaq } from "types/faq";

import FaqList from "~/components/FaqList/FaqList.vue";

@Component({
  components: {
    FaqList
  }
})
export default class FaqPage extends Vue {
  @State("faqs") private faqs: IFaq[];

  private mounted() {
    this.$store.commit("progress/hide");
  }
}
</script>

<style lang="stylus" scoped>
#FaqPage {
    width: 100%;
}
</style>
