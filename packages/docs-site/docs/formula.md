---
id: formula

title: The Formula API

sidebar_label: Formula API
---

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-plugins/main/packages/svelte/formula/logo.png)

## What is Formula?

[![svelte-formula](https://img.shields.io/npm/v/svelte-formula?label=svelte-formula)](https://www.npmjs.com/package/svelte-formula)

**This documentation is currently in development**

Formula is a library for use with [Svelte](https://svelte.dev) that allows for **Zero Configuration** reactive forms.

The library's design philosophy is to work with HTML5 forms, allowing most of the configuration to happen in your HTML.

Formula uses validation attributes on form elements such as `<input required>` or `<input minlength="8">`, and provides
feedback to your application through a set of [Svelte Stores](https://svelte.dev).

To make a field available in your Svelte app, it only requires a `name` property.

While you don't need a configuration to get started, the library allows for powerful custom validations at field level,
and across the form

## Creating your first reactive form

To create a reactive form, you need to bind the `form` action to any element using the [use](http://svelte.dev)
directive in Svelte, you can then access several form states via the exported stores:

```svelte
<script>
  import { formula } from 'svelte-formula';
  const { form, formValues, touched, validity, isFormValid } = formula();

  $: console.log($formValues);
</script>

<form use:form>
  <label for='username'>Username</label>
  <input type='email' required id='username' name='username'
         class:error={$touched?.username && $validity?.username?.invalid} />
  <span hidden={$validity?.username?.valid}>{$validity?.username?.message}</span>
  <label for='password'>Password</label>
  <input type='password' required minlength='8' id='password' name='password'
         class:error={$touched?.username && $validity?.username?.invalid} />
  <span hidden={$validity?.password?.valid}>{$validity?.password?.message}</span>
  <button disabled='{!$isFormValid}'>Login</button>
</form>
```

In this example there are two fields: `username` and `password` - taking the `name` property from the input,
the value is now available in `formValues`, the `touched` status (when the form field is focused) and both
field level `validity` and overall form validity with `isFormValid`.

There are additional stores: `submitValues`, `dirty` and `formValidity`.
