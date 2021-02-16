---
id: options

title: Formula Options

sidebar_label: Formula Options
---

Formula is zero-configuration - Out-of-the-box - using standard HTML5 validation properties to build up its validation
rules - however it is also possible to pass custom validation rules via the `formula()` options object.

### `locale`

Sets the locale of the form - currently only used in field index sorting for multi-value fields

### `validators`

An Object containing a key that is the field `name` to apply the validation to, the value is another object that
contains each named validation function. The result are made available in the `validity` store.

### `formValidators`

An Object containing a key that is the name of the validation rule, and the function that returns the validation result.
The results are available in the `formValidity` store

When using custom `validators`

## Example

```jsx

<script>
  import { formula } from 'svelte-formula';
  import { passwordStrength } from './libs/password.ts';

  export let minPasswordStength = 85;

  const { form, validity, formValidity } = formula({
    locale: 'de',
    validators: {
      // Can provide multiple methods where the value can be checked
      username: {
        inDomain: (value) => value.include('@tinynodes.dev') ? null : 'You can only sign up with an account in the @tinynodes.dev domain'
      },
      // Methods can call functions to do other types of validations specific to your domain
      password: {
        isStrong: (value) => passwordStrength(value) >= minPasswordStength ? null : 'You must enter a stronger password'
      },
      // Methods also support multi-value fields where you can validation all values
      invoices: {
        isValidInvoiceId: (values) => values.every(value => value.includes('INV-')) ? null : `Incorrect invoice lines: ${values.map((value, index) => value.includes('INV-') ? (index + 1) : 0).join(', ')}`
      }
    },
    formValidators: {
      // With form validators you can compare values
      passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Your passwords must match',
      // Or check conditions between values across the form
      didTickConfirm: (values) => Boolean(values.createAccount) && Boolean(values.agreeTandCs) ? null : 'You must agree to Terms & Conditions before creating an account'
    }
  });
</script>

<!-- You can access the errors via the validity store - it contains both valid and invalid values, a message and an errors object with each error key -->
<div class:error={$validity?.username?.invalid} hidden='{$validity?.username?.valid}'>
  {$validity?.username?.message}
</div>

<!-- For form validity messages the key will either be null, or a truthy message -->
<div class:error={$formValidity?.passwordsMatch} hidden={$formValidity?.passwordsMatch}>
  {$formValidity?.passwordsMatch}
</div>
```
