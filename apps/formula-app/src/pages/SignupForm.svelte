<script>
  import { formula } from '../../../../dist/packages/svelte/formula';

  const formValidators = {
    passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Your passwords do not match',
  };

  const { form, validity, formValidity, touched, isFormValid, update, destroy } = formula({
    formValidators,
  });

  $: console.log($validity)
  $: console.log($isFormValid)

  $: usernameInvalid = ($touched?.username && $validity?.username?.invalid) && $validity?.username?.message;
  $: passwordInvalid = ($touched?.password && $validity?.password?.invalid) && $validity?.password?.message;
  $: passwordMatchInvalid = ($touched?.passwordMatch && $validity?.passwordMatch?.invalid) && $validity?.passwordMatch?.message;

  function updateForm() {
    const options = {
      formValidators,
      validators: {
        username: {
          inDomain: (value) => value.includes('@svete.codes') ? null : 'You in the svelte codes?',
        },
      },
    };
    update(options);
  }

  function removeValidation() {
    update({ formValidators });
  }

</script>
<h2>Signup Form Example</h2>
<p>A simple signup form example</p>

<div class='container signup-container'>
  <div hidden={$isFormValid}>
    {#each Object.entries($formValidity) as [key, val]}
      {val}
    {/each}
  </div>
  <form class='signup' use:form>
    <div class='form-group'>
      <label for='username'>User Name</label>
      <input type='email' name='username' id='username' required class:error={usernameInvalid} />
      <span hidden={!usernameInvalid}>{usernameInvalid}</span>
    </div>

    <div class='form-group'>
      <label for='password'>Password</label>
      <input type='password' name='password' id='password' minlength='8' required class:error={passwordInvalid} />
      <span hidden={!passwordInvalid}>{passwordInvalid}</span>
    </div>

    <div class='form-group'>
      <label for='passwordMatch'>Password Match</label>
      <input type='password' name='passwordMatch' id='passwordMatch' minlength='8' required
             class:error={passwordMatchInvalid} />
      <span hidden={!passwordMatchInvalid}>{passwordMatchInvalid}</span>
    </div>

    <div>
      <button type='submit' disabled={!$isFormValid}>Login</button>
      <button type='button' on:click={updateForm}>Add</button>
      <button type='button' on:click={removeValidation}>Remove</button>
      <button type='button' on:click={() => destroy()}>Destroy</button>
    </div>
  </form>
</div>
