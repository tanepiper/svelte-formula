---
id: customer-rows

title: Example - Customer Rows

sidebar_label: Row Data
---

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';
  import { beaker, formula } from 'svelte-formula@0.8.1';

  const dispatch = createEventDispatcher();

  const { form, formValues, updateForm } = formula();

  // This creates a contact group - you can now bind `contacts.group` to the subgroup
  const customers = beaker();
  const customersValues = customers.formValues;

  export let productData = {
    productName: '',
  };

  // Set the store with any existing data
  export let contactData = [{
    firstName: 'Foo',
    lastName: 'McBar',
    email: 'foo@svelte.code',
    subscriptionLevel: 'partial',
    signups: ['daily', 'news'],
  }];

  customers.init(contactData);

  // Add a row to the store
  function addCustomer() {
    customers.add({
      firstName: '',
      lastName: '',
      email: '',
      subscriptionLevel: 'none',
      signups: [],
    });
  }

  // Remove a row from the store
  function deleteCustomer(index) {
    customers.delete(index);
  }

  function submit() {
    const mainForm = get(formValues);
    const contactValues = get(customersValues);
    //Do something with the data here

    dispatch('signup', {
      form: mainForm,
      contacts: contactValues
    });
  }
</script>


<form use:form on:submit|preventDefault={submit}>
  <label for='productName'>ProductName</label>
  <input type='text' id='productName' name='productName' required bind:value={productData.productName} />

  <button type='submit'>Submit Form</button>
  <button on:click|preventDefault={addCustomer}>Add Customer</button>
	<button on:click|preventDefault={() => customers.init(contactData)}>Reset Fields</button>
	<button on:click|preventDefault={() => customers.clear()}>Clear Fields</button>

  <table role="grid">
    <thead>
    <tr>
      <th colspan=3>Customer Data</th>
      <th>Subscription Level</th>
      <th>Subscriptions</th>
      <th></th>
    </tr>
    </thead>
    <tbody use:customers.group role="rowgroup">
    {#each $customersValues as row, i}
      <tr role="row">
        <td>
          <label for='firstName-{i}'>First Name</label>
          <input type='text' id='firstName-{i}' name='firstName' required />
        </td>
        <td>
          <label for='lastName-{i}'>Last Name</label>
          <input type='text' id='lastName-{i}' name='lastName' required />
        </td>
        <td>
          <label for='email-{i}'>Email Name</label>
          <input type='email' id='email-{i}' name='email' required />
        </td>
        <td>
          <!-- In multi-group forms, radio groups require a unique name in the DOM - her you can provide 'data-formula-name' to specify the data key -->
          <label for='subscriptionLevel-{i}-1'>None
            <input type='radio' id='subscriptionLevel-{i}-1'
                   name='subscriptionLevel-{i}'
                   data-formula-name='subscriptionLevel' value='none' />
          </label>

          <label for='subscriptionLevel-{i}-1'>Partial
            <input type='radio' id='subscriptionLevel-{i}-2'
                   name='subscriptionLevel-{i}'
                   data-formula-name='subscriptionLevel' value='partial' />
          </label>

          <label for='subscriptionLevel-{i}-1'>Full
            <input type='radio' id='subscriptionLevel-{i}-3'
                   name='subscriptionLevel-{i}'
                   data-formula-name='subscriptionLevel' value='full' />
          </label>

        </td>
        <label for='signups-{i}-1'>Daily <input type='checkbox' id='signups-{i}-1' name='signups' value='daily' /></label>

        <label for='signups-{i}-2'>Weekly
          <input type='checkbox' id='signups-{i}-2' name='signups' value='weekly' />
        </label>
        <label for='signups-{i}-3'>News
          <input type='checkbox' id='signups-{i}-3' name='signups' value='news'  />
        </label>
        <label for='signups-{i}-4'>Product
          <input type='checkbox' id='signups-{i}-4' name='signups' value='product' />
        </label>
        <td>
          <button on:click|preventDefault={() => deleteCustomer(i)}>X</button>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</form>
```
