# Scroll Button

## Functionality

The scroll button component displays a fab, which scrolls to and from specified elements.

### Props

`<scroll-button>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `bottom` | String | The element to scroll to when at the top of the page.
| `top` | String | The element to scroll to when not at the top of the page.
| `offset` | Number *optional* | The scroll offset. This can be useful when there is a fixed element on the page. Defaults to `-150`.

### Example

```html
<div>
    <nav id="nav" height="100" style="position: fixed;">Navigation</nav>
    <div id="top" height="1000">Top Content</div>
    <div class="bottom" height="1000">Bottom Content</div>
    <scroll-button bottom=".bottom" top="#top" :offset="-100"/>
</div>
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import ScrollButton from '~/components/ScrollButton/ScrollButton.vue';
@Component({
    components: {
        ScrollButton,
    },
})
export default class GenericComponent extends Vue {}
```