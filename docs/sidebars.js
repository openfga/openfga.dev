/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'doc',
      label: 'What is OpenFGA',
      id: 'content/authorization-and-openfga',
    },
    {
      type: 'doc',
      label: 'Concepts',
      id: 'content/concepts',
    },
    {
      type: 'doc',
      label: 'Configuration Language',
      id: 'content/configuration-language',
    },
    {
      type: 'category',
      collapsible: true,
      collapsed: false,
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'content/getting-started/overview',
      },
      items: [
        {
          type: 'category',
          collapsible: true,
          collapsed: true,
          label: 'Setup OpenFGA',
          link: {
            type: 'doc',
            id: 'content/getting-started/setup-openfga/overview'
          },
          items: [
            {
              type: 'doc',
              label: '🐳 Docker',
              id: 'content/getting-started/setup-openfga/docker-setup',
            },
            {
              type: 'doc',
              label: '☸️ Kubernetes',
              id: 'content/getting-started/setup-openfga/kubernetes-setup',
            }
          ]
        },
        {
          type: 'doc',
          label: 'Install SDK Client',
          id: 'content/getting-started/install-sdk',
        },
        {
          type: 'doc',
          label: 'Create a Store',
          id: 'content/getting-started/create-store',
        },
        {
          type: 'doc',
          label: 'Setup SDK Client for Store',
          id: 'content/getting-started/setup-sdk-client',
        },
        {
          type: 'doc',
          label: 'Configure Authorization Model',
          id: 'content/getting-started/configure-model',
        },
        {
          type: 'doc',
          label: 'Update Relationship Tuples',
          id: 'content/getting-started/update-tuples',
        },
        {
          type: 'doc',
          label: 'Perform a Check',
          id: 'content/getting-started/perform-check',
        },
        {
          type: 'doc',
          label: 'Perform a List Objects Request',
          id: 'content/getting-started/perform-list-objects',
        },
        {
          type: 'doc',
          label: 'Integrate Within a Framework',
          id: 'content/getting-started/framework',
        },
        {
          type: 'doc',
          label: 'Immutable Authorization Models',
          id: 'content/getting-started/immutable-models',
        },
        {
          type: 'doc',
          label: 'Production Best Practices',
          id: 'content/getting-started/production-best-practices',
        },
        {
          type: 'doc',
          label: 'Implementation Best Practices',
          id: 'content/getting-started/tuples-api-best-practices',
        }
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
          id: 'content/modeling/direct-access',
        },
        {
          type: 'doc',
          label: 'User Groups',
          id: 'content/modeling/user-groups',
        },
        {
          type: 'doc',
          label: 'Roles and Permissions',
          id: 'content/modeling/roles-and-permissions',
        },
        {
          type: 'doc',
          label: 'Parent-Child Objects',
          id: 'content/modeling/parent-child',
        },
        {
          type: 'doc',
          label: 'Blocklists',
          id: 'content/modeling/blocklists',
        },
        {
          type: 'doc',
          label: 'Public Access',
          id: 'content/modeling/public-access',
        },
        {
          type: 'doc',
          label: 'Multiple Restrictions',
          id: 'content/modeling/multiple-restrictions',
        },
        {
          type: 'doc',
          label: 'Custom Roles',
          id: 'content/modeling/custom-roles',
        },
        {
          type: 'doc',
          label: 'Conditions',
          id: 'content/modeling/conditions',
        },
        {
          type: 'doc',
          label: 'Contextual and Time-Based Authorization',
          id: 'content/modeling/contextual-time-based-authorization',
        },
        {
          type: 'doc',
          label: 'Authorization Through Organization Context',
          id: 'content/modeling/organization-context-authorization',
        },
        {
          type: 'category',
          collapsed: true,
          collapsible: true,
          label: 'Building Blocks',
          link: {
            type: 'doc',
            id: 'content/modeling/building-blocks/overview',
          },
          items: [
            {
              type: 'doc',
              label: 'Direct Relationships',
              id: 'content/modeling/building-blocks/direct-relationships',
            },
            {
              type: 'doc',
              label: 'Concentric Relationships',
              id: 'content/modeling/building-blocks/concentric-relationships',
            },
            {
              type: 'doc',
              label: 'Object to Object Relationships',
              id: 'content/modeling/building-blocks/object-to-object-relationships',
            },
            {
              type: 'doc',
              label: 'Usersets',
              id: 'content/modeling/building-blocks/usersets',
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
              id: 'content/modeling/advanced/gdrive',
            },
            {
              type: 'doc',
              label: 'GitHub',
              id: 'content/modeling/advanced/github',
            },
            {
              type: 'doc',
              label: 'Slack',
              id: 'content/modeling/advanced/slack',
            },
            {
              type: 'doc',
              label: 'IoT',
              id: 'content/modeling/advanced/iot',
            },
            {
              type: 'doc',
              label: 'Entitlements',
              id: 'content/modeling/advanced/entitlements',
            },
          ],
        },
        {
          type: 'category',
          collapsed: true,
          collapsible: true,
          label: 'Migrations',
          link: {
            type: 'doc',
            id: 'content/modeling/migrating/overview',
          }, 
          items: [
            {
              type: 'doc',
              label: 'Migrating Relations',
              id: 'content/modeling/migrating/migrating-relations',
            },
            // for now, do not show the migrating schema page
            {
              type: 'doc',
              label: 'Migrating to Schema 1.1',
              id: 'content/modeling/migrating/migrating-schema-1-1',
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
        id: 'content/interacting/overview',
      },
      items: [
        {
          type: 'doc',
          label: 'Manage User Access',
          id: 'content/interacting/managing-user-access',
        },
        {
          type: 'doc',
          label: 'Manage Group Access',
          id: 'content/interacting/managing-group-access',
        },
        {
          type: 'doc',
          label: 'Manage Group Membership',
          id: 'content/interacting/managing-group-membership',
        },
        {
          type: 'doc',
          label: 'Manage Relationships Between Objects',
          id: 'content/interacting/managing-relationships-between-objects',
        },
        {
          type: 'doc',
          label: 'Transactional Writes',
          id: 'content/interacting/transactional-writes',
        },
        {
          type: 'doc',
          label: "Relationship Queries",
          id: 'content/interacting/relationship-queries',
        },
        {
          type: 'doc',
          label: 'Get Tuple Changes',
          id: 'content/interacting/read-tuple-changes',
        },
        {
          type: 'doc',
          label: 'Search with Permissions',
          id: 'content/interacting/search-with-permissions',
        },
      ],
    },
  ],
};

module.exports = sidebars;
