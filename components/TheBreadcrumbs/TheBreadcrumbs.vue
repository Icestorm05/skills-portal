<template lang="pug">
    v-breadcrumbs(divider="/")#TheBreadcrumbs
        v-breadcrumbs-item(nuxt
                           :to="{ name: routeName }").BreadcrumbItem {{ profile.FullName }}
        v-breadcrumbs-item(v-for="route in path(profile.children)"
                           :key="route.text"
                           nuxt
                           :to="route.link").BreadcrumbItem {{ route.text }}
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import { IBreadcrumb } from "types/breadcrumb";
import { IProfile } from "types/profile";

import VBreadcrumbs, {
  VBreadcrumbsItem
} from "vuetify/es5/components/VBreadcrumbs";

@Component({
  components: {
    VBreadcrumbs,
    VBreadcrumbsItem
  }
})
export default class TheBreadcrumbs extends Vue {
  @Prop({ type: Number, required: true })
  private employeeId: number;
  @Prop({ type: Object, required: true })
  private profile: IProfile;
  @Prop({ type: String, required: true })
  private routeName: string;

  private path(childProfiles: IProfile[]): IBreadcrumb[] {
    return childProfiles.reduce((path: IBreadcrumb[], childProfile) => {
      if (this.employeeId === childProfile.EmployeeId) {
        path.push({
          link: {
            name: this.routeName,
            params: { id: childProfile.EmployeeId.toString() }
          },
          text: childProfile.FullName
        });
      } else {
        const deepProfiles = this.path(childProfile.children);
        if (deepProfiles.length) {
          path.push({
            link: {
              name: this.routeName,
              params: { id: childProfile.EmployeeId.toString() }
            },
            text: childProfile.FullName
          });
        }
        return path.concat(deepProfiles);
      }
      return path;
    }, []);
  }
}
</script>
