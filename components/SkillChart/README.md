# Skill Chart

## Functionality

The skill chart is a sunburst chart created in d3. The chart displays a hierarchy of skills in an arc, from skill category to the level/currency of a skill. The width of the arc is calculated by the `SkillCurrencyID` and `SkillLevelId` of a skill.

### Dependencies

`<skill-chart>` has a dependency on `<skill-chart-breadcrumbs>`, `<skill-chart-legend>` and `<skill-chart-title>`.

### Props

`<skill-chart>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| height | Number *optional* | The height of the chart. Defaults to `600`.
| responsive | Boolean *optional* | Whether to make the chart responsive or not. Defaults to `true`.
| skills | Array | The array of skill categories and saved skills.
| width | Number *optional* | The width of the chart. Defaults to `750`.

### Schemas

The `skills` prop requires either of the following objects to exist within the array:

#### Skill Category Schema

| attribute | type | description
| --- | --- | ---
| `name` | String | The name of the skill category.
| `children` | Array | An array of further skill or skill categories. **Must** eventually lead down to a saved skill schema object.

#### Saved Skill Schema

| attribute | type | description
| --- | --- | ---
| `name` | String | The name of the skill.
| `SkillCurrencyId` | Number | The ID of the currency. 2 maps to `Current`. 3 maps to `Fading`. 4 maps to `Historic`.
| `SkillLevelId` | Number | The ID of the level. 2 maps to `Awareness`. 3 maps to `Practitioner`. 4 maps to `Expert`.

### Example

```html
<skill-chart :height="500"
             :responsive="false"
             :skills="skills"
             :width="600"/>
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import SkillChart from '~/components/SkillChart/SkillChart.vue';
@Component({
    components: {
        SkillChart,
    },
})
export default class GenericComponent extends Vue {
    private skills = [{
        name: 'Skill Category 1',
        children: [{
            name: 'Skill Subcategory 1',
            children: [{
                name: 'Skill 1',
                SkillCurrencyId: 3,
                SkillLevelId: 3,
            }, {
                name: 'Skill 2',
                SkillCurrencyId: 2,
                SkillLevelId: 4,
            }]
        }]
    }]
}
```