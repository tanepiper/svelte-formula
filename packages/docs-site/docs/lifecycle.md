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

Any Formula instance can be updated using the `update` method, which accepts a new `FormulaOptions` object. When
using `update` all existing handlers will be removed and rebound.

```svelte
<script>
  import { formula } from 'svelte-formula';
  import { getMessges } from './libs/lang'

  const { form, update } = formula();

  function switchLanguage(lang) {
    const messages = getMessges(lang);
    update({ messages });
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

## Destroy

The `destroy` method allows the form to be destroyed early, which removes all handlers and removes the stores from the
global store.
