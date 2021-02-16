module.exports = (config) => {
  console.log('called');
  const { output, external, ...rest } = config;

  const updatedOutput = {
    ...output,
    globals: [
      {
        moduleId: 'svelte-formula',
        global: 'SvelteFormula',
      },
    ],
  };
  const updatedExternal = [...[external || []], 'svelte-formula'];
  const result ={
    ...rest,
    output: { ...updatedOutput },
    external: [...updatedExternal],
  };
  return result
};
