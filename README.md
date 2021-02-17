# Svelte Formula

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-plugins/main/packages/svelte/formula/logo.png)

[![svelte-formula](https://img.shields.io/npm/v/svelte-formula?label=svelte-formula)](https://www.npmjs.com/package/svelte-formula)

[Documentation](https://tanepiper.github.io/svelte-formula/)

Formula is a zero-configuration reactive form library for Svelte, currently in early development.

This library uses HTML form attributes to do validation, and works with the localised message from the browser.

## Install Instructions

`npm i svelte-formula`

## Usage

To use Formula, create the directive and store values by calling the `formula()` method in the library, this returns
the `form` action and the available stores.

### Options

While the library is zero-configuration it does support options which can be passed as an object to the `formula`
constructor method.

| Options          | Type     | Description                                                                                                   |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `locale`         | `String` | Optional locale for `id` sorting when using multiple values                                                   |
| `messages`       | `Object` | An object containing a key for each named field and an object containing key/value text with replacement text |
| `validators`     | `Object` | An object containing custom validators for fields                                                             |
| `formValidators` | `Object` | An object containing custom validators for the form                                                           |

### Example

The `form` action can be used with any element and not just `<form>` elements - it checks for all child form elements
that have a `name` attribute and return some kind of validity. If used with a form element it will provide values on
submit, as well as the current value of the form.

```sveltehtml

<script>
  import { formula } from 'svelte-formula'

  const { form, formValues, submitValues, validity, touched, formValid } = formula();

  $: console.log($formValues);
  $: console.log($submitValues);

  function handleSubmit(e) {
    e.preventDefault();
  }


</script>

<form use:form on:submit={handleSubmit}>
  <div class='form-field'>
    <label for='username'>Username</label>
    <input type='email' id='username' name='username' required />
    <span hidden={$validity?.username?.valid}>{ validity?.username?.message }</span>
  </div>
  <div class='form-field'>
    <label for='password'>Password</label>
    <input type='password' id='password' name='password' required minlength='8' />
    <span hidden={$validity?.password?.valid}>{ validity?.password?.message }</span>
  </div>

  <button disabled={!$formValid}>Save</button>
</form>
```

## Stores

### dirty

A store that updates when fields are marked as dirty - contains an `Object` with key/value of `name` and `Boolean`,
fields where the user triggers a `blur` event, and the value has been changed from the original value.

### formValues

The `formValues` store can be subscribed to and will emit every time the user types into, or blurs off from a field. The
value is a `Object` that contains a key/value map of all form fields with the key being the `name` property of the
element

### formValidity

A store that contains a key/value `Object` of errors on the form when using `formValidators` - unlike `validity` this
only contains a key and string value that is any message from the validator.

### isFormValid

A store that is a single `Boolean` value if the form is currently valid or not - this only emits when the form validity
changes

### submitValues

Similar to the `formValues` object, the subscription only emits when a form submit event occurs, and only emits when
using a `<form>` element

### touched

A store that updates when fields are marked as touched - contains an `Object` with key/value of `name` and `Boolean`,
fields are added to the store as they receive a `focus` event

### validity

A store that contains a key/value `Object` where again the key is the `name` property. The value is another object with
the following properties

- `valid` - `Boolean` - If the field is valid
- `invalid` - `Boolean` - if the field is invalid
- `message` - `String` - The message returned from the HTML validity
- `errors` - `Object` - A map of errors that are true returned by
  the [Constraint Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#the_constraint_validation_api)
  API, or from custom `validators` in the options.

## Custom Field Validations

While Formula is zero-config and uses validations set on the HTML5 elements, it's also possible to provide custom
validations via the `validations` option passed to `formula` on initialisation.

First provide the `name` of the field as a key, and the value as an `Object` - each object contains further keys per
error, and a function that does the validation - the result should be a `string` if it fails, or `null` if it passes.

Custom validation will always be added to the `errors` object, however the `message` - HTML validations will always take
precedence over custom validations (e.g. `<input required>` message will always be before your custom message)

Custom validators also support multi-value fields, but in this case an `id` must be set on each field to provide
uniqueness (such as an index value)

### Custom Validation Text & Localisation

It's possible to provide custom localisation or text for error messages, they can be provided two ways:

- In the `formula` constructor pass a `messages` object. They key should be the `name` of the field. The value is
  an `Object` containing the key of the error the message is for, and the value the replacement string.

- In the HTML add a `data-*` property for the value, separating any camel case values with a hyphen (e.g. `valueMissing`
  becomes `data-value-missing`)

In order of precedence, the data value will always come before the constructor options

### Example

```sveltehtml

<script>
  import { formula } from 'svelte-formula';

  const { form, validity } = formula({
    messages: {
      username: {
        valueMissing: 'You really should put an email address in'
      }
    },
    validators: {
      username: {
        inCompanyDomain: (value: string) => value.includes('@ourdomain.com') ? null : 'Your username must contain an @ourdomain.com email'
      },
      invoiceIds: {
        validInvoiceId: (values: string[]) => values.every(value => value.startsWith('INV-')) ? null : 'Your invoice IDs must start with INV-'
      }
    }
  });
</script>
<form use:form>
  <label for='signup-username'>Username</label>
  <input type='email' name='username' id='signup-username' required minlength='8'
         data-value-missing='This error message will appear before the one in the options' />
  <div hidden={$validity?.email?.valid}>{$validity?.email?.message}</div>

  <input type='text' name='invoiceIds' id='1' />
  <input type='text' name='invoiceIds' id='2' />
  <input type='text' name='invoiceIds' id='3' />
</form>

```

## Form Level Validation

Form level validations can also be provided using `formValidators` - these validators are passed the entire set of
values and allow for validation across different values (like password matching, or ensuring a selection is made in one
field based on another form field condition)

```sveltehtml

<script>
  import { formula } from 'svelte-formula';

  const { form, formValidity } = formula({
    formValidators: {
      passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Your passwords must match'
    }
  })
</script>
<form use:form>
  <input type='password' name='password' required minlength='8'>
  <input type='password' name='passwordMatch' required minlength='8'>
  <div hidden={!$formValidity?.passwordsMatch}>{$formValidity?.passwordsMatch}</div>
</form>
```

## Roadmap

### Field Type Support

- [x] Support Basic Input fields (text, number, password, email, url) as text values
  - [x] Support multiple named fields with unique `id` attributes, with an array of results sorted by ID alphabetically
  - [x] Return correct value type for fields (return number as Number value)
- [x] Support Select Fields
  - [x] Support Multiple Select Fields
- [x] Support Radio Fields
- [x] Support Checkbox Fields
  - [x] Support Multiple Checkbox Fields
- [x] Support the Range input
- [x] Support the Color input
- [x] Support the Date / Time inputs
- [x] Support the File input

### Validation

- [x] Custom field-level validation via `formula` options
- [x] Custom form-level validation via `formula` options
- [x] Support for localised messages for validation errors

### Other Items

- [ ] Add Unit Tests - IN PROGRESS
- [ ] Add full documentation - IN PROGRESS

Icon made by [Eucalyp](https://creativemarket.com/eucalyp) from [flaticon.com](https://www.flaticon.com)
