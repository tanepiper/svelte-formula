---
id: options

title: Formula Options

sidebar_label: Formula Options
---

Formula is zero-configuration - Out-of-the-box - using standard HTML5 validation properties to build up its validation
rules - however it is also possible to pass custom validation rules via the `formula()` options object.

## `defaultValues`

The `defaultValues` option allows an initial set of values to be passed to the form.

Form values can also be set with defaults using `<input bind:value={myValue}>`, if no value it set it will fall back to
this value. If there is no value, then it will be an empty string or array value.

```svelte
<script>
  import { formula } from 'svelte-forms';

  const { form } = formula({
    defaultValues: {
      content: 'Hello World!'
    }
  })
</script>

<div use:form>
  <textarea name='content'></textarea>
</div>
```

## `enrich`

The `enrich` object is used to pass methods to the Formula instance that allow the generation of computed values for
current form values - these are added at the field level, and each field can have multiple. All the calculated values
are available via the [enrichment store](stores/enrichment.mdx).

```svelte
<script>
  import { formula } from 'svelte-forms';

  const { form, enrichment } = formula({
    enrich: {
      content: {
        contentLength: (value) => value.length
      }
    }
  })
</script>

<div use:form>
  <textarea name='content'></textarea>
  <span>Length ${$enrichment?.content?.contentLength}</span>
</div>
```

### `messages`

Used for localisation and custom messages, this is a `Object` containing a key that is the field `name` to apply the
messages to. The value is another `Object` that contains the key for each error (e.g. `valueMissing`) and the value is
the replacement string.

```svelte

<script>
  import { formula } from 'svelte-forms';

  const { form, validity } = formula({
    messages: {
      username: {
        valueMissing: 'This service requires you enter a username'
      }
    },
  })
</script>
```

### `validators`

An `Object` containing a key that is the field `name` to apply the validation to, the value is another object that
contains each named validation function. The result are made available in the `validity` store.

```svelte

<script>
  import { formula } from 'svelte-forms';

  const { form, validity } = formula({
    validators: {
      content: {
        username: (value) => value.includes('@svelte.codes') ? null : 'Your username must be in the domain @svelte.codes'
      }
    }
  })
</script>
```

### `formValidators`

An `Object` containing a key that is the name of the validation rule, and the function that returns the validation
result. The results are available in the `formValidity` store

When using custom `validators`

## Example

```svelte

<script>
  import { formula } from 'svelte-formula';
  const { form, validity, formValidity } = formula({
    formValidators: {
      // With form validators you can compare values
      passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Your passwords must match',
      // Or check conditions between values across the form
      didTickConfirm: (values) => Boolean(values.createAccount) && Boolean(values.agreeTandCs) ? null : 'You must agree to Terms & Conditions before creating an account'
    }
  });
</script>

<div class:error={$formValidity?.passwordsMatch} hidden={$formValidity?.passwordsMatch}>
  {$formValidity?.passwordsMatch}
</div>
```
