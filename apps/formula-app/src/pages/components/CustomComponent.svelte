<script>

  export let value = 0;

  export let name = '';

  export let required = false;

  let el;

  function emitEvent() {
    setTimeout(() => el.dispatchEvent(new Event('customEvent')), 0)
  }

</script>
<div id={name}>
  <button type='button' id='minus' on:click={() => {
    value--;
    el.dispatchEvent(new Event('customEvent'))
  }}>
    -
  </button>

  <input type='number' bind:this={el} name={name} bind:value={value} required={required}
         data-formula-bind='customEvent|keyup' />

  <button type='button' id='plus' on:click={() => {
    value++;
    console.log(value, el.value);
    emitEvent()
  }}>
    +
  </button>
</div>
