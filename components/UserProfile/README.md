# User Profile

## Functionality

The user profile component displays all of a user's profile details. Also, allows a user to edit their biography.

## Usage

### Props

`<user-profile>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `disabled` | Boolean *optional* | Whether or not the buttons are disabled or not. Defaults to `false`.
| `editable` | Boolean *optional* | Whether the biography can be edited or not. Defaults to `false`.
| `profile` | Object | The user profile.

### Events

`<user-profile>` emits the following events:
| event | type | description
| --- | --- | ---
| `updated-biography` | String | The updated biography.

### Schemas

The `profile` prop requires the following to exist within the object:

| attribute | type | description
| --- | --- | ---
| `Biography` | String | The biography of the profile.
| `Company` | String | The company the owner of the profile works for.
| `Director` | String | The director of the owner of the profile.
| `EmailAddress` | String | The email address of the owner of the profile.
| `FirstLineReporting` | String | The person who is the first line reporting for the owner of the profile.
| `FullName` | String | The full name of the person who owns the profile.
| `JobTitle` | String | The job title of the person who owns the profile.
| `SecondLineReporting` | String | The person who is the second line reporting for the owner of the profile.

### Example

```html
<user-profile profile="profile"
              readonly
              @updated-biography="updateBio"/>
```

```ts
import Component from 'nuxt-class-component';
import Vue from 'vue';

import UserProfile from '~/components/UserProfile/UserProfile.vue';

@Component({
    components: {
        UserProfile,
    },
})
export default class GenericComponent extends Vue {
    private profile = {
        Biography: 'This is a test biography',
        Company: 'BAS Perm',
        Director: 'Janet Doe',
        EmailAddress: 'John.Doe@test.com',
        FirstLineReporting: 'Jake Doe',
        FullName: 'John Doe',
        JobTitle: 'Innovation Developer',
        SecondLineReporting: 'Jane Doe',
    }

    private updateBio(biography: string) {
        console.log(biography);
    }
}
```