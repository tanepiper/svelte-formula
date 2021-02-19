<script>
  import { formula } from '../../../../dist/packages/svelte/formula';

  const formValidators = {
    passwordsMatch: (values) => values.password === values.passwordMatch ? null : 'Passwords Must Match',
  };

  const { form, formValues, submitValues, formValidity, validity, touched, dirty, isFormValid, resetForm } = formula({
    defaultValues: {
      username: 'foo@abr.com',
      'select-me-multi': ['a', 'c'],
      animal: ['Dog', 'Cat'],
      'remember-me': 'no',
    },
    messages: {
      username: {
        valueMissing: 'You really must fill in this field',
      },
    },
    validators: {
      username: {
        inDomain: (value) => value.includes('@svelte.dev') ? null : 'You can only sign up with a @svelte.dev email',
      },
    },
    formValidators,
  });

  // $: console.log('submit', $submitValues);
  //$: console.log('current', $formValues);
  // $: console.log('validity', $validity);
  // $: console.log('formValidity', $formValidity);
  // $: console.log('touched', $touched);
  // $: console.log('dirty', $dirty);
  // $: console.log('form valid', $isFormValid);

  let imgDisplay;

  $: formValues.subscribe(v => {
    if (v.file instanceof FileList) {
      if (v.file.length === 0 && imgDisplay) {
        imgDisplay.src = '';
      }
      for (const file of v.file) {
        imgDisplay = document.createElement('img');
        imgDisplay.src = URL.createObjectURL(file);
      }
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
  }

  function resetFormData() {
    console.log(resetForm, 'reset');
    resetForm();
  }
</script>


<form use:form on:submit={handleSubmit}>
  <div class='form-field'>
    <label for='username'>Username</label>
    <input type='email' id='username' name='username' required
           data-value-missing='There is a value missing'
           class:error={$touched?.username && $validity?.username?.invalid} />
    <div hidden={$validity?.username?.valid}>{$validity?.username?.message}</div>
  </div>

  <div class='form-field'>
    <label for='password'>Password</label>
    <input type='password' id='password' name='password' required minlength='8'
           class:error={$touched?.password && $validity?.password?.invalid} />
    <div hidden={$validity?.password?.valid}>{$validity?.password?.message}</div>

    <label for='passwordMatch'>Password Match</label>
    <input type='password' id='passwordMatch' name='passwordMatch' required minlength='8'
           class:error={$touched?.passwordMatch && $validity?.passwordMatch?.invalid} />
    <div hidden={$validity?.passwordMatch?.valid}>{$validity?.passwordMatch?.message}</div>
    <br />
    <div hidden={!$formValidity?.passwordsMatch}>{$formValidity?.passwordsMatch}</div>
  </div>

  <div class='form-field'>
    <label for='text1'>Multiple Text 1</label>
    <input type='text' id='text1' name='same-text' />
    <label for='text2'>Multiple Text 2</label>
    <input type='text' id='text2' name='same-text' />
  </div>

  <div class='form-field'>
    <label for='number'>Enter a random Number</label>
    <input type='number' id='number' name='number' />
  </div>

  <div class='form-field'>
    <label for='range'>Range</label>
    <input type='range' id='range' name='range' min='0' max='100' step='1' />
    <label for='range1'>Range</label>
    <input type='range' id='range1' name='range' min='0' max='100' step='2' />
  </div>

  <div class='form-field'>
    <label for='file'>File</label>
    <input type='file' id='file' name='file' accept='.jpg, .jpeg, .png' />
    <img hidden={!imgDisplay?.src} src={imgDisplay?.src} />
  </div>

  <div class='form-field'>
    <label for='date'>Date</label>
    <input type='date' id='date' name='date' />
  </div>

  <div class='form-field'>
    <label for='color'>Color</label>
    <input type='color' id='color' name='color' />
  </div>

  <div class='form-field'>
    <label for='url'>Enter a URL</label>
    <input type='url' id='url' name='url' class:error={$touched?.url && $validity?.url?.invalid} />
    <div hidden={$validity?.url?.valid}>{$validity?.url?.message}</div>
  </div>

  <div class='form-field'>
    <label for='subscribe'>Subscribe To Our Newsletter</label>
    <input type='checkbox' id='subscribe' name='subscribe' />
  </div>

  <div class='form-field'>
    <span>Select Animal</span>
    <label for='dog'>Dog</label>
    <input type='checkbox' id='dog' name='animal' value='Dog' />
    <label for='cat'>Cat</label>
    <input type='checkbox' id='cat' name='animal' value='Cat' />
    <label for='bird'>Bird</label>
    <input type='checkbox' id='bird' name='animal' value='Bird' />
  </div>

  <div class='form-field'>
    <label for='select-me'>Select only one of me</label>
    <select id='select-me' name='select-me'>
      <option value='' disabled>Select Option</option>
      <option value='a'>A</option>
      <option value='b'>B</option>
      <option value='c'>C</option>
    </select>
  </div>

  <div class='form-field'>
    <label for='select-me-multi'>Select Multple of me!</label>
    <select id='select-me-multi' name='select-me-multi' multiple>
      <option value='' disabled>Select Option</option>
      <option value='a'>A</option>
      <option value='b'>B</option>
      <option value='c'>C</option>
    </select>
  </div>

  <div class='form-field'>
    <span>Remember Me?</span>
    <label for='remember-yes'>Yes</label>
    <input type='radio' id='remember-yes' name='remember-me' value='yes' required />
    <label for='remember-no'>No</label>
    <input type='radio' id='remember-no' name='remember-me' value='no' required />
  </div>

  <button disabled={!$isFormValid}>Save</button>
  <button type='button' on:click|preventDefault={resetFormData}>Reset</button>

</form>

<style>
  .form-field {
    margin-bottom: 10px;
    border-bottom: 1px solid lightgrey;
  }

  .error {
    border: 1px solid red;
  }

</style>
