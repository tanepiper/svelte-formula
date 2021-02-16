---
id: fields-input-email

title: 'Input: Email'

sidebar_label: 'Input: Email'
---

- Element [&lt;input type="email">](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email)

## Single Value

#### Required Properties

- `name` - The name of the item should be set
- `type` - Type should be `text`

#### Returned Type

- String

#### Example

```jsx
<script>
  import { formula } from 'svelte-formula';
  const { form, touched, validity } = formula();
</script>

<form use:form>
  <label for='email-input'>Email Input</label>
  <input type='email' required id='email-input' name='email'
         class:error={$touched?.email && $validity?.email?.invalid} />
  <span hidden={$validity?.email?.valid}>{$validity?.email?.message}</span>
</form>
```

## Multi Value

#### Required Properties

- `name` - The name of the item should be set
- `id` - A unique ID for the value
- `type` - Type should be `text`

#### Returned Type

- Array of Strings

#### Example

```jsx
<script>
  import { formula } from 'svelte-formula';
  const { form, touched, validity } = formula();
</script>

<form use:form>
  <label for='email-input-1'>Email Input 1</label>
  <input type='email' required id='email-input-1' name='email'
         class:error={$touched?.email && $validity?.email?.invalid} />

  <label for='email-input-2'>Email Input 2</label>
  <input type='email' required id='email-input-2' name='email'
         class:error={$touched?.email && $validity?.email?.invalid} />

  <span hidden={$validity?.email?.valid}>{$validity?.email?.message}</span>
</form>
```
