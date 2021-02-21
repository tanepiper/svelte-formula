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

Out-of-the box it's designed to work with HTML5 forms. Using the `name` attribute of your HTML elements, Formula builds
a set of state objects using Svelte's subscribable [stores](stores/stores.md), making them available for you subscribe
to in your application. These stores contain values and validation states, which are configured as easily as setting
supported attributes, and doesn't get in the way of things like Accessibility.

> Want to make a field required? Just add the `<input required>` attribute, or add `<input minlength="8">` to set a minimum length on the fields.

Validation is enhanced via custom field and form level validation functions passed in the [options](options.md) - you
can also pass default values, or override default HTML5 validation text with your own versions (such as localised text).

You can also enrich you fields with computed values (such as a password strength derived from the users input).

### Working with Data Collections

Formula also provides an API for working with collections of data - [beaker](groups/groups.md) allows you to use Formula to
create rich row-level forms for applications such as data grids.

## Installation

Formula is available on NPM, with the source available on GitHub. To install in your project type:

> `npm i svelte-formula`

## Basic Form Example

To use in your project all you need is an element container binding the form with
Svelte [use](https://svelte.dev/docs#use_action)
directive, and form input fields with their `name` property set.

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
