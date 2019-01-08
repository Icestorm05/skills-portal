<template lang="pug">
    v-form.SkillCard
        v-card(raised
               height="100%")
            v-layout(column fill-height)
                v-card-title(primary-title).pb-0
                    b.SkillCardName {{ skill.name }}
                v-card-text(v-if="displayPath").text-xs-left.pb-0
                    b(v-if="skill.path.length > 1") Areas: 
                    b(v-else) Area: 
                    span {{ skill.path.join(', ') }}
                v-flex(v-visible="skill.description").pa-0.SkillCardDescriptionContainer
                    v-card-text.pb-0.SkillCardDescription {{ skill.description }}
                v-card-text(:class="{'py-0': displayStatusRadioButtons}")
                    skill-card-radio-buttons(v-if="displayStatusRadioButtons"
                                             :currency="currency"
                                             @update:currency="currencyChanged"
                                             :level="level"
                                             @update:level="levelChanged"
                                             :disabled="disabled").SkillCardRadioButtons
                    skill-card-status(v-if="displayStatusList"
                                      :currency="currency"
                                      :level="level")
                v-card-actions(v-if="displayButton").SkillCardButtons
                        v-btn(v-if="displayAddButton"
                              flat
                              color="primary"
                              :disabled="disabled"
                              aria-label="Add Skill"
                              @click="add").SkillCardAddButton Add
                        v-btn(v-if="displayEditButton"
                              flat
                              color="primary"
                              :disabled="disabled"
                              aria-label="Save Skill"
                              @click="edit").SkillCardEditButton Save
                        v-btn(v-if="displayRemoveButton"
                              flat
                              color="error"
                              :disabled="disabled"
                              aria-label="Remove Skill"
                              @click="remove").SkillCardRemoveButton Remove
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import { Validator } from "vee-validate";
import Vue from "vue";
import { Prop, Provide, Watch } from "vue-property-decorator";

import { ISkill } from "types/skill";

import VBtn from "vuetify/es5/components/VBtn";
import VCard, {
  VCardActions,
  VCardText,
  VCardTitle
} from "vuetify/es5/components/VCard";
import VForm from "vuetify/es5/components/VForm";
import { VFlex, VLayout } from "vuetify/es5/components/VGrid";
import SkillCardRadioButtons from "./SkillCardRadioButtons/SkillCardRadioButtons.vue";
import SkillCardStatus from "./SkillCardStatus/SkillCardStatus.vue";

@Component({
  components: {
    SkillCardRadioButtons,
    SkillCardStatus,
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VFlex,
    VForm,
    VLayout
  },
  $_veeValidate: {
    validator: "new"
  }
})
export default class SkillCard extends Vue {
  @Provide("validator") public $validator: Validator = this.$validator;

  @Prop({ type: Object, required: true })
  private skill: ISkill;
  @Prop({ type: Number, default: 0 })
  private employeeId: number;
  @Prop({ type: Boolean, default: false })
  private disabled: boolean;

  @Prop({ type: Boolean, default: false })
  private displayAddButton: boolean;
  @Prop({ type: Boolean, default: false })
  private displayEditButton: boolean;
  @Prop({ type: Boolean, default: false })
  private displayRemoveButton: boolean;

  @Prop({ type: Boolean, default: false })
  private displayStatusRadioButtons: boolean;
  @Prop({ type: Boolean, default: false })
  private displayStatusList: boolean;

  @Prop({ type: Boolean, default: false })
  private displayPath: boolean;

  @Prop({ type: Boolean, default: false })
  private autoUpdate: boolean;

  private get displayButton() {
    return (
      this.displayAddButton ||
      this.displayEditButton ||
      this.displayRemoveButton
    );
  }

  private currency = this.skill.SkillCurrencyId
    ? this.skill.SkillCurrencyId
    : null;
  private level = this.skill.SkillLevelId ? this.skill.SkillLevelId : null;

  @Watch("skill")
  private reset(prev, curr) {
    this.currency = this.skill.SkillCurrencyId
      ? this.skill.SkillCurrencyId
      : null;
    this.level = this.skill.SkillLevelId ? this.skill.SkillLevelId : null;
    this.$validator.reset();
  }

  private currencyChanged(currency: number) {
    this.currency = currency;
    this.$emit('currency-change', currency);
    if (this.autoUpdate) {
      this.edit();
    }
  }

  private levelChanged(level: number) {
    this.level = level;
    this.$emit('level-change', level);
    if (this.autoUpdate) {
      this.edit();
    }
  }

  private async add() {
    if (await this.$validator.validateAll()) {
      const skill = {
        ...this.skill,
        EmployeeId: this.employeeId,
        EmployeeSkillAttributeId: this.skill.SkillAttributeId,
        SkillCurrencyId: this.currency,
        SkillLevelId: this.level
      };
      this.$emit("add-skill", skill, this.reset);
    }
  }

  private async edit() {
    if (await this.$validator.validateAll()) {
      const skill = {
        ...this.skill,
        SkillCurrencyId: this.currency,
        SkillLevelId: this.level
      };
      this.$emit("edit-skill", skill, this.reset);
    }
  }

  private async remove() {
    if (await this.$validator.validateAll()) {
      this.$emit("remove-skill", this.skill, this.reset);
    }
  }
}
</script>

<style lang="stylus" scoped>
.SkillCard {
    height: 100%;
}

.SkillCardButtons {
    width: 100%;
    justify-content: center;
}

.SkillCardDescription {
  text-align: left;
}

.SkillCardDescriptionContainer {
    flex-shrink: 0;
}
</style>
