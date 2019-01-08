# Skill List

## Functionality

The skill list component displays a recursive list of all the skill categories and skills. Each skill category is displayed in an expansion panel. Clicking on this panel will display the skills and/or skill categories within the category. Content inside of each expansion panel is lazily rendered, in order to optimize performance.

## Usage

### Props

`<skill-list>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `lazy` | Boolean *optional* | Whether to render the skill list lazily or not. Defaults to `true`.
| `skills` | Array | The array of skill and skill category objects.

### Slots

`<skill-list>` exposes the following slots:

| slot | scope | type | description
| --- | --- | ---
| `default` | `skill` | Object | The skill object at the bottom level of the array passed in. Can either be a skill, saved skill or approved skill schema object.

### Schemas

The `skills` prop requires either of the following objects to exist within the array:

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
<skill-list :skills="skills">
    <p slot-scope="{ skill }">{{ skill.name }}</p>
</skill-list>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import SkillList from '~/components/SkillList/SkillList.vue';

@Component({
    components: {
        SkillList,
    },
})
export default class GenericComponent extends Vue {
    private skills = [{
        name: 'Test Category',
        children: [{
            name: 'Test Category 2',
            children: [{
                name: 'Test Skill',
                description: 'This is a test skill.',
                SkillAttributeId: 1,
            }, {
                name: 'Test Skill 2',
                description: 'This is another test skill.',
                SkillAttributeId: 2,
            }],
        }],
    }]
}
```