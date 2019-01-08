# The Toolbar

## Functionality

The toolbar displays the skills portal logo. When logged in, it also displays: the avatar of the user logged in, a logout button, and a slot for a tabs component. This component should only be used once within the lifecycle of this application.

### Props

`<the-toolbar>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `color` | String *optional* | The color of the toolbar. Defaults to `primary`. Accepts any of: `primary`, `accent`, `secondary`, `info`, `warning`, `error` or `success`.
| `isLoggedIn` | Boolean *optional* | Whether to display the logged in restricted components or not. Defaults to `false`.

### Events

`<the-toolbar>` exposes the following events:

| event | description
| --- | ---
| `avatar-click` | Fired when the avatar is clicked.
| `help-click` | Fired when the help button is clicked.
| `logo-click` | Fired when the logo is clicked.
| `logout-click` | Fired when the logout button is clicked.

### Slots

`<the-toolbar>` exposes the following slots:

| slot | description
| --- | ---
`tabs` | The tabs to display in the extension of the toolbar.

### Example

```html
<the-toolbar color="secondary"
             @avatar-click="home"
             @help-click="help"
             @logo-click="home"
             @logout-click="logout">
    <nav slot="tabs">
        <a href="/test">Test Page</a>
    </nav>
</the-toolbar>
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import TheToolbar from '~/components/TheToolbar/TheToolbar.vue';
@Component({
    components: {
        TheToolbar
    }
})
export default class GenericComponent extends Vue {
    private help() {
        this.$router.push('/faq');
    }
    private home() {
        this.$router.push('/');
    }
    private logout() {
        this.$router.push('/login');
    }
}
```