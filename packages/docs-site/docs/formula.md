---
id: formula

title: Formula API

sidebar_label: Formula API
---

[![svelte-formula](https://img.shields.io/npm/v/svelte-formula?label=svelte-formula)](https://www.npmjs.com/package/svelte-formula)

## What is Formula?

> **Formula is still in active development - as such there may still be API changes**

Formula is a library for [Svelte](https://svelte.dev) with features for creating **Zero Configuration** reactive forms
and fully data-driven applications.

Out-of-the box it's designed to work with HTML5 forms. Configuring your forms validation is as easy as setting
attributes, and doesn't get in the way of things like Accessibility.

For example making a field requied - add the `<input required>` property or `<input minlength="8">` to set a minimum
length.

All the form values, states and enrichment are available through the instance [stores](stores/stores.md) (which are just
Svelte stores!)

All you need is a element container with the Svelte [use](https://svelte.dev/docs#use_action) directive and form input
fields with their `name` property set.

```svelte
  <script>
    import { formula } from 'svelte-formula'
    const { form, formIsValid, validity, touched } = formula();

    // Here we can provide a default value
    export let projectname = '';

    // You can calculate values for valid UI states
    $: projectNameInvalid = $touched?.projectName && validity?.projectName?.invalid
  </script>

  <div use:form>
    <label for="project-name">Project Name</label>
    <input type="text" name="projectName" required minlength="8" class:error={projectNameInvalid} bind:value={projectName} />
    <span hidden={!projectNameInvalid}>{validity?.projectName?.message}</span>
    <button disabled={!$formIsValid}>Update Project Name</button>
  </div>
```

## Adding powerful custom validations and enrichment

While you don't need any configuration to get started, Formula does provide a set of
powerful [configuration options](options.md) for any form instance, providing custom field and form validations, custom
errors messages and custom enrichments which allow you to return additional calculated data.

## Full Example

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
      passwordsMatch: (values) => values.password === values.matchPassword ? null : 'Your passwords must match'
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
