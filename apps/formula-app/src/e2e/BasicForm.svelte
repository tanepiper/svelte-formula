<script type='ts'>
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
      field2: '',
    },
  });
</script>

<form use:form>
  <div class='field-set'>
    <label for='field-1'>Input, No Constraints</label>
    <input type='text' id='field-1' name='field1' />
  </div>
  <div class='field-set'>
    <label for='field-2'>Input, Required</label>
    <input type='text' id='field-2' name='field2' required class:error={$touched.field2 && $validity.field2.invalid} />
    <span class='error' hidden='{$validity.field2.valid}'>{$validity.field2.message}</span>
  </div>


  <button type='submit' on:click|preventDefault={() => {}}>Submit</button>
</form>


<ul class='form-output'>
  <li>Field 1 <span>{$formValues.field1}</span></li>
  <li>Field 2 <span>{$formValues.field2}</span></li>
</ul>


<div class='form-valid' hidden={!$isFormValid}>Form Is Valid</div>

<style>
  .error {
    border: 1px solid red;
  }
</style>
