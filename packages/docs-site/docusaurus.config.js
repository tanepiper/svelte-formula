module.exports = {
  title: 'Formula',
  tagline: 'Reactive Forms for Svelte',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'tanepiper', // Usually your GitHub org/user name.
  projectName: 'svelte-plugins', // Usually your repo name.
  themeConfig: {
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
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://www.npmjs.com/package/svelte-formula',
          label: 'NPM',
          position: 'right',
        },
        {
          href: 'https://github.com/tanepiper/svelte-plugins/tree/main/packages/svelte/formula',
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
          //editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
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
