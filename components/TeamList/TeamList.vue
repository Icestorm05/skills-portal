<template lang="pug">
    v-container(fluid
                grid-list-md
                v-if="team.length")#TeamList
        v-list(two-line).elevation-12
            v-list-group(v-for="teamMember in team"
                         :key="teamMember.EmployeeId"
                         :lazy="lazy"
                         :prepend-icon="icon(teamMember.EmployeeId)"
                         :append-icon="$vuetify.breakpoint.name === 'xs' ? '' : 'keyboard_arrow_down'"
                         no-action).TeamMember
                v-list-tile(slot="activator")
                    v-list-tile-content
                        v-list-tile-title.TeamMemberFullName {{ teamMember.FullName }}
                        v-list-tile-sub-title.TeamMemberJobTitle {{ teamMember.JobTitle }}
                    v-list-tile-avatar.TeamMemberAvatar.hidden-xs-only
                        avatar-image(:image-name="teamMember.MainStaffNumber" :renderAsBase64="true")
                v-list-tile(nuxt
                            :to="{ name: 'id-skills-unreviewed', params: { id: teamMember.EmployeeId } }").TeamMemberUnreviewedSkills
                    v-list-tile-content
                        v-list-tile-title View Unreviewed Skills
                    v-list-tile-action
                        v-badge(color="warning"
                                left).TeamMemberUnreviewedSkillBadge
                            span(slot="badge"
                                 v-if="diff(teamMember.EmployeeId)") {{ diff(teamMember.EmployeeId) }}
                            v-icon list
                v-list-tile(nuxt
                            :to="{ name: 'id-skills-reviewed', params: { id: teamMember.EmployeeId } }").TeamMemberReviewedSkills
                    v-list-tile-content
                        v-list-tile-title View Reviewed Skills
                    v-list-tile-action
                        v-icon playlist_add_check
                v-list-tile(nuxt
                            :to="{ name: 'id-profile', params: { id: teamMember.EmployeeId } }").TeamMemberProfile
                    v-list-tile-content
                        v-list-tile-title View Profile
                    v-list-tile-action
                        v-icon person
                v-list-tile(nuxt
                            :to="{ name: 'id-team', params: { id: teamMember.EmployeeId } }"
                            v-if="teamMember.children.length").TeamMemberTeam
                    v-list-tile-content
                        v-list-tile-title View Team
                    v-list-tile-action
                        v-icon people
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import { IProfile } from "types/profile";
import { ITeamSkill } from "types/teamSkill";

import VBadge from "vuetify/es5/components/VBadge";
import { VContainer } from "vuetify/es5/components/VGrid";
import VIcon from "vuetify/es5/components/VIcon";
import VList, {
  VListGroup,
  VListTile,
  VListTileAction,
  VListTileAvatar,
  VListTileContent,
  VListTileSubTitle,
  VListTileTitle
} from "vuetify/es5/components/VList";
import AvatarImage from "~/components/AvatarImage/AvatarImage.vue";

@Component({
  components: {
    AvatarImage,
    VBadge,
    VContainer,
    VIcon,
    VList,
    VListGroup,
    VListTile,
    VListTileAction,
    VListTileAvatar,
    VListTileContent,
    VListTileSubTitle,
    VListTileTitle
  }
})
export default class TeamList extends Vue {
  @Prop({ type: Boolean, default: true })
  private lazy: boolean;
  @Prop({ type: Array, required: true })
  private team: IProfile[];
  @Prop({ type: Array, required: true })
  private teamSkills: ITeamSkill[];

  private diff(EmployeeId: number) {
    const skills = this.skills(EmployeeId);
    return skills ? skills.diff : 0;
  }

  private icon(EmployeeId: number) {
    const skills = this.skills(EmployeeId);
    return skills && skills.diff ? "warning" : "verified_user";
  }

  private skills(EmployeeId: number) {
    return this.teamSkills.find(
      teamSkill => teamSkill.EmployeeId === EmployeeId
    );
  }
}
</script>
