---
id: stores

title: Formula Stores

sidebar_label: Formula Stores
---

All the stores listed below are Svelte Writable Stores.

## `dirty`

### Structure

- Key - Single key for each `name` in the form, is a single key for both single and field groups
- Value - Boolean value if the field value has been changed from the original value

### Emits

Emits when a user changes a field value then blurs

#### Example

```jsx
<script>
  import {formula} from 'svelte-formula';
  const {form, dirty} = formula();
</script>
<form use:form>
  <label for='text-input'>Text Input</label>
  <input type='text' required id='text-input' name='textvalue' />
  <span hidden={!$dirty?.textvalue}>The value of this field has been changed</span>
</form>
```

## `formValidity`

### Structure

- Key - Single key that is the name of the validation passed to `formValidators`
- Value - A string value if validation has failed, or `null` if it passes

### Emits

Emits when a user changes a value, then custom `formValidators` have been passed

#### Example

```jsx
<script>
  import {formula} from 'svelte-formula';
  const {form, formValidity} = formula({
  formValidators: {
  passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Your passwords do not match'
}
});
</script>
<form use:form>
  <label for='password'>Password</label>
  <input type='password' required id='password' name='password' />
  <label for='passwordMatch'>Password Match</label>
  <input type='password' required id='passwordMatch' name='passwordMatch' />

  <span hidden={!$formValidity?.passwordsMatch}>{$formValidity?.passwordsMatch}</span>
</form>
```

## `formValues`

### Structure

- Key - Single key for each `name` in the form, is a single key for both single and field groups
- Value - Single value or Array of values from the fields

### Emits

Emits when a user changes a value anywhere in the form

#### Example

```jsx
<script>
  import {formula} from 'svelte-formula';
  const {form, formValues} = formula();

  let total = 0;
  $: formValues.subscribe(values => {
  total = values?.value1 + values?.value2
});
</script>
<form use:form>
  <label for='value-1'>Value 1</label>
  <input type='number' required id='value-1' name='value1' />
  <label for='value-2'>Value 2</label>
  <input type='number' required id='value-2' name='value2' />

  <div>{$formValues?.value1} + {$formValues?.value2} = {total}</div>
</form>
```

## `isFormValid`

### Structure

- A single boolean value

### Emits

When form validity changes

#### Example

```jsx
<script>
  import {formula} from 'svelte-formula';
  const {form, isFormValid} = formula();
</script>
<form use:form>
  <label for='password'>Password</label>
  <input type='password' required id='password' name='password' />
  <label for='passwordMatch'>Password Match</label>
  <input type='password' required id='passwordMatch' name='passwordMatch' />

  <button disabled={!$isFormValid}>Submit</button>
</form>
```

## `submitValues`

### Structure

- Key - Single key for each `name` in the form, is a single key for both single and field groups
- Value - Single value or Array of values from the fields

### Emits

Emits when a user submits a `<form>` element

#### Example

```jsx
<script>
  import {formula} from 'svelte-formula';
  const {form, submitValues} = formula();
  const {apiCall} from './api-service.ts'

  $: submitValues.subscribe(values => {
  apiCall(values).then(result => {

  })
});
</script>
<form use:form>
  <label for='password'>Password</label>
  <input type='password' required id='password' name='password' />
  <label for='passwordMatch'>Password Match</label>
  <input type='password' required id='passwordMatch' name='passwordMatch' />

  <button type='submit'>Submit</button>
</form>
```

## `touched`

### Structure

- Key - Single key for each `name` in the form, is a single key for both single and field groups
- Value - Boolean value if the field has been touched

### Emits

Emits when a user focuses on a field

#### Example

```jsx
<script>
  import {formula} from 'svelte-formula';
  const {form, touched} = formula();
</script>
<form use:form>
  <label for='text-input'>Text Input</label>
  <input type='text' required id='text-input' name='textvalue' />
  <span hidden={!$touched?.textvalue}>The text input field has been touched</span>
</form>
```

## `validity`

### Structure

- Key - Single key for each `name` in the form, is a single key for both single and field groups
- Value - An Object containing
  - `valid` - Boolean value if the field is valid
  - `invalid` - Boolean valid if the field is invalid
  - `message` - An text message returned by the validation - this will always be the most prominent message, HTML
    validation takes precedence over custom validation
  - `errors` - A key/value object containing keys of all errors applied to this field from both HTML and custom
    validation

### Emits

Emits when a user changes a value anywhere in the form

#### Example

```jsx
<script>
  import {formula} from 'svelte-formula';
  const {form, validity} = formula();
</script>
<form use:form>
  <label for='text-input'>Text Input</label>
  <input type='text' required id='text-input' name='textvalue' />
  <span hidden={!$validity?.textvalue?.valid}>{$validity?.textvalue?.message}</span>
</form>
```
