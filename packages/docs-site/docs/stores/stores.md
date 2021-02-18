---
id: stores

title: Formula Stores

sidebar_label: Formula Stores
---

## Accessing Stores

Formula provides a set of Svelte [stores](https://svelte.dev/docs#svelte_store) as part of each instance created
with `formula()`. These stores provide different types of values at different lifecycles of your application.

The available stores are listed in the sidebar - to access them provide them as part of the initial object returned
from `formula`

```javascript
const { form, enrichement, formValdity, formValues, isFormValid, submitValues, touched, validity } = formula();
```

## Global Store

When attaching a form to an element, if you provide an `id` property the stores will be added to a global `Map` that can
be accessed from anywhere else in your application from via `formulaStores

```svelte

<script>
  import { get } from 'svelte/store'
  import { formula, formulaStores } from 'svelte-formula';

  const { form } = formula();

  function formSubmit() {
    const otherForm = formulaStores.get('otherForm');
    const otherValues = get(otherForm.formValues);
  }

</script>

<form use:form id='myForm' on:submit={formSubmit}>

</form>
```
