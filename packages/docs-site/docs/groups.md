---
id: beaker

title: Formula Beaker

sidebar_label: Formula Beaker
---

Formula `beaker` is a function that allows the creation of sub-groups within your main form - these groups can be used for
row-based data that contain multiple fields.

## Example

```sveltehtml

<script>
  import { writable } from 'svelte/store';
  import { formula, beaker } from 'svelte-formula';
  
  const { form, formValues, updateForm } = formula();
  
  // This creates a contact group - you can now bind `contacts.group` to the subgroup
  const contacts = beaker();
  
  // The internal data rows would come from our own source
  const rows = writable([]);
  
  function addRow() {
    rows.update(state => [...state, {
      firstName: '',
      lastName: '',
      email: '',
    }]);
    contacts.update()
  }

  function deleteRow(index) {
    rows.update(state => {
      state.splice(index, 1);
      return state;
    })
    contacts.update()
  }

  const contactValues = contacts.stores.formValues;
  const data = contacts.data;
  const isFormReady = contacts.stores.isFormReady;
  $: console.log('contactValues', $data)
  $: console.log($isFormReady)

</script>

<div use:form>
  <label for='foo'>
    Foo
  </label>
  <input type='text' id='foo' name='foo' />

  <button on:click|preventDefault={addRow}>Add Row</button>
  <table>
    <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>&nbsp;</th>
    </tr>
    </thead>
    <tbody use:contacts.group role='group'>
    {#each $rows as row, i}
      <tr>
        <td>
          <input type='text' id='firstName-{i}' name='firstName' bind:value={row.firstName} />
        </td>
        <td>
          <input type='text' id='lastName-{i}' name='lastName' bind:value={row.lastName} />
        </td>
        <td>
          <input type='text' id='email-{i}' name='email' bind:value={row.email} />
        </td>
        <td>
          <button on:click|preventDefault={() => deleteRow(i)}>X</button>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>


```
