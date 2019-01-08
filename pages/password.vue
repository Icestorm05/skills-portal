<template lang="pug">
    #PasswordPage.text-xs-center
        h2.primary--text Change Password
        password-changer(@password-change="changePassword"
                         :disabled="inProgress"
                         :old-password-check="checkOldPassword")
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Getter } from "vuex-class";

import PasswordChanger from "~/components/PasswordChanger/PasswordChanger.vue";

@Component({
  components: {
    PasswordChanger
  }
})
export default class PasswordPage extends Vue {
  @Getter("progress/isVisible") private inProgress: boolean;

  private mounted() {
    this.$store.commit("progress/hide");
  }

  private async checkOldPassword(password: string): Promise<boolean> {
    try {
      await this.$store.dispatch("auth/checkPassword", password);
      return true;
    } catch (err) {
      return false;
    }
  }

  private async changePassword(oldPassword: string, newPassword: string) {
    try {
      this.$store.commit("progress/show");
      await this.$store.dispatch("auth/changePassword", newPassword);
      this.$store.commit("snackbar/show", {
        message: "Successfuly changed password.",
        color: "success"
      });
    } catch (err) {
      this.$store.commit("snackbar/show", {
        message: err.message,
        color: "error"
      });
    } finally {
      this.$store.commit("progress/hide");
    }
  }
}
</script>
