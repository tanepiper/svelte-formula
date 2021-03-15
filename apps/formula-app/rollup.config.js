module.exports = (config) => {
  const { output, external, ...rest } = config;

  const updatedOutput = {
    ...output,
    globals: [
      ...(output?.globals ?? []),
      {
        moduleId: 'svelte-formula',
        global: 'SvelteFormula',
      },
    ],
  };

  return {
    ...rest,
    output: { ...updatedOutput },
  };
};
