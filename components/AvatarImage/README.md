# Avatar Image

## Functionality

The avatar image component attempts to display an image, with a fallback if failed.

### Props

`<avatar-image>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `defaultImagePrefix` | String *optional* | The URL to prefix to the default image.
| `defaultImageName` | String *optional* | The name of the fallback image. Defaults to `765-default-avatar`.
| `defaultImageExtension` | String *optional* | The extension of the fallback image. Defaults to `jpg`.
| `renderDefaultImageAsBase64` | Boolean *optional* | Whether to render the fallback image as base64 or not. Defaults to `false`.

| `prefix` | String *optional* | The URL to prefix to the image. Defaults to `avatars`.
| `imageName` | String *optional* | The name of the image. If no image is specified, it will default to the fallback image.
| `extension` | String *optional* | The extension of the image. Defaults to `jpg`.
| `renderAsBase64` | Boolean *optional* | Whether to render the image as base64 or not. Defaults to `true`.

### Example

```html
<!-- This will try to render an img tag as base64 using avatarImages/John_Doe.gif.
     If it errors, it will instead render an img tag as base64 using images/fallback.png. -->
<avatar-image defaultImagePrefix="images"
              defaultImageName="fallback"
              defaultImageExtension="png"
              renderDefaultImageAsBase64
              prefix="avatarImages"
              imageName="John_Doe"
              extension="gif"
              renderAsBase64/>
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import AvatarImage from '~/components/AvatarImage/AvatarImage.vue';
@Component({
    components: {
        AvatarImage,
    },
})
export default class GenericComponent extends Vue {}
```