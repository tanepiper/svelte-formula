<script>
  import { formula } from '../../../../dist/packages/svelte/formula';
  import CustomInput from './components/CustomComponent.svelte';

  const testForm = formula({
    validators: {
      customElement: {
        positiveNum: value => value >= 0 ? null : 'The value must be positive',
      },
    },
    enrich: {
      customElement: {
        isEven: value => value % 2 === 0,
      },
    },
  });

  const formValues = testForm.formValues;
  const validity = testForm.validity;
  const enrichment = testForm.enrichment;

  function onSubmit() {
    //const result = get(formValues);
    //console.log(result) // This will contain the value of the input when 'customEvent' is emitted
  }

  let value = 0;

  $: console.log($formValues);
</script>


<form use:testForm.form on:submit|preventDefault={onSubmit} novalidate>
  <CustomInput name='customElement' required={true} bind:value={value} />
  <div>{$validity?.customElement?.message}</div>

  <button type='submit' class:boop={$enrichment?.customElement?.isEven}>
    Submit
  </button>
</form>

<style>

  .boop {
    background-color: hotpink;
  }
</style>
