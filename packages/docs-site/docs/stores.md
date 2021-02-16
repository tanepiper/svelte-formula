---
id: stores

title: Formula Stores

sidebar_label: Formula Stores
---

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
