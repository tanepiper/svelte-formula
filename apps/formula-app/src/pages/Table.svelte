<script type='ts'>
  import { get } from 'svelte/store';
  import { beaker, formula } from '../../../../dist/packages/svelte/formula';

  const testForm = formula();

  // This creates a contact group - you can now bind `contacts.group` to the subgroup
  const customers = beaker<{ firstName: string, lastName: string, email: string, subscriptionLevel: string, signups: string[] }>({
    defaultValues: [{
      firstName: 'Add',
      lastName: 'Customer',
      email: '',
      subscriptionLevel: 'none',
      signups: [],
    }],
    validators: {
      signups: {
        selectTwo: value => value.length > 1 ? null : 'Select two subscriptions',
      },
    },
  });
  const customersValues = customers.formValues;
  const validityValues = customers.validity;

  export let productData = {
    productName: '',
  };


  function getContactData(len?: number) {
    if (len) {
      const result = new Array(len)
      result.fill({
        firstName: 'Finn',
        lastName: 'McSvelte',
        email: 'foo@bar.com',
        subscriptionLevel: 'full',
        signups: ['weekly', 'news'],
      })
      return result
    } else {
      return [{
        firstName: 'Finn',
        lastName: 'McSvelte',
        email: 'foo@bar.com',
        subscriptionLevel: 'full',
        signups: ['weekly', 'news'],
      }, {
        firstName: 'Bob',
        lastName: 'McCool',
        email: 'bar@foo.com',
        subscriptionLevel: 'partial',
        signups: ['daily', 'news'],
      }];
    }
  }

  customers.init(getContactData(10));

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

  function updateItem() {
    customers.set(1, {
      firstName: 'Bob',
      lastName: 'McCool',
      email: 'bar@svelte.codes',
      subscriptionLevel: '',
      signups: [],
    });
  }

  $: console.log($customersValues);
  $: console.log($validityValues);
</script>

<form use:testForm.form on:submit|preventDefault={submit}>
  <label for='productName'>ProductName</label>
  <input type='text' id='productName' name='productName' required bind:value={productData.productName} />

  <button type='submit'>Submit Form</button>
  <button on:click|preventDefault={addCustomer}>Add Customer</button>
  <button on:click|preventDefault={() => customers.clear()}>Clear</button>
  <button on:click|preventDefault={() => updateItem()}>?</button>
  <button on:click|preventDefault={() => {
    testForm.resetForm();
    customers.init(getContactData())}
    }>Reset
  </button>
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
                   data-formula-name='subscriptionLevel' value='none'
                   required
            />
          </label>

          <label for='subscriptionLevel-{i}-1'>Partial
            <input type='radio' id='subscriptionLevel-{i}-2'
                   name='subscriptionLevel-{i}'
                   data-formula-name='subscriptionLevel' value='partial'
                   required
            />
          </label>

          <label for='subscriptionLevel-{i}-1'>Full
            <input type='radio' id='subscriptionLevel-{i}-3'
                   name='subscriptionLevel-{i}'
                   data-formula-name='subscriptionLevel' value='full'
                   required
            />
          </label>

        </td>
        <label for='signups-{i}-1'>Daily <input type='checkbox' id='signups-{i}-1' name='signups'
                                                value='daily' /></label>

        <label for='signups-{i}-2'>Weekly
          <input type='checkbox' id='signups-{i}-2' name='signups' value='weekly' />
        </label>
        <label for='signups-{i}-3'>News
          <input type='checkbox' id='signups-{i}-3' name='signups' value='news' />
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

