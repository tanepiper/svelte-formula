# Svelte Formula

A reactive form library for Svelte in early development

## Install Instructions

`npm i svelte-formula`

To use in your component:

```sveltehtml

import { formula } from 'svelte-formula'

const { form, value, isValid } = formula()

<form use:form>
  <div class='form-field'>
    <label for='username'>Username</label>
    <input type='text' id='username' name='username' required />
    <span hidden={value?.username.valid}>There is a username error</span>
  </div>
  <div class='form-field'>
    <label for='password'>Password</label>
    <input type='password' id='password' name='password' required />
    <span hidden={value?.username.valid}>There is a password error</span>
  </div>

  <button disabled={!$isValid}>Save</button>
</form>
```

