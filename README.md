<div style='text-align: center'>

# Formula + Beaker Δ→

**Reactive Forms for Svelte**

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-formula/main/docs/img/logo_256.png)

</div>

[![svelte-formula](https://img.shields.io/npm/v/svelte-formula?label=svelte-formula)](https://www.npmjs.com/package/svelte-formula)

- [Documentation](https://tanepiper.github.io/svelte-formula)
- [Changelog](https://github.com/tanepiper/svelte-formula/blob/main/CHANGELOG.md)

`svelte-formula` is a Library for use with [Svelte](https://svelte.dev) that super-charges your ability to create rich
data-driven for applications.

## Install Instructions

`npm i svelte-formula`

## Usage

All you need is an element container with the Svelte [use](https://svelte.dev/docs#use_action) directive and form input
fields with their `name` property set.

Visit the [documentation](https://tanepiper.github.io/svelte-formula) for more details API instructions.

## Formula

[Demo](https://svelte.dev/repl/dda29ae516284147871b58a4f1966315)

<div style='text-align: center; float: left; margin-right: 20px'>

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-formula/main/docs/img/formula-small.png)

</div>

**Formula** is a library for creating _Zero Configuration_ reactive form components, and fully data-driven applications.

**Zero-Configuration** means you need nothing more than a well-defined HTML5 form element to have fully reactive stores
of data and form states.

Accessing the input requires only setting the `name` property, and for validation providing attributes like `require`
or `minlength`. Formula supports single and multi-value inputs across all widely supported HTML inputs and extends them
with checkbox groups and radio groups, and composite fields of values like text or number.

Formula creates a form instance that contains Svelte [stores](https://tanepiper.github.io/svelte-formula/docs/stores/stores) that
contain value and validation information, and some
additional [lifecycle methods](https://tanepiper.github.io/svelte-formula/docs/lifecycle) that allow your to dynamically add and
remove customisations, and reset or destroy the form. It also attempts to apply ARIA attributes to help with
accessibility.

### Extending Formula

Formula also supports a bunch of [powerful options](https://tanepiper.github.io/svelte-formula/docs/options) that provide additional
validation, enrichment and custom messages.

For example with the `enrich` [option](https://tanepiper.github.io/svelte-formula/docs/options#enrich)
and `enrichment` [store](https://tanepiper.github.io/svelte-formula/docs/stores/stores-enrichment) you can provide functions that
calculate additional computed values based on user input - for example calculating a password strength, or the length of
text a user has entered. These are useful.

Validations can be provided at the form and field level, and integrate with in-built browser validations to provide
native messages, which can be customised for localisation.

### Beaker

[Demo](https://svelte.dev/repl/c146c7976360405cba9a696e3fee853b)

<div style='text-align: center; float: left; margin-right: 20px'>

![The Svelte Formula Logo](https://raw.githubusercontent.com/tanepiper/svelte-formula/main/docs/img/beaker-small.png)

</div>

**Beaker** take Formula and adds another layer for working with collections of data.

Using row-based input you can create full form instances per row that are also fully reactive and feed into Beaker's
collection store.

Beaker also provides methods for setting, adding and removing items from the in-built stores, when can be used with
Svelte's `{#each}{/each}` blocks to create a re-usable template in the component

With this you can build applications such as multi-row editable tables or lists. See
the [documentation](https://tanepiper.github.io/svelte-formula/docs/groups/beaker) for more details and examples.
