---
id: fields-input-text

title: 'Input: Text'

sidebar_label: 'Input: Text'
---

- Element [&lt;input type="text">](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text)

## Single Value

#### Required Properties

- `name` - The name of the item should be set
- `type` - Type should be `email`

#### Returned Type

- String

#### Example

```jsx
<script>
  import { formula } from 'svelte-formula';
  const { form, touched, validity } = formula();
</script>

<form use:form>
  <label for='text-input'>Text Input</label>
  <input type='text' required id='text-input' name='textvalue'
         class:error={$touched?.textvalue && $validity?.textvalue?.invalid} />
  <span hidden={$validity?.textvalue?.valid}>{$validity?.textvalue?.message}</span>
</form>
```

## Multi Value

#### Required Properties

- `name` - The name of the item should be set
- `id` - A unique ID for the value
- `type` - Type should be `email`

#### Returned Type

- Array of Strings

#### Example

```jsx
<script>
  import { formula } from 'svelte-formula';
  const { form, touched, validity } = formula();
</script>

<form use:form>
  <label for='text-input-1'>Text Input 1</label>
  <input type='text' required id='text-input-1' name='textvalue'
         class:error={$touched?.textvalue && $validity?.textvalue?.invalid} />

  <label for='text-input-2'>Text Input 2</label>
  <input type='text' required id='text-input-2' name='textvalue'
         class:error={$touched?.textvalue && $validity?.textvalue?.invalid} />

  <span hidden={$validity?.textvalue?.valid}>{$validity?.textvalue?.message}</span>
</form>
```
