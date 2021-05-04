---
id: signup

title: Example - Signup Form

sidebar_label: Complex Form
---

```svelte
<script>
  import { get } from 'svelte/store'
  import { createEventDispatcher} from 'svelte';
  import { formula } from 'svelte-formula';
  import { checkPasswordScore } from './password'

  const dispatch = createEventDispatcher();

  const { form, dirty, enrichment, formValidity, formValues, isFormValid, submitValues, touched, validity } = formula({
    messages: {
      username: {
        valueMissing: 'This service requires you enter a username'
      }
    },
    enrich: {
      password: {
        passwordStrength: (value) => checkPasswordScore(value),
      }
    },
    validators: {
      username: {
        inDomain: (value) => value.includes('@svelte.codes') ? null : 'You can only sign up wit a @svelte.codes domain'
      },
      t_and_c: {
        isChecked: (value) => value ? null : 'You must check the T&Cs to sign up'
      }
    },
    formValidators: {
      passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Your passwords must match'
    }
  })

  $: usernameErr = $touched?.username && $validity?.username?.invalid
  $: passwordErr = $touched?.password && $validity?.password?.invalid
  $: passwordsMatchErr = $touched.passwordMatch && $formValidity?.passwordsMatch;
  $: passwordStrength = $enrichment?.password?.passwordStrength || 0;


  function onSubmit() {
    dispatch('signup', {
      user: get(submitValues)
    })
  }
</script>
{passwordStrength}
<form use:form id='signup' on:submit={onSubmit}>
  <div hidden={$isFormValid}>
    There are errors
  </div>

  <div class='form-field' on:submit={onSubmit}>
    <label for='username'>Username</label>
    <input type='email' id='username' name='username' required class:error={usernameErr}>
    <span hidden={!usernameErr}>{$validity?.username?.message}</span>
  </div>
  <div class='form-field'>
    <label for='password'>Password</label>
    <input type='password' id='password' name='password' required minlength='8' class:error={passwordErr}>
    <span hidden={!passwordErr}>{$validity?.password?.message}</span>
    <meter value={$enrichment?.password?.passwordStrength || 0} min='0' max='100' low='33' high='66'
           optimum='80'></meter>
  </div>
  <div class='form-field'>
    <label for='passwordMatch'>Password Match</label>
    <input type='password' id='passwordMatch' name='passwordMatch' required minlength='8'
           class:error={passwordsMatchErr}>
    <span hidden={!passwordsMatchErr}>{$formValidity?.passwordsMatch}</span>
  </div>
  <div class='form-field'>
    <label for='t_and_c'>Agree to T&amp;Cs</label>
    <input type='checkbox' id='t_and_c' name='t_and_c' />
    <span hidden={$validity?.t_and_c?.valid}>{$validity?.t_and_c?.message}</span>
  </div>

  <button type='submit' disabled={!$isFormValid}>Signup For Service</button>
</form>

<style>
  .error {
    border: 1px solid red;
  }
</style>

```
