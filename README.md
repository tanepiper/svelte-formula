# Svelte Formula

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-plugins/main/packages/svelte/formula/logo.png)

[![svelte-formula](https://img.shields.io/npm/v/svelte-formula?label=svelte-formula)](https://www.npmjs.com/package/svelte-formula)

[Documentation](https://formula.svelte.codes)

Formula is a library for [Svelte](https://svelte.dev) with features for creating **Zero Configuration** reactive forms
and fully data-driven applications.

Out-of-the box it's designed to work with HTML5 forms. Configuring your forms validation is as easy as setting
attributes, and doesn't get in the way of things like Accessibility.

## Install Instructions

`npm i svelte-formula`

## Usage

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

Visit the [documentation](https://formula.svelte.codes) for more details API instructions.

## Roadmap

### Field Type Support

- [x] Support Basic Input fields (text, number, password, email, url) as text values
  - [x] Support multiple named fields with unique `id` attributes, with an array of results sorted by ID alphabetically
  - [x] Return correct value type for fields (return number as Number value)
- [x] Support Select Fields
  - [x] Support Multiple Select Fields
- [x] Support Radio Fields
- [x] Support Checkbox Fields
  - [x] Support Multiple Checkbox Fields
- [x] Support the Range input
- [x] Support the Color input
- [x] Support the Date / Time inputs
- [x] Support the File input

### Validation

- [x] Custom field-level validation via `formula` options
- [x] Custom form-level validation via `formula` options
- [x] Support for localised messages for validation errors

### Other Items

- [ ] Add Unit Tests - IN PROGRESS
- [ ] Add full documentation - IN PROGRESS

Icon made by [Eucalyp](https://creativemarket.com/eucalyp) from [flaticon.com](https://www.flaticon.com)
