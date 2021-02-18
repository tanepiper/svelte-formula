---
id: stores-submit-values

title: submitValues

sidebar_label: submitValues
---

## Description

This store contains all the form values at submit time, only if the bound element is a `form` element. The values are
an `Object` with the key per group `name` and it's value.

The value can be a single value, or an array or values depending on there being fields with the same `name` (e.g.
multiple checkboxes), or a `<select>` element with the `multiple` attribute.

## Example

```svelte
<script>
  import {formula} from 'svelte-formula';
  const {form, submitValues} = formula();
  const { postToApi } '../libs/api'

  function submit() {
    $: result = $submitValues
    postToApi(result);
  }
});
</script>
<form use:form>
  <label for='value-1'>Value 1</label>
  <input type='number' required id='value-1' name='value1' />
  <label for='value-2'>Value 2</label>
  <input type='number' required id='value-2' name='value2' />

 <button on:click={submit}>Submit</submit>
</form>
```
