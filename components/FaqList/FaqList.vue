<template lang="pug">
    v-expansion-panel(expand
                      popout
                      v-if="faqs.length")#FaqList
        v-expansion-panel-content(v-for="faq in faqs"
                                  :key="faq.question"
                                  :lazy="lazy"
                                  ripple).FaqPanel.mb-2
            span(slot="header").white--text.FaqPanelHeader {{ faq.question }}
            v-card.FaqPanelCard
                template(v-for="(answer, i) in faq.answers")
                    v-card-title(:key="answer.text"
                                 v-if="answer.type === 'b'").FaqPanelCardContentTitle.py-0
                        b {{ answer.text }}
                    v-card-text(:key="answer.text"
                                v-if="answer.type === 'p'"
                                :class="{ 'pt-0': i !== 0 }").FaqPanelCardContent.pb-0
                        p {{ answer.text }}
                    v-card-text(v-if="answer.type === 'ul'"
                                :class="{ 'pt-0': i !== 0, 'pb-0': i === faq.answers.length-1 }").FaqPanelCardContent
                        ul.ml-3
                            li(v-for="text in answer.text") {{ text }}
                    v-data-table(v-if="answer.type === 'table'"
                                :items="answer.text"
                                hide-actions
                                hide-headers
                                :class="{ 'pb-3': i !== faq.answers.length-1 }").FaqPanelCardContent
                        template(slot="items" slot-scope="{ item: items }")
                            td(v-for="item in items") {{ item }}
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import { IFaq } from "types/faq";

import VCard, { VCardText, VCardTitle } from "vuetify/es5/components/VCard";
import VDataTable from "vuetify/es5/components/VDataTable";
import VExpansionPanel, {
  VExpansionPanelContent
} from "vuetify/es5/components/VExpansionPanel";
import { VContainer } from "vuetify/es5/components/VGrid";

@Component({
  components: {
    VCard,
    VCardTitle,
    VCardText,
    VContainer,
    VDataTable,
    VExpansionPanel,
    VExpansionPanelContent
  }
})
export default class FaqList extends Vue {
  @Prop({ type: Array, required: true })
  private faqs: IFaq[];
  @Prop({ type: Boolean, default: true })
  private lazy: boolean;
}
</script>

<style lang="stylus" scoped>
theme = json('../../assets/json/theme.json', { hash: true });

.FaqPanel {
    &.expansion-panel__container--active {
        margin-top: 8px;
        margin-left: 0;
        margin-right: 0;
    }

    /deep/ .expansion-panel__header {
        background-color: theme.secondary;

        .icon {
            color: rgba(255, 255, 255, 0.54) !important;
        }
    }
}
</style>
