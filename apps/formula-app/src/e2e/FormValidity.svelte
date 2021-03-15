<script type='typescript'>
  import { formula } from 'svelte-formula';

  const {
    form,
    formValidity,
    isFormValid,
  } = formula({
    defaultValues: {
      field1: '',
      field2: '',
    },
    formValidators: {
      textMatches: values => values.field1 === values.field2 ? null : 'The values must match',
    },
  });
</script>

<form use:form>
  <div class='field-set'>
    <label for='field-1'>Input 1</label>
    <input type='text' id='field-1' name='field1' required />
  </div>
  <div class='field-set'>
    <label for='field-2'>Input 2</label>
    <input type='text' id='field-2' name='field2' required />
  </div>

  <button type='submit' on:click|preventDefault={() => {}}>Submit</button>
</form>

<ul class='form-output'>
  <li>Form Validator <span class='error' hidden={!$formValidity.textMatches}>{$formValidity.textMatches}</span></li>
</ul>


<div class='form-valid' hidden={!$isFormValid}>Form Is Valid</div>

<style>
  .error {
    border: 1px solid red;
  }
</style>
