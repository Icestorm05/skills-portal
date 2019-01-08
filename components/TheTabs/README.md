# The Tabs

## Functionality

The tabs component displays a list of routes available in the application. These routes include: `Your Profile`, `Your Skills`, `Your Available Skills` and `Your Team` (optional). This component should only be used once within the lifecycle of this application.

## Usage

### Props

`<the-tabs>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `color` | String *optional* | The color of each tab. Defaults to `secondary`. Accepts any of: `primary`, `accent`, `secondary`, `info`, `warning`, `error` or `success`.
| `hasTeam` | Boolean *optional* | Whether or not to display the team tab or not. Defaults to `false`.
| `sliderColor` | String *optional* | The slider color of the selected tab. Defaults to `warning`. Accepts any of: `primary`, `accent`, `secondary`, `info`, `warning`, `error` or `success`.

### Example

```html
<the-tabs/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import TheTabs from '~/components/TheTabs/TheTabs.vue';

@Component({
    components: {
        TheTabs,
    },
})
export default class GenericComponent extends Vue {}
```