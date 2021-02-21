<script>
  import { get, writable } from 'svelte/store';
  import { beaker, formula } from '../../../../dist/packages/svelte/formula';


  const { form, formValues, updateForm } = formula();


  const contacts = beaker();
  const contactValues = contacts.stores.formValues;
  console.log(contacts);

  const rows = writable([{
    firstName: 'Tane',
    lastName: 'Piper',
    email: 'formula@svelte.codes',
    checkboxMulti: ['B', 'C'],
  }, {
    firstName: 'Foo',
    lastName: 'McBarr',
  }]);

  $: console.log('formValues', $formValues);

  function addRow() {
    rows.update(state => [...state, {
      firstName: '',
      lastName: '',
      email: '',
    }]);
  }

  function deleteRow(index) {
    rows.update(state => {
      state.splice(index, 1);
      return state;
    });
  }

  function onSubmit() {
    const formData = get(formValues)
    const groupData = get(contacts.formValues)
    console.log(formData, groupData)
  }

  const group = contacts.stores.formValues;
  $: console.log('contactValues', $contactValues);
</script>

<form use:form on:submit|preventDefault={onSubmit}>
  <label for='foo'>
    Foo
  </label>
  <input type='text' id='foo' name='foo' />

  <button on:click|preventDefault={addRow}>Add Row</button>
  <button type='submit'>Submit</button>
  <table>
    <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Checkbox</th>
      <th>Checkbox Multi</th>
      <th>Radio</th>
      <th>Select</th>
      <th>Select Multi</th>
      <th>&nbsp;</th>
    </tr>
    </thead>
    <tbody use:contacts.group id='contacts'>
    {#each $rows as row, i}
      <tr data-bind-data={JSON.stringify(row)}>
        <td>
          <input type='text' id='firstName-{i}' name='firstName' required />
        </td>
        <td>
          <input type='text' id='lastName-{i}' name='lastName' />
        </td>
        <td>
          <input type='text' id='email-{i}' name='email' />
        </td>
        <td>
          <input type='checkbox' id='checkbox-{i}' name='checkbox' />
        </td>
        <td>
          <input type='checkbox' id='checkbox-multi-{i}-1' name='checkboxMulti' value='A' />
          <input type='checkbox' id='checkbox-multi-{i}-2' name='checkboxMulti' value='B' />
          <input type='checkbox' id='checkbox-multi-{i}-3' name='checkboxMulti' value='C' />
          <input type='checkbox' id='checkbox-multi-{i}-4' name='checkboxMulti' value='D' />
        </td>
        <td>
          <input type='radio' id='radio-{i}-1' name='radio' value='A' />
          <input type='radio' id='radio-{i}-2' name='radio' value='B' />
          <input type='radio' id='radio-{i}-3' name='radio' value='C' />
          <input type='radio' id='radio-{i}-4' name='radio' value='D' />
        </td>
        <td>
          <select name='select-one'>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>

          </select>
        </td>
        <td>
          <select name='select-multi' multiple>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>

          </select>
        </td>
        <td>
          <button on:click|preventDefault={() => deleteRow(i)}>X</button>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</form>

