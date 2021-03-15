<script>
  import { formula } from '../../../../dist/packages/svelte/formula';

  const mainForm = formula();

  import AddressForm from './components/AddressForm.svelte'

  mainForm.formValues.subscribe((values) => {
    console.log(values)
  })
</script>

<form use:mainForm.form>
  <AddressForm />
</form>
