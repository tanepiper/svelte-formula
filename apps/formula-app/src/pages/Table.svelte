<script type='ts'>
  import { get } from 'svelte/store';
  import { beaker, formula } from '../../../../dist/packages/svelte/formula';

  const testForm = formula();

  // This creates a contact group - you can now bind `contacts.group` to the subgroup
  const customers = beaker<{ firstName: string, lastName: string, email: string, subscriptionLevel: string, signups: string[] }>();
  const customersValues = customers.formValues;

  export let productData = {
    productName: '',
  };

  // Set the store with any existing data
  export let contactData = [];
  for (let i = 0; i < 10; i++) {
    contactData.push({
      firstName: '',
      lastName: '',
      email: '',
      subscriptionLevel: '',
      signups: [],
    })
  }

  customers.init(contactData);

  // Add a row to the store
  function addCustomer() {
    customers.add({
      firstName: '',
      lastName: '',
      email: '',
      subscriptionLevel: '',
      signups: [],
    });
  }

  // Remove a row from the store
  function deleteCustomer(index) {
    customers.delete(index);
  }

  function submit() {
    const mainForm = get(testForm.formValues);
    const contacts = get(customersValues);
    //Do something with the data here
    console.log(mainForm, contacts);
  }

  $: console.log($customersValues)
</script>

<form use:testForm.form on:submit|preventDefault={submit}>
  <label for='productName'>ProductName</label>
  <input type='text' id='productName' name='productName' required bind:value={productData.productName} />

  <button type='submit'>Submit Form</button>
  <button on:click|preventDefault={addCustomer}>Add Customer</button>
  <button on:click|preventDefault={() => customers.clear()}>Clear</button>
  <button on:click|preventDefault={() => customers.reset()}>Reset</button>
  <table>
    <thead>
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th>Subscription Level</th>
      <th>Subscriptions</th>
      <th></th>
    </tr>
    </thead>
    <tbody use:customers.group>
    {#each $customersValues as row, i}
      <tr>
        <td>
          <label for='firstName-{i}'>First Name</label>
          <input type='text' id='firstName-{i}' name='firstName' required bind:value={row.firstName} />
        </td>
        <td>
          <label for='lastName-{i}'>Last Name</label>
          <input type='text' id='lastName-{i}' name='lastName' bind:value={row.lastName} required />
        </td>
        <td>
          <label for='email-{i}'>Email Name</label>
          <input type='email' id='email-{i}' name='email' bind:value={row.email} required />
        </td>
        <td>
          <!-- In multi-group forms, radio groups require a unique name in the DOM - her you can provide 'data-beaker-key' to specify the data key -->
          <label for='subscriptionLevel-{i}-1'>None
            <input type='radio' id='subscriptionLevel-{i}-1'
                   name='subscriptionLevel-{i}'
                   data-beaker-key='subscriptionLevel' value='none'
                   bind:group={row.subscriptionLevel} />
          </label>

          <label for='subscriptionLevel-{i}-1'>Partial
            <input type='radio' id='subscriptionLevel-{i}-2'
                   name='subscriptionLevel-{i}'
                   data-beaker-key='subscriptionLevel' value='partial'
                   bind:group={row.subscriptionLevel} />
          </label>

          <label for='subscriptionLevel-{i}-1'>Full
            <input type='radio' id='subscriptionLevel-{i}-3'
                   name='subscriptionLevel-{i}'
                   data-beaker-key='subscriptionLevel' value='full'
                   bind:group={row.subscriptionLevel} />
          </label>

        </td>
        <label for='signups-{i}-1'>Daily <input type='checkbox' id='signups-{i}-1' name='signups' value='daily'
                                                bind:group={row.signups} /></label>

        <label for='signups-{i}-2'>Weekly
          <input type='checkbox' id='signups-{i}-2' name='signups' value='weekly'
                 bind:group={row.signups} />
        </label>
        <label for='signups-{i}-3'>News
          <input type='checkbox' id='signups-{i}-3' name='signups' value='news'
                 bind:group={row.signups} />
        </label>
        <label for='signups-{i}-4'>Product
          <input type='checkbox' id='signups-{i}-4' name='signups' value='product'
                 bind:group={row.signups} />
        </label>
        <td>
          <button on:click|preventDefault={() => deleteCustomer(i)}>X</button>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</form>

