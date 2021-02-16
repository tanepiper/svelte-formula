# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] 2021-02-16

### Changed

- Large Internal refactoring of the code

## [0.3.0] 2021-02-15

### Added

- Support for `range`, `color`, `date`, `time`, `week` inputs
- Support for `file` input

### Changed

- `number` input type returns a number value, or `undefined` if not set

## [0.2.0] 2021-02-15

### Changed

- `formValid` now `isFormValid`

### Added

- Support for custom field-level validators via the `validators` property of the `formula` options. Validators are
  provided as an object - the key is the `name` of the fields, and the value is another object containing the
  validators. Each validator is has a key that is the name of the validation and a function that returns a string if the
  validation fails or
  `null` if it passes. The string message is used to display the message, the key is added to the `errors` object
  in `validity`

  ```sveltehtml
  <script>
  import { formula } from 'svelte-formula'
  import { calculateStrong } from '../libs/password'
   const { form, formValues, submitValues, validity, touched, dirty, formValid } = formula({
        validators: {
            password: {
              isStrong: (value: string) => calculateStrong(value) ? null : 'Your password is too weak'
            },
            'invoice-ids': {
              invoicePrefix: (values: string[]) => values.every(value => value.startsWith('INV-')) ? null : 'Your invoice IDs must all begin with INV-'
            }
        }
  });
  </script>

  ...
  <input type='password' name='password' required minlength='8' class:error={$touched?.password && $validity?.username?.invalid}/>
  <div hidden={$validity?.password?.valid}>{$validity?.password?.message}</div>
  <div hidden={$validity?.password?.errors?.isStrong}>You have a strong password!</div>
  ...

  <input type='text' id='invoice-1' name='invoice-ids' />
  <input type='text' id='invoice-2' name='invoice-ids' />
  <input type='text' id='invoice-3' name='invoice-ids' />
   <div hidden={$validity?.['invoice-ids']?.valid}>{$validity?.['invoice-ids']?.message}</div>
  ```

- Support for custom form-level validators via the `formValidators` property of the `formula` options. Validators are
  provided as an object - Each validator has a key that is the name of the validation, and a function that returns a
  string if the validation fails or
  `null` if it passes. The error message are available via the `formValidity` store.

  ```sveltehtml
  <script>
  import { formula } from 'svelte-formula'
  const { form, submitValues, submitValidity, formValid } = formula({
    formValidators: {
      passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Your passwords must match'
    }
  })
  </script>

  <input type='password' name='password' required minlength='8'>
  <input type='password' name='passwordMatch' required minlength='8'>
  <div hidden='{!$submitValidity?.passwordsMatch}'>{$submitValidity?.passwordsMatch}</div>
  ```

### Fixed

- Correctly pass options to form creation

## [0.1.1] 2021-02-15

### Added

- First config option for `formula` - allowing the locale for sorting to be overridden if you don't want to use the
  users own locale

- Support for multiple input types that are not checkboxes (e.g `text`, `number`, etc) - when using this each input with
  the same name REQUIRES and `id` property. Returns an array sorted on the `id` property alphabetically in the users'
  locale if detected (and always falls back to `en` if not), if this needs to be overridden it can be passed to the
  formula constructor (e.g `formula({ locale: 'de' });`)

## [0.1.0] 2021-02-15

### Added

- Add support for `<input type="radio">` - allows multiple radios of the same name and returns a string of the currently
  selected value
- Add support for `<select>` fields for both single and multi-value select fields - if a single value returns a string,
  if set to `multiple` returns an array of strings
- Added support for `<input type="checkbox">` - if a single value returns a boolean value for the checked state, if
  there are multiple checkboxes of the same name it returns an array of the selected values
- Added `dirty` store that fires when a value is changed, and the selected field is blurred away from

### Changed

- Internal refactor of code to clean up and make it easier to add features

## [0.0.4] 2021-02-13

### Added

- Added support for `touched` elements

### Changed

- `values` becomes `formValues`
- `submit` becomes `submitValues`

## [0.0.1] 2021-02-12

### Added

- Initial release
