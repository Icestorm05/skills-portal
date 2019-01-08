# Skill Card Radio Buttons

## Functionality

The skill card radio buttons component displays two sets of radio button groups for skill and currency. The value of the initial radio button is determined by the values passed in.

## Usage

### Props

`<skill-card>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `currency` | Number OR Null *optional* | The skill currency ID. Can use the `sync` operator, for a two-way data binding. Defaults to `null`.
| `disabled` | Boolean *optional* | Whether the radio buttons are disabled or not. Defaults to `false`.
| `level` | Number OR Null *optional* | The skill level ID. Can use the `sync` operator, for a two-way data binding. Defaults to `null`.

### Injections

`<skill-card-radio-buttons>` requires a parent component to provide the following:

| injection | type | description
| --- | --- | ---
| validator | Validator | The VeeValidate $validator instance. The parent component that will check the validation of this component should provide this.

### Example

```html
<skill-card-radio-buttons :currency.sync="currency"
                          :level.sync="level"/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';
import { Provide } from 'vue-property-decorator';

import SkillCardRadioButtons from '~/components/SkillCard/SkillCardRadioButtons/SkillCardRadioButtons.vue';

@Component({
    components: {
        SkillCardRadioButtons,
    },
    // Initialize a fresh validator instance.
    $_veeValidate: {
        validator: 'new',
    },
})
export default class GenericComponent extends Vue {
    // Provide the fresh validator instance for <skill-card-status> to inject.
    @Provide('validator') public $validator = this.$validator;

    private currency = 4;
    private level = 2;
}
```