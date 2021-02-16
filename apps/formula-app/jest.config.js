module.exports = {
  displayName: 'formula-app',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'svelte'],
  coverageDirectory: '../../coverage/apps/formula-app',
};
