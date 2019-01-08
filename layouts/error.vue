<template lang="pug">
    #ErrorPage
        svg(xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="#DBE1EC" viewBox="0 0 48 48")
            path(d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z")
        #ErrorTitle {{ message }}
        p#ErrorDescription(v-if="statusCode === 404")
            nuxt-link#ErrorLink(to="/profile") Back to Home
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

interface IError {
    message: string;
    path: string;
    statusCode: number;
}

@Component
export default class Error extends Vue {
    @Prop({ type: Object, required: true }) private error: IError;

    private mounted() {
        this.$store.commit('progress/hide');
    }

    private get statusCode() {
        return (this.error && this.error.statusCode) || 500;
    }

    private get message() {
        return (this.error && this.error.message) || "An error occurred";
    }
}
</script>

<style lang="stylus">
#ErrorPage {
  padding: 1rem;
  background: #F7F8FB;
  color: #47494E;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  font-weight: 100 !important;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  height: 100%;

  #ErrorTitle {
    font-size: 1.2rem;
    margin-top: 10px;
    color: #47494E;
    margin-bottom: 8px; 
  }

  #ErrorDescription {
    color: #7F828B;
    line-height: 21px;
    margin-bottom: 10px;

    a {
        color: #7F828B !important;
        text-decoration: none;
    }
  }


}
</style>