# Skill Chart Legend

## Functionality

The skill chart legend displays a legend for the skill chart component.

### Props

`<skill-chart-legend>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| height | Number *optional* | The height of each legend item. Defaults to `30`.
| padding-x | Number *optional* | The amount to pad the text inside each legend item. Defaults to `10`.
| padding-y | Number *optional* | The amount of padding between each legend item. Defaults to `3`.
| radius | Number *optional* | The amount of border radius on each legend item. Defaults to `3`.

### Example

```html
<skill-chart-legend :height="40"
                    :padding-x="15"
                    :padding-y="5"
                    :radius="5"/>
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import SkillChartLegend from '~/components/SkillChart/SkillChartLegend/SkillChartLegend.vue';
@Component({
    components: {
        SkillChartLegend,
    },
})
export default class GenericComponent extends Vue {}
```