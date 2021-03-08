---
id: data

title: Data API

sidebar_label: Data API
---

Like Formula, `beaker` returns an instance of the Beaker stores which are have the same name as
the [Formula store](../stores/stores.md), but container Array of form data as rows. The exceptions are
`isFormReady` and `isFormValid` which are for the entire group and still a single value.

It also contains some additional properties and methods. The methods listed below allow for data to be added or removed
from the groups `formValue` store - this store can also be used with a `{#each}` block to render the rows in the
template.

## `init`

Pass initial data into the form group, or reset the form to initial data - this will the form store data with the
current items to render. Each key and value should match the fields in the group template (the exception
is [radio fields](./groups.md) which should be based on the `data-beaker-key` attribute passed).

```svelte

<script>
  import { beaker } from 'svelte-formula';

  const contacts = beaker();

  export let contactData = [];
  contacts.init(contactData);

  const items = contacts.formValues;
</script>
<div use:contacts.group>
  {#each items as item, i}

  {/each}
</div>
```

## `add`

Add a row item to the store - this item should be a single object with the same key/value type for the form.

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

## `set`

Update an existing row in the store at the passed index.

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
    ...
      <button on:click|preventDefault={() => contacts.set(i, {...newData})}>Save Item</button>

    ...
  {/each}
</div>
```

## `delete`

Deletes a row from the form - this method takes the index of the row to remove.

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

## `clear`

Calling this will empty the group of all rows of data.

## `forms`

An `Map` of all the underlying [Formula](../formula.md) instances that allows for finer control, or access to the form
stores
