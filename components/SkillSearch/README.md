# Skill Search

## Functionality

The skill search component displays a search input field, which allows for multiple queries to be entered.

## Usage

### Props

`<skill-search>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `autocomplete-items` | Array *optional* | The array of autocomplete items. Can either contain an array of strings, or an array of objects.
| `autocomplete-item-key` | String *optional* | The key containing the value to display for each object in the `autocomplete-items` array. The value should be a string.
| `autocomplete-item-tags-key` | String *optional* | The key containing the tags to display for each item. The value should be an array of strings.
| `search-value` | Array | The default value of the input field. Can also be bound to using `v-model`.
| `legend` | Object | The legend to apply colors to. Is used to map autocomplete tags to colors.

### Events

`<skill-search>` emits the following events:

| event | type | description
| --- | --- | ---
| `search-value-updated` | Array | The updated search values. If the `search-value` prop was bound to using `v-model`, the variable will automatically update.

### Example

```html
<skill-search v-model="filters"
              :autocomplete-items="autocompleteItems"
              autocomplete-item-key="name"
              autocomplete-item-tags-key="tags"
              :legend="legend"
              @search-value-updated="filtersUpdated" />
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import SkillSearch from '~/components/SkillSearch/SkillSearch.vue';

@Component({
    components: {
        SkillSearch,
    },
})
export default class GenericComponent extends Vue {
    private autocompleteItems = [{
        name: 'Item 1',
        tags: ['Parent 1', 'Parent 2'],
    }, {
        name: 'Item 2',
        tags: ['Parent 1', 'Parent 2'],
    }];
    private legend = {
        'Parent 1': 'blue',
        'Parent 2': 'red',
    };
    private filters = [];

    private filtersUpdated(updatedFilters) {
        updatedFilters.forEach(updatedFilter => {
            console.log(updatedFilter.name);
            console.log(updatedFilter.tags);
        });
    }
}
```
