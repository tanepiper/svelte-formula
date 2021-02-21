---
id: data

title: Data API

sidebar_label: Data API
---

Any group created with `beaker` returns an instance of the Beaker stores. The names are the same as
the [Formula store](../stores/stores.md) but return an Array of form data as rows, except `isFormReady` and
`isFormValid` which are for the entire group and still a single value.

## `init`

It's possible to pass initial data into the form group using the `init` - this should be an array of the items to
display with keys matching the form field `name` (the exception is [radio fields](./groups.md)).

```svelte

<script>
  import { beaker } from 'svelte-formula';

  const contacts = beaker();

  export let contactData = [];
  contacts.init(contactData);
</script>
```

## `add`

Add a row to the store, when using the store as your rendering source this will append a row to the page. Pass your item
type to the function

```svelte

<script>
  import { beaker } from 'svelte-formula';

  const contacts = beaker();

  const items = contacts.formValues;

  export let contactData = [];
  contacts.init(contactData);
</script>

<button on:click|preventDefault={() => contacts.add({...item})}>Add Item</button>
<div use:contacts.group>
  {#each items as item, i}

  {/each}
</div>
```

## `delete`

Delete a row to the store, when using the store as your rendering source this will remove a row from the page. Pass the
index of the item to remove to the function

```svelte

<script>
  import { beaker } from 'svelte-formula';

  const contacts = beaker();

  const items = contacts.formValues;

  export let contactData = [];
  contacts.init(contactData);
</script>

<div use:contacts.group>
  {#each items as item, i}
    <button on:click|preventDefault={() => contacts.delete(i)}>Delete Item</button>
  {/each}
</div>
```

## `reset`

This will reset all the underlying data of any displayed rows, but does not itself delete any rows. This is calling the
underlying form row `reset` methods.

## `clear`

Calling this will clear the group of all rows of data
