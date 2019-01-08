<template lang="pug">
    v-form#PasswordChanger(@submit.prevent="submit")
        v-text-field(:append-icon="oldPasswordVisible ? 'visibility_off' : 'visibility'"
                     :append-icon-cb="() => oldPasswordVisible = !oldPasswordVisible"
                     autocomplete="new-password"
                     auto-grow
                     label="Old Password"
                     name="old-password"
                     hint="Enter your old password here"
                     :type="oldPasswordVisible ? 'text' : 'password'"
                     v-model="oldPassword"
                     v-validate="'required|old-password-match'"
                     data-vv-name="old-password"
                     data-vv-as="Old Password"
                     :data-vv-delay="oldPasswordCheck ? oldPasswordCheckDelay : 0"
                     :error-messages="errors.collect('old-password')"
                     :loading="checkingOldPassword"
                     :disabled="disabled")#OldPassword
        v-text-field(:append-icon="newPasswordVisible ? 'visibility_off' : 'visibility'"
                     :append-icon-cb="() => newPasswordVisible = !newPasswordVisible"
                     autocomplete="new-password"
                     auto-grow
                     label="New Password"
                     name="new-password"
                     hint="Enter your new password here"
                     :type="newPasswordVisible ? 'text' : 'password'"
                     v-model="newPassword"
                     v-validate="'required|confirmed:confirmed-new-password'"
                     data-vv-name="new-password"
                     data-vv-as="New Password"
                     :error-messages="errors.collect('new-password')"
                     :disabled="disabled")#NewPassword
        v-text-field(:append-icon="confirmedNewPasswordVisible ? 'visibility_off' : 'visibility'"
                     :append-icon-cb="() => confirmedNewPasswordVisible = !confirmedNewPasswordVisible"
                     autocomplete="new-password"
                     auto-grow
                     label="Confirm New Password"
                     name="confirmed-new-password"
                     hint="Confirm your new password here"
                     :type="confirmedNewPasswordVisible ? 'text' : 'password'"
                     v-model="confirmedNewPassword"
                     v-validate="'required|confirmed:new-password'"
                     data-vv-name="confirmed-new-password"
                     data-vv-as="Confirmed New Password"
                     :error-messages="errors.collect('confirmed-new-password')"
                     :disabled="disabled")#ConfirmedNewPassword
        v-btn(color="secondary"
              raised
              ripple
              type="submit"
              :disabled="disabled")#PasswordChangerSubmitButton Submit
        v-btn(color="secondary"
              raised
              ripple
              @click="reset")#PasswordChangerResetButton Reset
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import VBtn from "vuetify/es5/components/VBtn";
import VForm from "vuetify/es5/components/VForm";
import VTextField from "vuetify/es5/components/VTextField";

@Component({
  components: {
    VBtn,
    VForm,
    VTextField
  },
  $_veeValidate: {
    validator: "new"
  }
})
export default class PasswordChanger extends Vue {
  @Prop({ type: Boolean, default: false })
  private disabled: boolean;
  @Prop({ type: Function })
  private oldPasswordCheck: ((password: string) => any) | undefined;
  @Prop({ type: Number, default: 500 })
  private oldPasswordCheckDelay: number;

  private oldPassword = "";
  private oldPasswordVisible = false;
  private checkingOldPassword = false;

  private newPassword = "";
  private newPasswordVisible = false;

  private confirmedNewPassword = "";
  private confirmedNewPasswordVisible = false;

  private mounted() {
    this.$validator.extend("old-password-match", {
      getMessage: field => {
        return `The ${field} does not match current password.`;
      },
      validate: async value => {
        if (!this.oldPasswordCheck) {
          return true;
        }
        try {
          this.checkingOldPassword = true;
          const match = await this.oldPasswordCheck(value);
          return match ? true : false;
        } catch (err) {
          return false;
        } finally {
          this.checkingOldPassword = false;
        }
      }
    });
  }

  private reset() {
    this.oldPassword = "";
    this.newPassword = "";
    this.confirmedNewPassword = "";
  }

  private async submit() {
    if (!this.disabled && await this.$validator.validateAll()) {
      this.$emit("password-change", this.oldPassword, this.newPassword);
    }
  }
}
</script>
