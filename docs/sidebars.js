/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Introduction to OpenFGA',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'What is OpenFGA',
          id: 'content/intro/authorization-and-openfga',
        },
        {
          type: 'doc',
          label: 'Setup an OpenFGA server',
          id: 'content/intro/setup-openfga',
        },
        {
          type: 'doc',
          label: 'OpenFGA Concepts',
          id: 'content/intro/openfga-concepts',
        },
        {
          type: 'doc',
          label: 'Auth0 FGA Playground',
          id: 'content/intro/playground',
        },
      ],
    },
    {
      type: 'category',
      collapsible: true,
      collapsed: true,
      label: 'Define your authorization model',
      items: [
        {
          type: 'doc',
          label: 'Overview',
          id: 'content/modeling/overview',
        },
        {
          type: 'doc',
          label: 'Getting Started',
          id: 'content/modeling/getting-started',
        },
        {
          type: 'doc',
          label: 'Configuration Language',
          id: 'content/modeling/configuration-language',
        },
        {
          type: 'doc',
          label: 'Modeling Basics',
          id: 'content/modeling/basics/modeling-basics',
        },
        {
          type: 'doc',
          label: 'Modeling User Groups',
          id: 'content/modeling/basics/user-groups',
        },
        {
          type: 'doc',
          label: 'Modeling Roles and Permissions',
          id: 'content/modeling/basics/roles-and-permissions',
        },
        {
          type: 'doc',
          label: 'Modeling Parent-Child Objects',
          id: 'content/modeling/basics/parent-child',
        },
        {
          type: 'doc',
          label: 'Modeling Blocklists',
          id: 'content/modeling/basics/blocklists',
        },
        {
          type: 'doc',
          label: 'Modeling Public Access',
          id: 'content/modeling/basics/public-access',
        },
        {
          type: 'doc',
          label: 'Modeling with Multiple Restrictions',
          id: 'content/modeling/basics/multiple-restrictions',
        },
        {
          type: 'doc',
          label: 'Modeling Custom Roles',
          id: 'content/modeling/basics/custom-roles',
        },
        {
          type: 'doc',
          label: 'Contextual and Time-Based Authorization',
          id: 'content/modeling/basics/contextual-time-based-authorization',
        },
        {
          type: 'doc',
          label: 'Authorization Through Organization Context',
          id: 'content/modeling/basics/organization-context-authorization',
        },
        {
          type: 'category',
          collapsed: true,
          collapsible: true,
          label: 'Modeling Concepts',
          items: [
            {
              type: 'doc',
              label: 'Direct Relationships',
              id: 'content/modeling/concepts/direct-relationships',
            },
            {
              type: 'doc',
              label: 'Concentric Relationships',
              id: 'content/modeling/concepts/concentric-relationships',
            },
            {
              type: 'doc',
              label: 'Object to Object Relationships',
              id: 'content/modeling/concepts/object-to-object-relationships',
            },
            {
              type: 'doc',
              label: 'Usersets',
              id: 'content/modeling/concepts/usersets',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Write Your Authorization Data',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'Overview',
          id: 'content/writing-data/overview',
        },
        {
          type: 'doc',
          label: 'Managing User Access',
          id: 'content/writing-data/managing-user-access',
        },
        {
          type: 'doc',
          label: 'Managing Group Access',
          id: 'content/writing-data/managing-group-access',
        },
        {
          type: 'doc',
          label: 'Managing Group Membership',
          id: 'content/writing-data/managing-group-membership',
        },
        {
          type: 'doc',
          label: 'Managing Relationships Between Objects',
          id: 'content/writing-data/managing-relationships-between-objects',
        },
        {
          type: 'doc',
          label: 'Transactional Writes',
          id: 'content/writing-data/transactional-writes',
        },
        {
          type: 'category',
          collapsed: true,
          collapsible: true,
          label: 'Advanced',
          items: [
            {
              type: 'doc',
              label: 'Check, Read and Expand',
              id: 'content/writing-data/advanced/check-read-expand',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      collapsible: true,
      collapsed: true,
      label: 'Add Authorization To Your API',
      items: [
        {
          type: 'doc',
          label: 'Overview',
          id: 'content/integration/overview',
        },
        {
          type: 'doc',
          label: 'How to install the SDK',
          id: 'content/integration/install-sdk',
        },
        {
          type: 'doc',
          label: 'How to setup SDK client',
          id: 'content/integration/setup-sdk-client',
        },
        {
          type: 'doc',
          label: 'How to create a store',
          id: 'content/integration/create-store',
        },
        {
          type: 'doc',
          label: 'How to update relationship tuples',
          id: 'content/integration/update-tuples',
        },
        {
          type: 'doc',
          label: 'How to perform a check',
          id: 'content/integration/perform-check',
        },
        {
          type: 'doc',
          label: 'How to integrate within a framework',
          id: 'content/integration/framework',
        },
        {
          type: 'category',
          collapsed: true,
          collapsible: true,
          label: 'Advanced',
          items: [
            {
              type: 'doc',
              label: 'How to get tuple changes',
              id: 'content/integration/read-tuple-changes',
            },
            {
              type: 'doc',
              label: 'Search with permissions',
              id: 'content/integration/advanced/search-with-permissions',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      collapsible: true,
      collapsed: true,
      label: 'Advanced Modeling',
      items: [
        {
          type: 'doc',
          label: 'Overview',
          id: 'content/modeling/advanced/overview',
        },
        {
          type: 'category',
          label: 'Modeling samples',
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: 'doc',
              label: 'Modeling Google Drive',
              id: 'content/modeling/advanced/use-cases/gdrive',
            },
            {
              type: 'doc',
              label: 'Modeling GitHub',
              id: 'content/modeling/advanced/use-cases/github',
            },
            {
              type: 'doc',
              label: 'Modeling Slack',
              id: 'content/modeling/advanced/use-cases/slack',
            },
            {
              type: 'doc',
              label: 'Modeling for IoT',
              id: 'content/modeling/advanced/use-cases/iot',
            },
          ],
        },
        {
          type: 'category',
          collapsible: true,
          collapsed: true,
          label: 'Modeling patterns',
          items: [
            {
              type: 'doc',
              label: 'Entitlements',
              id: 'content/modeling/advanced/patterns/entitlements',
            },
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
