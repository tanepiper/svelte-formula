module.exports = {
  title: 'Formula',
  tagline: 'Zero Configuration Reactive Forms for Svelte',
  url: 'https://tanepiper.github.io/',
  baseUrl: '/svelte-formula/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'tanepiper', // Usually your GitHub org/user name.
  projectName: 'svelte-formula', // Usually your repo name.
  plugins: [require.resolve('docusaurus-plugin-fathom')],
  themeConfig: {
    fathomAnalytics: {
      siteId: 'NOVPWZMR',
    },
    navbar: {
      title: 'Formula',
      logo: {
        alt: 'The Formula logo containing a molecule and two science beakers',
        src: 'img/logo-small.png',
      },
      items: [
        {
          to: 'docs/formula',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/tanepiper/svelte-formula/blob/main/CHANGELOG.md',
          label: 'Changelog',
          position: 'left',
        },

        {
          href: 'https://www.npmjs.com/package/svelte-formula',
          label: 'NPM',
          position: 'right',
        },
        {
          href: 'https://github.com/tanepiper/svelte-formula',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Tane Piper. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          //editUrl: 'https://github.com/tanepiper/svelte-formula/edit/master/packages/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          //editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
