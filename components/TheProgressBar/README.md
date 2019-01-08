# The Progress Bar

## Functionality

The progress bar displays an indeterminate linear progress bar. This component should only be used once within the lifecycle of this application.

## Usage

### Props

`<the-progress-bar>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `color` | String *optional* | The color of the progress bar. Defaults to `secondary`. Accepts any of: `primary`, `accent`, `secondary`, `info`, `warning`, `error` or `success`.
| `height` | Number *optional* | The height of the progress bar. Defaults to `3`.

### Example

```html
<the-progress-bar v-if="display"
                  color="error"
                  :height="5"/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import TheProgressBar from '~/components/TheProgressBar/TheProgressBar.vue';

@Component({
    components: {
        TheProgressBar,
    },
})
export default class GenericComponent extends Vue {
    private display = false;

    // Show the progress bar, for 3 seconds.
    private mounted() {
        this.display = true;
        window.setTimeout(() => this.display = false, 3000);
    }
}
```