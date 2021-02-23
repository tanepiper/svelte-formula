<script>
  import { formula } from "../../../../dist/packages/svelte/formula";
  const { form, formValues } = formula();
</script>

<form use:form>
  <input type="text" name="firstName" required/>
  <input type="text" name="lastName" />
  <input type="number" name="age" />
</form>

<pre>{JSON.stringify($formValues, null, 2)}</pre>
