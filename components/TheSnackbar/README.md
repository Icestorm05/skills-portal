# The Snackbar

## Functionality

The snackbar displays a notification message on the bottom of the user's browser screen. By default, the snackbar will stay open for 5 seconds, before emitting a hide event. This component should only be used once within the lifecycle of this application.

## Usage

### Props

`<the-snackbar>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `color` | String *optional* | The color of the snackbar. Defaults to `primary`. Accepts any of: `primary`, `accent`, `secondary`, `info`, `warning`, `error` or `success`.
| `timeout` | Number *optional* | How long the snackbar will stay open for. An event will be emitted once this period elapses.
| `visible` | Boolean | Whether the snackbar is visible or not.

### Events

`<the-snackbar>` emits the following events:

| event | description
| --- | ---
`timeout-elapsed` | Event called when the timeout period has elapsed.

### Slots

`<the-snackbar>` exposes the following slots:

| slot | description
| --- | ---
`default` | The message to display.

### Example

```html
<the-snackbar color="error"
              :timeout="6000"
              :visibility="snackbarVisibility"
              @timeout-elapsed="snackbarVisibility = false">Whoops! Something went wrong.</the-snackbar>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import TheSnackbar from '~/components/TheSnackbar/TheSnackbar.vue';

@Component({
    components: {
        TheSnackbar,
    },
})
export default class GenericComponent extends Vue {
    private snackbarVisibility = true;
}
```