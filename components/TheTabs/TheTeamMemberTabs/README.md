# The Team Member Tabs

## Functionality

The team member tabs component displays a list of routes available in the application. These routes include a member's: `Profile`, `Unapproved Skills`, `Approved Skills`, `Available Skills` and `Team`. This component should only be used once within the lifecycle of this application.

## Usage

### Props

`<the-team-member-tabs>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `color` | String *optional* | The color of each tab. Defaults to `secondary`. Accepts any of: `primary`, `accent`, `secondary`, `info`, `warning`, `error` or `success`.
| `hasTeam` | Boolean *optional* | Whether or not to display the team tab or not. Defaults to `false`.
| `prefix` | String | The text to display before the name of the tab item.
| `sliderColor` | String *optional* | The slider color of the selected tab. Defaults to `warning`. Accepts any of: `primary`, `accent`, `secondary`, `info`, `warning`, `error` or `success`.

### Example

```html
<the-team-member-tabs prefix="John's"/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import TheTeamMemberTabs from '~/components/TheTabs/TheTeamMemberTabs/TheTeamMemberTabs.vue';

@Component({
    components: {
        TheTeamMemberTabs,
    },
})
export default class GenericComponent extends Vue {}
```