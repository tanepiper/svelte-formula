<script>
  import { get, writable } from 'svelte/store';
  import { beaker, formula } from '../../../../dist/packages/svelte/formula';


  const { form, formValues, updateForm } = formula();


  const contacts = beaker();
  const contactValues = contacts.stores.formValues;
  console.log(contacts);

  const formData = {
    foo: 'Foo',
    bar: true
  }

  const rows = writable([{
    firstName: 'Tane',
    lastName: 'Piper',
    email: 'formula@svelte.codes',
    checkboxMulti: ['B', 'C'],
    checkbox: true,
    radio: 'A',
    selectOne: '2',
    selectMulti: ['1', '3']
  }, {
    firstName: 'Foo',
    lastName: 'McBarr',
    email: 'formula@svelte.codes',
    checkboxMulti: ['A', 'D'],
    checkbox: true,
    radio: 'B',
    selectOne: '3',
    selectMulti: ['1', '2']
  }, {
    firstName: 'Third',
    lastName: 'Man',
    email: 'formula1@svelte.codes',
    checkboxMulti: ['A', 'C'],
    checkbox: true,
    radio: 'C',
    selectOne: '1',
    selectMulti: ['2', '3']
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
    const formData = get(formValues);
    const groupData = get(contacts.formValues);
    console.log(formData, groupData);
  }

  const group = contacts.stores.formValues;
  $: console.log('contactValues', $contactValues);
</script>

<form use:form on:submit|preventDefault={onSubmit}>
  <label for='foo'>
    Foo
  </label>
  <input type='text' id='foo' name='foo' bind:value={formData.foo}/>

  <input type='checkbox' id='bar' name='bar' bind:checked={formData.bar}/>

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
      <tr>
        <td>
          <input type='text' id='firstName-{i}' name='firstName' required bind:value={row.firstName} />
        </td>
        <td>
          <input type='text' id='lastName-{i}' name='lastName' bind:value={row.lastName}/>
        </td>
        <td>
          <input type='text' id='email-{i}' name='email' bind:value={row.email}/>
        </td>
        <td>
          <input type='checkbox' id='checkbox-{i}' name='checkbox' bind:checked={row.checkbox} />
        </td>
        <td>
          <input type='checkbox' id='checkbox-multi-{i}-1' name='checkboxMulti' value='A'
                 bind:group={row.checkboxMulti} />
          <input type='checkbox' id='checkbox-multi-{i}-2' name='checkboxMulti' value='B'
                 bind:group={row.checkboxMulti} />
          <input type='checkbox' id='checkbox-multi-{i}-3' name='checkboxMulti' value='C'
                 bind:group={row.checkboxMulti} />
          <input type='checkbox' id='checkbox-multi-{i}-4' name='checkboxMulti' value='D'
                 bind:group={row.checkboxMulti} />
        </td>
        <td>
          <input type='radio' id='radio-{i}-1' name='radio-{i}' data-beaker-key='radio' value='A' bind:group={row.radio} />
          <input type='radio' id='radio-{i}-2' name='radio-{i}' data-beaker-key='radio' value='B' bind:group={row.radio} />
          <input type='radio' id='radio-{i}-3' name='radio-{i}' data-beaker-key='radio' value='C' bind:group={row.radio} />
          <input type='radio' id='radio-{i}-4' name='radio-{i}' data-beaker-key='radio' value='D' bind:group={row.radio} />
        </td>
        <td>
          <select name='selectOne' bind:value={row.selectOne}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>

          </select>
        </td>
        <td>
          <select name='selectMulti' multiple bind:value={row.selectMulti}>>
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

