/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'doc',
      label: 'What is OpenFGA',
      id: 'content/intro/authorization-and-openfga',
    },
    {
      type: 'doc',
      label: 'Concepts',
      id: 'content/intro/openfga-concepts',
    },
    {
      type: 'doc',
      label: 'Configuration Language',
      id: 'content/modeling/configuration-language',
    },
    {
      type: 'category',
      collapsible: true,
      collapsed: false,
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'content/integration/overview',
      },
      items: [
        {
          type: 'doc',
          label: 'Setup OpenFGA Server',
          id: 'content/intro/setup-openfga',
        },
        {
          type: 'doc',
          label: 'Install SDK Client',
          id: 'content/integration/install-sdk',
        },
        {
          type: 'doc',
          label: 'Create a Store',
          id: 'content/integration/create-store',
        },
        {
          type: 'doc',
          label: 'Setup SDK Client for Store',
          id: 'content/integration/setup-sdk-client',
        },
        {
          type: 'doc',
          label: 'Update Relationship Tuples',
          id: 'content/integration/update-tuples',
        },
        {
          type: 'doc',
          label: 'Perform a Check',
          id: 'content/integration/perform-check',
        },
        {
          type: 'doc',
          label: 'Integrate Within a Framework',
          id: 'content/integration/framework',
        },
      ],
    },
    {
      type: 'category',
      collapsible: true,
      collapsed: true,
      label: 'Modeling Guides',
      link: {
        type: 'doc',
        id: 'content/modeling/overview',
      },
      items: [
        {
          type: 'doc',
          label: 'Get Started with Modeling',
          id: 'content/modeling/getting-started',
        },
        {
          type: 'doc',
          label: 'Direct Access',
          id: 'content/modeling/basics/modeling-basics',
        },
        {
          type: 'doc',
          label: 'User Groups',
          id: 'content/modeling/basics/user-groups',
        },
        {
          type: 'doc',
          label: 'Roles and Permissions',
          id: 'content/modeling/basics/roles-and-permissions',
        },
        {
          type: 'doc',
          label: 'Parent-Child Objects',
          id: 'content/modeling/basics/parent-child',
        },
        {
          type: 'doc',
          label: 'Blocklists',
          id: 'content/modeling/basics/blocklists',
        },
        {
          type: 'doc',
          label: 'Public Access',
          id: 'content/modeling/basics/public-access',
        },
        {
          type: 'doc',
          label: 'Multiple Restrictions',
          id: 'content/modeling/basics/multiple-restrictions',
        },
        {
          type: 'doc',
          label: 'Custom Roles',
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
          label: 'Building Blocks',
          link: {
            type: 'doc',
            id: 'content/modeling/concepts/overview',
          },
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
        {
          type: 'category',
          collapsible: true,
          collapsed: true,
          label: 'Advanced Use-Cases',
          link: {
            type: 'doc',
            id: 'content/modeling/advanced/overview',
          },
          items: [
            {
              type: 'doc',
              label: 'Google Drive',
              id: 'content/modeling/advanced/use-cases/gdrive',
            },
            {
              type: 'doc',
              label: 'GitHub',
              id: 'content/modeling/advanced/use-cases/github',
            },
            {
              type: 'doc',
              label: 'Slack',
              id: 'content/modeling/advanced/use-cases/slack',
            },
            {
              type: 'doc',
              label: 'IoT',
              id: 'content/modeling/advanced/use-cases/iot',
            },
            {
              type: 'doc',
              label: 'Entitlements',
              id: 'content/modeling/advanced/patterns/entitlements',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Interacting with the API',
      collapsible: true,
      collapsed: true,
      link: {
        type: 'doc',
        id: 'content/writing-data/overview',
      },
      items: [
        {
          type: 'doc',
          label: 'Manage User Access',
          id: 'content/writing-data/managing-user-access',
        },
        {
          type: 'doc',
          label: 'Manage Group Access',
          id: 'content/writing-data/managing-group-access',
        },
        {
          type: 'doc',
          label: 'Manage Group Membership',
          id: 'content/writing-data/managing-group-membership',
        },
        {
          type: 'doc',
          label: 'Manage Relationships Between Objects',
          id: 'content/writing-data/managing-relationships-between-objects',
        },
        {
          type: 'doc',
          label: 'Transactional Writes',
          id: 'content/writing-data/transactional-writes',
        },
        {
          type: 'doc',
          label: 'Check, Read and Expand',
          id: 'content/writing-data/advanced/check-read-expand',
        },
        {
          type: 'doc',
          label: 'Get Tuple Changes',
          id: 'content/integration/read-tuple-changes',
        },
        {
          type: 'doc',
          label: 'Search with Permissions',
          id: 'content/integration/advanced/search-with-permissions',
        },
      ],
    },
  ],
};

module.exports = sidebars;
