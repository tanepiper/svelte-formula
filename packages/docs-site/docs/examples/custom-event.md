---
id: custom-event

title: Example - Custom Component Events

sidebar_label: Custom Events
---

```svelte

<script>

  export let value = 0;

  export let name = ''

  export let required = false

  let el;

</script>
<div id={name}>
  <button id='minus' on:click={() => {
    value--;
    el.dispatchEvent(new Event('customEvent'))
  }}>
    -
  </button>

  <input type='number' readonly bind:this={el} name={name} value={value} required={required}
         data-formula-bind='customEvent' />

  <button id='plus' on:click={() => {
    value++;
    el.dispatchEvent(new Event('customEvent'))
  }}>
    +
  </button>
</div>
```

## Component Use

```svelte

<script>
  import { formula } from 'svelte-formula';
  import { get } from 'svelte/store'
  import CustomInput from './CustomInput.svelte';

  const testForm = formula({
    // You can write custom validators for this element
    validators: {
      customElement: {
        positiveNum: value => value >= 0 ? null : 'The value must be positive'
      }
    },
    // And custom enrichments
    enrich: {
      customElement: {
        isEven: value => value % 2 === 0
      }
    }
  });
  
  const enrichment = testForm.enrichment;
  
  function onSubmit() {
    const result = get(testForm.formValues);
    console.log(result.myValue) // This will contain the value of the input when 'customEvent' is emitted
  }

</script>

<form use:testForm.form on:submit|preventDefault={onSubmit}>
  <CustomInput name='myValue' required={true} />

  <button type='submit' class:boop={$enrichment?.customElement?.isEven}>
    Submit
  </button>
</form>

<style>
  .boop {
    background-color: hotpink;
  }
</style>

```
