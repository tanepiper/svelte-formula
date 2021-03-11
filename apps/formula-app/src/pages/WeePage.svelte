<script>
  import { formula } from '../../../../dist/packages/svelte/formula'
  const { form, submitValues, isFormValid, validity } = formula();

  let formSubmitted = false;
  function submit() {
    formSubmitted = true;
    if ($isFormValid) {
      alert('Passed validation')
    } else {
      console.log($isFormValid, $submitValues);
    }
  }
</script>

<form on:submit|preventDefault={submit} novalidate use:form>
  <fieldset>
    <input type="text" required name="zzz" />
    <span class="validation" class:error={formSubmitted && $validity?.zzz?.invalid}>{$validity?.zzz?.message}</span>
  </fieldset>
  <button disabled="{formSubmitted && !$isFormValid}" type="submit">Submit</button>
</form>

<style>
  .validation:not(.error) { display: none }
</style>
