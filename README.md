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

Visit the [documentation](https://formula.svelte.codes) for more details API instructions.
