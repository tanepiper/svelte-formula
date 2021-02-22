# Svelte Formula

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-plugins/main/packages/docs-site/static/img/logo_256.png)

[![svelte-formula](https://img.shields.io/npm/v/svelte-formula?label=svelte-formula)](https://www.npmjs.com/package/svelte-formula)

- [Documentation](https://formula.svelte.codes)
- [Changelog](https://github.com/tanepiper/svelte-formula/blob/main/CHANGELOG.md)

Formula is a library for [Svelte](https://svelte.dev) with features for creating **Zero Configuration** reactive forms
and fully data-driven applications.

Out-of-the box it's designed to work with HTML5 forms. Configuring your forms validation is as easy as setting
attributes, and doesn't get in the way of things like Accessibility. You can also add additional validations, custom
messages and computed values through optional configuration to enhance your forms and their UI.

Formula also supports multi-row forms with [Beaker](https://formula.svelte.codes/docs/groups/beaker) - an API for working
with rich forms for collections of data.

## Install Instructions

`npm i svelte-formula`

## Usage

All you need is an element container with the Svelte [use](https://svelte.dev/docs#use_action) directive and form input
fields with their `name` property set.

[Live Demo](https://svelte.dev/repl/3c3fe78a258a45779bd122d399560f19)
```svelte
<script>
    import { createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store'
    import { formula } from 'svelte-formula@0.8.2'
    
    const { form, isFormValid, validity, touched, submitValues } = formula();

    const dispatcher = createEventDispatcher()

    // Allow components to accept value that can be used as default values
    export let userName = '';

    // You can calculate values for valid UI states
    $: usernameInvalid = $touched?.userName && $validity?.userName?.invalid

    // Handle submission of data easily to parent components or services
    function submitForm() {
      dispatch('updateUser', {
        user: get(submitValues)
      })
    }
  </script>

<!-- Use as form element to get full form submission validation-->
<form use:form on:submit|preventDefault={submitForm}>
  <div class="form-field">
    <label for="userName">User Name</label>
    <input type="text" id="userName" name="userName" required minlength="8" class:error={usernameInvalid} bind:value={userName} />
    <span hidden={!usernameInvalid}>{$validity?.userName?.message}</span>
  </div>
  
  <button disabled={!$isFormValid} type="submit">Update User Name</button>
</form>

<style>
  .error {
    border: 1px solid hotpink;
  }
</style>
```


Visit the [documentation](https://formula.svelte.codes) for more details API instructions.
