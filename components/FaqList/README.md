# FAQ List

## Functionality

The FAQ list component displays a list of questions as expansion panels.

### Props

`<faq-list>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `faqs` | Array | The array of question objects. Each question object should follow the faq schema.
| `lazy` | Boolean *optional* | Whether to render the expansion panels lazily or not. Defaults to `true`.

### Schemas

The `faqs` prop should contain an array of objects, which adhere to the following schema:

#### Question Schema

| attribute | type | description
| --- | --- | ---
| `question` | String | The question.
| `answers` | Array | The array of answers. Each answer should follow the FAQ Answer schema.

#### Answer Schema

| attribute | type | description
| --- | --- | ---
| `type` | String | The tag to display the answer as. Accepts either: `p`, `b`, `ul` or `table`.
| `text` | String OR Array | The answer or array of answers. If the type is `p` or `b`, a string is expected. If the type is `ul`, an array is expected. If the type is `table`, an array of arrays is expected.

### Example

```html
<faq-list :faqs="faqs">
```

```ts
import Vue from 'vue';
import Component from 'nuxt-class-component';
import FaqList from '~/components/FaqList/FaqList.vue';
@Component({
    components: {
        FaqList,
    },
})
export default class GenericComponent extends Vue {
    private faqs = [{
        question: 'Test Question',
        answers: [{
            type: 'b',
            text: 'Test Answer',
        }, {
            type: 'table',
            text: [['row1-col1', 'row1-col2'], ['row2-col1', 'row2-col2']],
        }, {
            type: 'ul',
            text: ['Item 1', 'Item 2'],
        }, {
            type: 'p',
            text: 'Test Paragraph',
        }],
    }]
}
```