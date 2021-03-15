<script type='typescript'>
  import { formula } from 'svelte-formula';

  const {
    form,
    enrichment,
    formValues,
  } = formula({
    defaultValues: {
      field1: '',
    },
    enrich: {
      field1: {
        textLength: value => value.length,
      },
    },
  });
</script>

<form use:form>
  <div class='field-set'>
    <label for='field-1'>Input, No Constraints</label>
    <input type='text' id='field-1' name='field1' />
    <span>{$enrichment.field1.textLength} Characters</span>
  </div>

  <button type='submit' on:click|preventDefault={() => {}}>Submit</button>
</form>

<ul class='form-output'>
  <li>Field 1 <span>{$formValues.field1}</span></li>
</ul>
