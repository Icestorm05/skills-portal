# Skill Card

## Functionality

The skill card displays a card containing data on the skill passed in. It displays the name as the card title. The description is displayed as card text.
Optionally, radio buttons or a readonly list of the skill level and currency can be displayed. Buttons may also be displayed as card actions. These include an `Add`, `Approve`, `Edit` and `Remove` button.

## Dependencies

`<skill-card>` has a dependency on the `<skill-card-status>` and the `<skill-card-radio-buttons>` component.

## Usage

### Props

`<skill-card>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `disabled` | Boolean *optional* | Whether any skill card inputs and buttons are disabled or not. Defaults to `false`.
| `employeeId` | Number *optional* | The employee ID. Required for the add button to work. Defaults to `0`.
| `skill` | Object | The skill object to display.
| `display-add-button` | Boolean *optional* | Displays an add button. Defaults to `false`.
| `display-approve-button` | Boolean *optional* | Displays an approve button. Defaults to `false`.
| `display-edit-button` | Boolean *optional* | Displays an edit button. Defaults to `false`.
| `display-remove-button` | Boolean *optional* | Displays a remove button. Defaults to `false`.
| `display-status-radio-buttons` | Boolean *optional* | Displays skill currency and level radio buttons. Defaults to `false`.
| `display-status-list` | Boolean *optional* | Displays skill currency and level list. Defaults to `false`.

### Schemas

The `skill` prop should match the skill, saved skill or approved skill schema.

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
<skill-card :skill="skill"
            display-status-radio-buttons
            display-add-button/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import SkillCard from '~/components/SkillCard/SkillCard.vue';

@Component({
    components: {
        SkillCard,
    },
})
export default class GenericComponent extends Vue {
    private skill = {
        name: 'Test Skill',
        description: 'This is a test skill.',
        SkillAttributeId: 1,
    };
}
```