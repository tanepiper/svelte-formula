---
id: beaker

title: Beaker API

sidebar_label: Beaker API
---

Beaker is Formula's API that helps with the creation of multi-row forms using lists of data (e.g. contact or product
list).

> **Beaker is still in active development - as such there may still be API changes**

Under-the-hood it uses Formula to create a form from a row of data provided, and works well with Svelte's `{#each}`
blocks to render the form component.

When creating a group it's possible to set any existing data, and add and remove rows in the store using helper methods,
and using the store to render the component HTML.

## Usage

Like `formula` you import the `beaker` function. This function returns an object that is the entire group functionality.

```svelte
import { beaker } from 'svelte-formula';

const myGroup = beaker();
```

To bind the group to a component pass `<myGroup>.group` to `use`, then inside the group provide an `{#each}` block that
will contain the template for your group form.

Stores are available via `<myGroup>.stores` object - the names are the same as the [Formula Stores](../stores/stores.md)
- the main difference is that the data is an Array of objects instead of a single object.

### Adding and Removing items

Adding and removing items to the store is easy - there is a [data api](data.md) for handling data.

You can initialise a group with `<myGroup>.init(items)` passing an array of items for your form group to be initialised
with.

To add another item call `<myGroup>.add(item)` with your item to add. To remove an item call `<myGroup>.delete(index)`
with the numerical index of the array item to remove.

### Note about `radio` groups

Due to the way [HTML Radio Groups](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) work it is
required to have unique names as well as ID properties in your HTML. To support this you can provide a `data-beaker-key`
attribute on any radio groups - this will match the group back to the correct data.

## Example

```svelte
<script>
  import { get } from 'svelte/store';
  import { beaker, formula } from 'svelte-formula';

  const { form, formValues, updateForm } = formula();

  // This creates a contact group - you can now bind `contacts.group` to the subgroup
  const customers = beaker();
  const customersValues = customers.formValues;

  export let productData = {
    productName: '',
  };

  // Set the store with any existing data
  export let contactData = [{
    firstName: '',
    lastName: '',
    email: '',
    subscriptionLevel: '',
    signups: [],
  }];

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
    const mainForm = get(formValues);
    const contacts = get(customersValues);
    //Do something with the data here
    console.log(mainForm, contacts);
  }
</script>

<form use:form on:submit|preventDefault={submit}>
  <label for='productName'>ProductName</label>
  <input type='text' id='productName' name='productName' required bind:value={productData.productName} />

  <button type='submit'>Submit Form</button>
  <button on:click|preventDefault={addCustomer}>Add Customer</button>

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
          <!-- In multi-group forms, radio groups require a unique name in the DOM - her you can provide 'data-beaker-key' to specify the data key -->
          <label for='subscriptionLevel-{i}-1'>None
            <input type='radio' id='subscriptionLevel-{i}-1'
                   name='subscriptionLevel-{i}'
                   data-beaker-key='subscriptionLevel' value='none' />
          </label>

          <label for='subscriptionLevel-{i}-1'>Partial
            <input type='radio' id='subscriptionLevel-{i}-2'
                   name='subscriptionLevel-{i}'
                   data-beaker-key='subscriptionLevel' value='partial' />
          </label>

          <label for='subscriptionLevel-{i}-1'>Full
            <input type='radio' id='subscriptionLevel-{i}-3'
                   name='subscriptionLevel-{i}'
                   data-beaker-key='subscriptionLevel' value='full' />
          </label>

        </td>
        <label for='signups-{i}-1'>Daily <input type='checkbox' id='signups-{i}-1' name='signups' value='daily' /></label>

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
```
