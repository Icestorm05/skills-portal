<template lang="pug">
    v-container(fill-height
                fluid)#LoginPage
        v-layout(align-center
                 justify-center)
            v-flex(xs12 sm8 md4)
                v-card(hover
                       raised
                       light)#LoginCard
                    v-card-title(primary-title)
                        v-form(@submit.prevent="login")#LoginForm
                            h3.subheading.primary--text.mb-2 Please login
                            v-text-field(append-icon="email"
                                        auto-grow
                                        autofocus
                                        color="secondary"
                                        clearable
                                        label="Email Address"
                                        name="email"
                                        v-model="user.username"
                                        v-validate="'required'"
                                        data-vv-name="email"
                                        :error-messages="errors.collect('email')"
                                        :disabled="inProgress")#LoginEmail
                            v-text-field(append-icon="lock"
                                        autocomplete="new-password"
                                        auto-grow
                                        clearable
                                        color="secondary"
                                        label="Password"
                                        name="password"
                                        type="password"
                                        v-model="user.password"
                                        v-validate="'required'"
                                        data-vv-name="password"
                                        :error-messages="errors.collect('password')"
                                        :disabled="inProgress")#LoginPassword
                            v-btn(block
                                color="secondary"
                                raised
                                ripple
                                type="submit"
                                :disabled="inProgress")#LoginSubmitButton Login
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Getter, State } from "vuex-class";

import { IProfile } from "types/profile";
import { IUser } from "types/user";

import VBtn from "vuetify/es5/components/VBtn";
import VCard, { VCardTitle } from "vuetify/es5/components/VCard";
import VForm from "vuetify/es5/components/VForm";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import VTextField from "vuetify/es5/components/VTextField";

@Component({
  components: {
    VBtn,
    VCard,
    VCardTitle,
    VContainer,
    VForm,
    VFlex,
    VLayout,
    VTextField
  },
  $_veeValidate: {
    validator: "new"
  }
})
export default class LoginPage extends Vue {
  @Getter("progress/isVisible") private inProgress: boolean;
  @State("profile") private profile: IProfile;
  private user: IUser = {
    username: "",
    password: ""
  };

  private mounted() {
    this.$store.commit("progress/hide");
  }

  /**
   * Attempts to log the user in.
   * On success, redirects to the page requiring login and displays a success message.
   * On fail, displays an error.
   */
  private async login() {
    if (await this.$validator.validateAll()) {
      try {
        this.$store.commit("progress/show");

        await this.$store.dispatch("auth/login", this.user);
        await this.$store.dispatch("profile/get");

        const redirect = this.$route.query.redirect;
        if (redirect) {
          this.$router.push(redirect);
        } else {
          this.$router.push("/profile");
        }

        this.$store.commit("snackbar/show", {
          message: "Successfully logged in.",
          color: "success"
        });
      } catch (err) {
        this.$store.commit("snackbar/show", {
          message: "Incorrect email address and/or password.",
          color: "error"
        });
      } finally {
        this.$store.commit("progress/hide");
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#LoginCard {
    cursor: default;

    #LoginForm {
        text-align: center;
        width: 100%;
    }
}
</style>
