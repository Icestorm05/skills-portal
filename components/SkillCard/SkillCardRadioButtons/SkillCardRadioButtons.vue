<template lang="pug">
    v-layout(full-width).SkillCardRadioButtons
        v-flex(xs6)
            v-radio-group(:input-value="level"
                          @change="$emit('update:level', $event)"
                            v-validate:level="'required'"
                            label="Level"
                            name="level"
                            :error-messages="errors.collect('level')"
                            :disabled="disabled").SkillCardRadioGroup
                v-radio(:value="4"
                        label="Expert"
                        color="success"
                        light).SkillCardRadioButton
                v-radio(:value="3"
                        label="Practitioner"
                        color="warning"
                        light).SkillCardRadioButton
                v-radio(:value="2"
                        label="Awareness"
                        color="error"
                        light).SkillCardRadioButton
        v-flex(xs6)
            v-radio-group(:input-value="currency"
                            @change="$emit('update:currency', $event)"
                            v-validate:currency="'required'"
                            label="Currency"
                            name="currency"
                            :error-messages="errors.collect('currency')"
                            :disabled="disabled").SkillCardRadioGroup
                v-radio(:value="2"
                        label="Current"
                        color="success"
                        light).SkillCardRadioButton
                v-radio(:value="3"
                        label="Fading"
                        color="warning"
                        light).SkillCardRadioButton
                v-radio(:value="4"
                        label="Historic"
                        color="error"
                        light).SkillCardRadioButton
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import { Validator } from "vee-validate";
import Vue from "vue";
import { Inject, Prop } from "vue-property-decorator";

import { VFlex, VLayout } from "vuetify/es5/components/VGrid";
import VRadioGroup, { VRadio } from "vuetify/es5/components/VRadioGroup";

@Component({
  components: {
    VFlex,
    VLayout,
    VRadioGroup,
    VRadio
  }
})
export default class SkillCardRadioButtons extends Vue {
  @Inject("validator") public $validator: Validator;
  @Prop({ type: Boolean, default: false })
  private disabled: boolean;
  @Prop({
    default: null,
    validator: val => val === null || typeof val === "number"
  })
  private currency: number | null;
  @Prop({
    default: null,
    validator: val => val === null || typeof val === "number"
  })
  private level: number | null;
}
</script>
