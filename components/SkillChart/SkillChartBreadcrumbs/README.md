# Skill Chart Breadcrumbs

## Functionality

The skill chart breadcrumbs displays a path to the current skill or skill category.

### Props

`<skill-chart>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| height | Number *optional* | The height of the breadcrumbs. Defaults to `30`.
| sequence | Array | The sequence of nodes to get to a certain skill or skill category.

### Example

```html
<skill-chart-breadcrumbs :height="40"
                         :sequence="sequence"/>
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import SkillChartBreadcrumbs from '~/components/SkillChart/SkillChartBreadcrumbs/SkillChartBreadcrumbs.vue';
import { hierarchy } from 'd3';
@Component({
    components: {
        SkillChartBreadcrumbs,
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
    }];

    // Convert skill array into a hierarchy
    private hierarchy = hierarchy({name: 'Skills', children: this.skills});

    // Grab a skill from the hierarchy
    // Done by getting all leaves (the lowest level nodes), and grab the first one. This will be 'Skill 1'
    private skill = this.hierarchy.leaves()[0];

    // Get the path from the bottom level to the top level
    // Reverse it to display it from top to bottom
    // Slice off the first element, which is just the 'Skills' container passed into the hierarchy function
    // This will be Skill Category 1 > Skill Subcategory 1 > Skill 1
    private sequence = skill.ancestors().reverse().slice(1);
}
```