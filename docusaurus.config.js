// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const baseUrl = process.env.BASE_URL ?? '/';

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OpenFGA Docs',
  tagline: 'Relationship-based access control made fast, scalable, and easy to use.',
  url: 'https://openfga.dev/',
  baseUrl: baseUrl,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/img/openfga-icon.svg',
  organizationName: 'openfga',
  projectName: 'openfga.dev',
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  deploymentBranch: 'gh-pages',
  customFields: {
    resources: [
      {
        text: 'Zanzibar Academy →',
        href: 'https://zanzibar.academy/',
        icon: 'ZanzibarIcon',
      },
      {
        text: 'Spotify - Authorization in Software →',
        href: 'https://open.spotify.com/show/2Umz6EzzPZZiCKUcj4bfrC?si=941a0081fd6c4e28',
        icon: 'PodcastIcon',
      },
      {
        text: 'Apple - Authorization in Software →',
        href: 'https://podcasts.apple.com/us/podcast/authorization-in-software/id1588308205',
        icon: 'PodcastIcon',
      },
      {
        text: 'Looking for a cloud hosted service? →',
        href: 'https://fga.dev/',
        icon: 'CloudIcon',
      },
    ],
    disableStatusFooter: true,
    feedback: {
      defaultTitle: 'Have Feedback?',
      defaultText: 'Join us on the Discord community if you have any questions or suggestions.',
      defaultButtonText: 'Join Discord',
      defaultLink: 'https://discord.gg/8naAwJfWN6',
    },
    // location of the swagger file
    apiDocsBasePath: process.env.API_DOCS_PATH ? process.env.API_DOCS_PATH : 'https://raw.githubusercontent.com/openfga/api/main/docs/openapiv2/apidocs.swagger.json',

    // Customization for product information
    /* eslint-disable max-len */
    description: `OpenFGA is an open source Fine-Grained Authorization solution based on Google's Zanzibar.`,
    productName: `OpenFGA`,
    // link to product description section (relative to baseURL)
    introLink: `intro/authorization-and-openfga`,
    productDescriptionSection: `#what-is-openfga`,
    // link to the concept page (relative to baseURL)
    conceptLink: `intro/openfga-concepts`,
    longProductName: `OpenFGA`,

    // define playgroundName and playgroundURL if you want to show your examples through playground
    //playgroundName: '',
    //playgroundURL: '',

    notice: `OpenFGA is an open source Fine-Grained Authorization solution based on Google's Zanzibar. We welcome community contribution to this project.`,
    widget: {
      legend: {
        user: '#E9786E',
        relation: '#E571D0',
        object: 'blue.light',
      },
      stringTemplates: {
        rpc: `Request:
check("{{user}}", "{{relation}}", "{{object}}")
---
Response:
{{passing}}`,
        json: `Request:
POST /check
Content-Type: application/json
{ "user": "{{user}}", "relation": "{{relation}}", "object": "{{object}}" }
---
Response:
{ "allowed": {{passing}} }`,
      },
    },
    languageMapping: {
      js: {
        importStatement: `const { OpenFgaApi } = require('@openfga/sdk');`,
        apiName: `OpenFgaApi`,
        setupNote: `// ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.\n`,
      },
      go: {
        importStatement: `fgaSdk "github.com/openfga/go-sdk"`,
        apiName: `OpenFgaApi`,
        setupNote: `// ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.\n`,
      },
      dotnet: {
        importStatement: `using OpenFga.Sdk.Api;
using OpenFga.Sdk.Configuration;`,
        apiName: `OpenFgaApi`,
        setupNote: `// ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.\n`,
      },
    },
    contentSecurityPolicy: `default-src 'none';
      base-uri 'self';
      block-all-mixed-content;
      child-src www.youtube-nocookie.com;
      prefetch-src 'self';
      connect-src 'self' https://raw.githubusercontent.com https://s3.amazonaws.com https://cdn.cookielaw.org https://privacyportal.onetrust.com https://heapanalytics.com;
      font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
      form-action 'none';
      frame-src www.youtube-nocookie.com;
      img-src 'self' data: https://pbs.twimg.com https://docs.github.com https://heapanalytics.com;
      media-src 'none';
      object-src 'none';
      script-src 'self' ${process.env.NODE_ENV === 'development' ? `'unsafe-eval'` : ``} 'unsafe-inline' https://cdn.cookielaw.org https://geolocation.onetrust.com https://cdn.heapanalytics.com;
      style-src 'unsafe-inline' 'self' https://fonts.googleapis.com;`,
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
        docsDir: 'docs/content',
        docsRouteBasePath: '/',
      },
    ],
  ],
  plugins: [
    require.resolve('./webpack-overrides.docusaurus-plugin'),
    [
      '@docusaurus/plugin-client-redirects',
      /** @type {import('@docusaurus/plugin-client-redirects').Options} */
      ({
        fromExtensions: ['html'],
        createRedirects: (path) => {},
        redirects: [
          {
            to: '/api/service',
            from: ['/api'],
          },
        ],
      }),
    ],
    [
      'docusaurus-plugin-module-alias',
      {
        alias: {
          '@components': path.resolve(__dirname, './src/components'),
          '@features': path.resolve(__dirname, './src/features'),
          '@static': path.resolve(__dirname, './static'),
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        debug: isDev,
        docs: {
          sidebarPath: require.resolve('./docs/sidebars.js'),
          routeBasePath: '/',
          showLastUpdateAuthor: false,
          editUrl: 'https://github.com/openfga/openfga.dev/edit/main/',
        },
        theme: {
          customCss: [path.resolve('static/css/openfga.css'), path.resolve('src/css/custom.css')],
        },
      }),
    ],
  ],

  scripts: [
    {
      src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
      type: 'text/javascript',
      charset: 'UTF-8',
      id: 'consent-script',
      'data-domain-script': process.env.COOKIE_PRO_DATA_DOMAIN_ID,
    },
    {
      src: 'scripts/heap.js',
      type: 'text/plain',
      class: 'optanon-category-2',
      id: 'heap-script',
      'heap-id': process.env.HEAP_ID,
    },
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
      },
      announcementBar: {
        id: 'announcementBar.3', // Increment on change
        // eslint-disable-next-line max-len
        content: `OpenFGA is an open source Fine-Grained Authorization solution based on Google's Zanzibar. We welcome community contribution to this project.`,
      },
      navbar: {
        // style: "primary",
        // title: "OpenFGA",
        logo: {
          alt: 'OpenFGA',
          src: 'img/openfga_logo.svg',
          href: '/',
          target: '_self',
          // height: "5rem",
        },
        items: [
          {
            to: '/',
            label: 'Home',
          },
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          { to: '/api/service', label: 'API', position: 'left' },
          {
            to: 'https://twitter.com/OpenFGA',
            label: 'Twitter',
            position: 'right',
            className: 'header-social header-twitter-link',
            'aria-label': 'OpenFGA on Twitter',
          },
          {
            to: 'https://discord.gg/8naAwJfWN6',
            label: 'Discord',
            position: 'right',
            className: 'header-social header-discord-link',
            'aria-label': 'OpenFGA on Discord',
          },
          {
            to: 'https://github.com/openfga',
            position: 'right',
            label: 'Github',
            className: 'header-social header-github-link',
            'aria-label': 'OpenFGA on GitHub',
          },
        ],
      },
      footer: {
        links: [
          {
            to: 'https://twitter.com/OpenFGA',
            className: 'header-social header-twitter-link',
            'aria-label': 'OpenFGA on Twitter',
            label: 'Twitter',
          },
          {
            to: 'https://discord.gg/8naAwJfWN6',
            className: 'header-social header-discord-link',
            'aria-label': 'OpenFGA on Discord',
            label: 'Discord',
          },
          {
            to: 'https://github.com/openfga',
            className: 'header-social header-github-link',
            'aria-label': 'OpenFGA on GitHub',
            label: 'Github',
          },
        ],
        copyright: `@ ${new Date().getFullYear()}`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['json5', 'csharp'],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
    }),
};

module.exports = config;
