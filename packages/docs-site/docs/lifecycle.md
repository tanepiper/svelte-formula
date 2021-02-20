---
id: lifecycle

title: Formula Lifecycle

sidebar_label: Formula Lifecycle
---

## Create

To create your form instance call the `formula()` method, this creates a `form` instance that can be attached to any
element with the [use](https://svelte.dev/docs#use_action) directive.

When using like this, on component destruction the form will automatically unbind

```svelte
<script>
  import { formula } from 'svelte-formula';

  const { form } = formula()
</script>

<!-- Use with a form element to get access to submission values -->
<form use:form></form>

<!-- Use on any other element to create reactive components -->
<div use:form></div>
```

## Update

Any Formula instance can be updated using the `updateForm` method, which accepts a new `FormulaOptions` object. When
using `update` all existing handlers will be removed and rebound.

```svelte
<script>
  import { formula } from 'svelte-formula';
  import { getMessges } from './libs/lang'

  const { form, updateForm } = formula();

  function switchLanguage(lang) {
    const messages = getMessges(lang);
    updateForm({ messages });
  }

</script>

<div class='lang-switcher'>
  <button on:click={() => switchLanguage('en')}>English</button>
  <button on:click={() => switchLanguage('nl')}>Nederlands</button>
  <button on:click={() => switchLanguage('fr')}>Français</button>
</div>

<form use:form>

</form>
```

## Reset

The `resetForm` can be called at any time during the life of the form, it will reset the form to it's initial state after
`defaultValues` and element values have been applied, also `touched` and `dirty` stores are reset.

```svelte
<script>
  import {formula} from 'svelte-formula';
  const {form, $formValues, initialValues, formReset } = formula();

  $: initialTotal = (initialValues?.value1 || 0) + (initialValues?.value2 || 0)
  $: total = ($formValues?.value1 || 0) + ($formValues?.value2 || 0)
});
</script>
<form use:form>
  <label for='value-1'>Value 1</label>
  <input type='number' required id='value-1' name='value1' />
  <label for='value-2'>Value 2</label>
  <input type='number' required id='value-2' name='value2' />

  <div>{$initialTotal?.value1} + {$initialTotal?.value2} = {initialTotal}</div>
  <div>{$formValues?.value1} + {$formValues?.value2} = {total}</div>

  <button on:click!preventDefault={() => formReset}>Reset</button>
</form>
```

## Destroy

The `destroyForm` method allows the form to be destroyed early, which removes all handlers and removes the stores from the
global store.
