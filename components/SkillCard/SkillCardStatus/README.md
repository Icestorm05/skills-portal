# Skill Card Status

## Functionality

The skill card status displays a readonly list of the level and currency passed in.

## Usage

### Props

`<skill-card-status>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `currency` | Number OR Null *optional* | The skill currency ID. Defaults to `null`.
| `level` | Number OR Null *optional* | The skill level ID. Defaults to `null`.

### Example

```html
<skill-card-status :currency="4"
                   :level="2"/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import SkillCardStatus from '~/components/SkillCard/SkillCardStatus/SkillCardStatus.vue';

@Component({
    components: {
        SkillCardStatus,
    },
})
export default class GenericComponent extends Vue {}
```