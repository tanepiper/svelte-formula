<script type='typescript'>
  import { formula } from 'svelte-formula';

  const {
    form,
    validity,
    touched,
    isFormValid,
    formValues,
  } = formula({
    defaultValues: {
      field1: '',
    },
    validators: {
      field1: {
        containsText: value => value.includes('Svelte') ? null : 'You must include the word Svelte',
      },
    },
  });
</script>

<form use:form>
  <div class='field-set'>
    <label for='field-1'>Input, No Constraints</label>
    <input type='text' id='field-1' name='field1' />
    <span class='error' hidden='{$validity.field1.valid}'>{$validity.field1.message}</span>
  </div>

  <button type='submit' on:click|preventDefault={() => {}}>Submit</button>
</form>


<ul class='form-output'>
  <li>Field 1 <span>{$formValues.field1}</span></li>
</ul>


<div class='form-valid' hidden={!$isFormValid}>Form Is Valid</div>

<style>
  .error {
    border: 1px solid red;
  }
</style>
