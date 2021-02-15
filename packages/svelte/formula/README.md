# Svelte Formula

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-plugins/main/packages/svelte/formula/logo.png)

[![svelte-formula](https://img.shields.io/npm/v/svelte-formula?label=svelte-formula)](https://www.npmjs.com/package/svelte-formula)

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

| Options | Type     | Description                                                 |
| ------- | -------- | ----------------------------------------------------------- |
| `local` | `string` | Optional locale for `id` sorting when using multiple values |

### Example

The `form` action can be used with any element and not just `<form>` elements - it checks for all child form elements
that have a `name` attribute and return some kind of validity. If used with a form element it will provide values on
submit, as well as the current value of the form.

```sveltehtml

<script>
  import { onDestroy } from 'svelte'
  import { formula } from 'svelte-formula'

  const { form, formValues, submitValues, validity, touched, formValid } = formula();

  const valueSub = formValues.subscribe(values => console.log(values));
  const submitSub = submitValues.subscribe(values => console.log(values));

  function handleSubmit(e) {
    e.preventDefault();
  }

  onDestroy(() => {
    valueSub();
    submitSub();
  })

</script>

<form use:form on:submit={handleSubmit}>
  <div class='form-field'>
    <label for='username'>Username</label>
    <input type='text' id='username' name='username' required />
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

### formValues

The `formValues` store can be subscribed to and will emit every time the user types into, or blurs off from a field. The
value is a `Object` that contains a key/value map of all form fields with the key being the `name` property of the
element

### submitValues

Similar to the `formValues` object, the subscription only emits when a form submit event occurs, and only emits when
using a `<form>` element

### validity

A store that contains a key/value `Object` where again the key is the `name` property. The value is another object with
the following properties

- `valid` - `Boolean` - If the field is valid
- `invalid` - `Boolean` - if the field is invalid
- `message` - `String` - The message returned from the HTML validity
- `errors` - `Object` - A map of errors that are true returned by
  the [Constraint Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#the_constraint_validation_api)
  API.

### formValid

A store that is a single `Boolean` value if the form is currently valid or not - this only emits when the form validity
changes

### touched

A store that updates when fields are marked as touched - contains an `Object` with key/value of `name` and `Boolean`,
fields are added to the store as they receive a `focus` event

### dirty

A store that updates when fields are marked as dirty - contains an `Object` with key/value of `name` and `Boolean`,
fields where the user triggers a `blur` event, and the value has been changed from the original value.

## Roadmap

### Field Type Support

- [x] Support Basic Input fields (text, number, password, email, url) as text values
  - [x] Support multiple named fields with unique `id` attributes, with an array of results sorted by ID alphabetically
  - [ ] Return correct value type for fields (return number as Number value)
- [x] Support Select Fields
  - [x] Support Multiple Select Fields
- [x] Support Radio Fields
- [x] Support Checkbox Fields
  - [x] Support Multiple Checkbox Fields
- [ ] Support the Range input
- [ ] Support the Color input
- [ ] Support the Date / Time / DateTime inputs
- [ ] Support the File input

### Other Items

- [ ] Add Unit Tests
- [ ] Add full documentation

Icon made by [Eucalyp](https://creativemarket.com/eucalyp) from [flaticon.com](https://www.flaticon.com)
