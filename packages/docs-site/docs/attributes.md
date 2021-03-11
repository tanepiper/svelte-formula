---
id: attributes

title: Formula Attributes

sidebar_label: Formula Attributes
---

Formula has several `data*` attributes that can be read and applied to forms

## Use Attributes

### `data-formula-bind`

This attribute is used when you want to bind different, or custom events to an input - for example when writing a custom
component, or when you want to bind other events to a component. When using this attribute the default binding won't
happen so it must also be passed if you want to use this.

```html
<!-- Use other browser event types to bind to -->
<input type='text' name='myValue' data-formula-bind='mouseover' />
<!-- Bind to more than one event type, such as including the original event  -->
<input type='text' name='myValue' data-formula-bind='mouseover|keyup' />
<!-- You can also emit your own custom events via elements inside custom components -->
<input type='number' name='myValue' data-formula-bind='customEvent' bind:this='{el}' />
<button on:click|preventDefault='{()' => el.dispatchEvent(new Event('customEvent'))}>Click Me</button>
```

#### Example

##### Custom Component

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

##### Component Use

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
