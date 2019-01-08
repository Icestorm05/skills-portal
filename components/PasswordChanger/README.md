# Password Changer

## Functionality

The password changer is a form which allows a user to change their password. The form requires a user to enter their old password, as well as their new password.

### Props

`<password-changer>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `disabled` | Boolean *optional* | Whether or not the input elements are disabled or not. Defaults to `false`.
| `old-password-check` | Function *optional* | An optional function to determine whether or not the old password is valid or not. Takes a password argument, and should return a boolean. Can be async.
| `old-password-check-delay` | Number *optional* | How much input delay there is before executing the `old-password-check` function (in milliseconds). Defaults to `500`.

### Example 1 - Synchronous Validator

```html
<password-changer :old-password-check="passwordValidator"
                  :old-password-check-delay="1000">
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import PasswordChanger from '~/components/PasswordChanger/PasswordChanger.vue';
@Component({
    components: {
        PasswordChanger,
    },
})
export default class GenericComponent extends Vue {

    // Synchronous Validator
    private passwordValidator(password: string) {
        return password === 'test123';
    }

}
```

### Example 2 - Asynchronous Validator

```html
<password-changer :old-password-check="passwordValidator">
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import PasswordChanger from '~/components/PasswordChanger/PasswordChanger.vue';
@Component({
    components: {
        PasswordChanger,
    },
})
export default class GenericComponent extends Vue {

    // Asynchronous Validator
    private passwordValidator(password: string) {
        return new Promise(resolve => {
            window.setTimeout(() => {
                if (password === 'test123') {
                    resolve(true); // Validates it
                } else {
                    resolve(false); // Invalidates it
                    //reject(); // Also works
                }
            }, 500);
        });
    }

}
```