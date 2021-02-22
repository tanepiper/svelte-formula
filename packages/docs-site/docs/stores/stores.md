---
id: stores

title: Formula Stores

sidebar_label: Formula Stores
---

## Accessing Stores

Formula and Beaker provides a set of Svelte [stores](https://svelte.dev/docs#svelte_store) as part of each instance
created. These stores provide different types of values at different lifecycles of your application.

All the stores are listed in the sidebar.

* When using Formula, the stores contain a single `Object` instance of the form
* When using Beaker, the stores contain an `Array` of `Object` values for each row instance

```javascript
const { form, enrichement, formValdity, formValues, isFormValid, submitValues, touched, validity } = formula();
```

If you have multiple forms on the page you can also access stores via `form.stores`

```sveltehtml

<script>
  import { formula } from 'svelte-formula';

  const myForm = formula()

  const myFormValues = myForm.formValues // (or myForm.stores.formValues)

</script>
<form use:myForm.form>

</form>

```

## Global Store

When attaching a form to an element, if you provide an `id` property the stores will be added to a global `Map` that can
be accessed from anywhere else in your application from via `formulaStores` or `beakerStores`

```svelte

<script>
  import { get } from 'svelte/store'
  import { formula, formulaStores, beakerStores } from 'svelte-formula';

  const { form } = formula();

  function formSubmit() {
    const otherForm = formulaStores.get('otherForm');
    const otherValues = get(otherForm.formValues);
  }

</script>

<form use:form id='myForm' on:submit={formSubmit}>

</form>
```
