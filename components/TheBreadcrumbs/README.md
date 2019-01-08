# The Breadcrumbs

## Functionality

The breadcrumbs component displays a list of profiles divided by a `/`. It is calculated using a profile object passed in, and the Employee ID to find the route to. This component should only be used once within the lifecycle of this application.

## Usage

### Props

`<the-breadcrumbs>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `employee-id` | Number | The Employee ID to find a route to within the Profile object. This will typically be the employee you are currently viewing.
| `profile` | Object | The profile object used to create a route from.
| `route-name` | String | The name of the route to navigate all breadcrumbs to. Expects the route to take an `id` parameter.

### Schemas

The `profile` prop requires the following to exist within the object:

| attribute | type | description
| --- | --- | ---
| `EmployeeId` | Number | The employee ID of the profile.
| `FullName` | String | The full name of the employee. This name will be displayed as the text for the breadcrumb link.
| `children` | Array | An array of further profile objects.

### Example

```html
<the-breadcrumbs :employee-id="3"
                 :profile="profile"
                 route-name="id-profile"/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import TheBreadcrumbs from '~/components/TheBreadcrumbs/TheBreadcrumbs.vue';

@Component({
    components: {
        TheBreadcrumbs,
    },
})
export default class GenericComponent extends Vue {
    private profile = {
        EmployeeId: 1,
        FullName: 'John Doe',
        children: [{
            EmployeeId: 2,
            FullName: 'Jane Doe',
        }, {
            EmployeeId: 3,
            FullName: 'Jake Doe',
        }]
    }
}
```