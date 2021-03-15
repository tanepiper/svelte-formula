<script>
  import { formula } from '../../../../../dist/packages/svelte/formula';
  import { countryList } from './countries-list';

  let fetchingCountry = false;

  const addressForm = formula({});

  function locationSuccess(position) {
    console.dir(position);
  }


  function getGeolocation() {
    fetchingCountry = true;
    setTimeout(() => {
      fetchingCountry = false;
      addressForm.set({
        address1: 'Test'
      })
    }, 1000);


    // console.log(navigator.geolocation);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(locationSuccess, (error) => {
    //     console.log(error);
    //   });
    // }
  }



  let index = 0;
</script>

<div class='address-form' use:addressForm.form>
  <button type='button' on:click|preventDefault={getGeolocation}>
    Get current address
  </button>

  <div class='form-item'>
    <label for='address1-{index}'>Address 1</label>
    <input type='text' id='address1-{index}' name='address1' required />
  </div>
  <div class='form-item'>
    <label for='address2-{index}'>Address 2</label>
    <input type='text' id='address2-{index}' name='address2' />
  </div>
  <div class='form-item'>
    <label for='town-{index}'>Town</label>
    <input type='text' id='town-{index}' name='town' />
  </div>
  <div class='form-item'>
    <label for='country-{index}'>Country</label>
    <select id='country-{index}' name='country'>
      { #each Object.entries(countryList) as country }
        <option value={country[0]}>{country[1]}</option>
      {/each}
    </select>
  </div>
  <div class='form-item'>
    <label for='postcode-{index}'>Postcode</label>
    <input type='text' id='postcode-{index}' name='postcode' />
  </div>
</div>
