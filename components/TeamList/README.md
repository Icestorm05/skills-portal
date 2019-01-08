# Team List

## Functionality

The team list component displays a list of all the profiles passed in. The component will display the full name of the person who the profile belongs to, their job title, and will use the Employee ID as a route link parameter.

## Usage

### Props

`<team-list>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `lazy` | Boolean *optional* | Whether to render the subgroup lazily. Defaults to `true`.
| `team` | Array | The array of team members.
| `team-skills` | Array | The array of team members' skills.

### Schemas

The `team` prop requires the following object to exist within the array:

| attribute | type | description
| --- | --- | ---
| `EmployeeId` | String | The Employee ID of the profile.
| `FullName` | String | The full name of the person who the profile belongs to.
| `JobTitle` | String | The job title of the profile.

The `team-skills` prop requires the following object to exist within the array:

| attribute | type | description
| --- | --- | ---
| `diff` | Number | How many differences exist between skills and reviewed skills.
| `EmployeeId` | String | The Employee ID which maps to a profile.
| `skills` | Array *optional* | The array of skills. The top level should match the skill category schema, and **must** eventually lead down to a skill, saved skill or approved skill schema object.

#### Skill Category Schema

| attribute | type | description
| --- | --- | ---
| `name` | String | The name of the skill category.
| `children` | Array | An array of further skill or skill categories. **Must** eventually lead down to a skill or saved skill schema object.

#### Skill Schema

| attribute | type | description
| --- | --- | ---
| `name` | String | The name of the skill.
| `description` | String *optional* | The description of the skill.
| `SkillAttributeId` | Number | The unique attribute ID of the skill.

#### Saved Skill Schema

| attribute | type | description
| --- | --- | ---
| `name` | String | The name of the skill.
| `description` | String *optional* | The description of the skill.
| `SkillAttributeId` | Number | The attribute ID of the skill.
| `EmployeeSkillAttributeId` | Number | A link to the SkillAttributeId.
| `EmployeeId` | Number | The ID of the employee who has the skill.
| `EmployeeSkillId` | Number | The unique ID of the saved skill.
| `SkillCurrencyId` | Number | The ID of the currency. 2 maps to `Current`. 3 maps to `Fading`. 4 maps to `Historic`.
| `SkillLevelId` | Number | The ID of the level. 2 maps to `Awareness`. 3 maps to `Practitioner`. 4 maps to `Expert`.

#### Approved Skill Schema

| attribute | type | description
| --- | --- | ---
| `name` | String | The name of the skill.
| `description` | String *optional* | The description of the skill.
| `SkillAttributeId` | Number | The attribute ID of the skill.
| `EmployeeApproveSkillAttributeId` | Number | A link to the SkillAttributeId.
| `EmployeeApprovedSkillId` | Number | The unique ID of the approved skill.
| `EmployeeId` | Number | The ID of the employee who has the skill.
| `SkillCurrencyId` | Number | The ID of the currency. 2 maps to `Current`. 3 maps to `Fading`. 4 maps to `Historic`.
| `SkillLevelId` | Number | The ID of the level. 2 maps to `Awareness`. 3 maps to `Practitioner`. 4 maps to `Expert`.

### Example

```html
<team-list :team="team"/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import TeamList from '~/components/TeamList/TeamList.vue';

@Component({
    components: {
        TeamList,
    },
})
export default class GenericComponent extends Vue {
    private team = [{
        EmployeeId: 1,
        FullName: 'John Doe',
        JobTitle: 'Innovation Developer',
    }, {
        EmployeeId: 2,
        FullName: 'Jane Doe',
        JobTitle: 'Junior Innovation Developer',
    }]
}
```