import https from 'https';
import fs from 'fs';

async function resolveRef(ref, jsonData) {
    if (ref.startsWith('#')) {
        const refPath = ref.slice(2).split('/');
        let refSchema = jsonData;
        for (const part of refPath) {
            refSchema = refSchema[part];
        }
        return refSchema;
    } else {
        throw new Error('External references are not supported');
    }
}

function parseType(value) {
    if (!value?.type) {
        return '';
    }
    if (value.type === 'array' && value.items && value.items.type) {
        return `[]${parseType(value.items)}`;
    } else if (value.type === 'string' && value.format) {
       return `${value.type} (${value.format})`;
    } else if (value.type === 'string' && value.enum) {
       return `${value.type} (enum=[\`${value.enum.join('`, `')}\`])`;
    } else {
        return value.type;
    }
}

function parseValue(type, value) {
    if (!value && type !== 'boolean') {
        return '';
    }

    switch (type) {
        case 'boolean':
            return value === "false" ? '`false`' : value ? '`true`' : '`false`';
        case 'string':
        case 'number':
        case 'integer':
        default:
            return `\`${value}\``;
    }
}

async function processProperties(properties, jsonData, parentKey = '') {
    let mdxContent = '';

    for (const [key, value] of Object.entries(properties)) {
        if (value.$ref) {
            const refSchema = await resolveRef(value.$ref, jsonData);
            mdxContent += await processProperties(refSchema.properties, jsonData, parentKey ? `${parentKey}.${key}` : key);
        } else {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            const configFile = `\`${fullKey}\``;
            const envVar = `${value['x-env-variable'] || ''}`;
            const type = parseType(value);
            const description = value['description'] || '';
            const defaultValue = parseValue(type, value['default'] || '');
            const flagName = `\`${envVar.replace(/^OPENFGA_/g, '').toLowerCase().replace(/_/g, '-')}\``;
            const envVarWrapper = envVar ? `<div id="${envVar}"><code>${envVar}</code></div>` : '';

            if (type === 'object' && value.properties) {
                mdxContent += await processProperties(value.properties, jsonData, fullKey);
            } else {
                mdxContent += `| ${configFile} | ${envVarWrapper} | ${flagName} | ${type} | ${description} | ${defaultValue} |\n`;
            }
        }
    }

    return mdxContent;
}

const mdxContentHeader = `---
title: OpenFGA Configuration Options
description: Configuring Options for the OpenFGA Server
sidebar_position: 1
slug: /getting-started/setup-openfga/configuration
---
import {
  RelatedSection,
} from "@components/Docs";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# OpenFGA Configuration Options

## Passing in the options

You can configure the OpenFGA server in three ways:

- Using a configuration file.
- Using environment variables.
- Using command line parameters.

If the same option is configured in multiple ways the command line parameters will take precedence over environment variables, which will take precedence over the configuration file.

The configuration options and their default values are listed in the table below based on the [config-schema.json](https://github.com/openfga/openfga/blob/main/.config-schema.json).

<Tabs groupId={"configuration"}>
<TabItem value={"configuration file"} label={"Configuration File"}>

You can configure the OpenFGA server with a \`config.yaml\` file, which can be specified in either:
- \`/etc/openfga\`
- \`$HOME/.openfga\`
- \`.\` (i.e., the current working directory).

The OpenFGA server will search for the configuration file in the above order.

Here is a sample configuration to run OpenFGA with a Postgres database and using a preshared key for authentication:

\`\`\`yaml
datastore:
  engine: postgres
  uri: postgres://user:password@localhost:5432/mydatabase
authn:
  method: preshared
  preshared:
    keys: ["key1", "key2"]
playground:
  enabled: false
\`\`\`

</TabItem>

<TabItem value={"environment variables"} label={"Environment Variables"}>

The OpenFGA server supports **environment variables** for configuration, and they will take priority over your configuration file.
Each variable must be prefixed with \`OPENFGA_\` and followed by your option in uppercase (\`datastore.engine\` becomes \`OPENFGA_DATASTORE_ENGINE\`), e.g.

\`\`\`shell
# Running as a binary
export OPENFGA_DATASTORE_ENGINE=postgres
export OPENFGA_DATASTORE_URI='postgres://postgres:password@postgres:5432/postgres?sslmode=disable'
export OPENFGA_AUTHN_METHOD=preshared
export OPENFGA_AUTHN_PRESHARED_KEYS='key1,key2'
export OPENFGA_PLAYGROUND_ENABLED=false
openfga run

# Running in docker
docker run docker.io/openfga/openfga:latest \\\ 
  -e OPENFGA_DATASTORE_ENGINE=postgres \\\ 
  -e OPENFGA_DATASTORE_URI='postgres://postgres:password@postgres:5432/postgres?sslmode=disable' \\\ 
  -e OPENFGA_AUTHN_METHOD=preshared \\\ 
  -e OPENFGA_AUTHN_PRESHARED_KEYS='key1,key2' \\\ 
  -e OPENFGA_PLAYGROUND_ENABLED=false \\\ 
  run
\`\`\`

</TabItem>

<TabItem value={"command line parameters"} label={"Command Line Parameters (Flags)"}>

Command line parameters take precedence over environment variables and options in the configuration file. They are prefixed with \`--\` (\`OPENFGA_DATASTORE_ENGINE\` becomes \`--datastore-engine\`), e.g.

\`\`\`shell
# Running as a binary
openfga run \\\ 
  --datastore-engine postgres \\\ 
  --datastore-uri 'postgres://postgres:password@postgres:5432/postgres?sslmode=disable' \\\ 
  --authn-method=preshared \\\ 
  --authn-preshared-keys='key1,key2' \\\ 
  --playground-enabled=false

# Running in docker
docker run docker.io/openfga/openfga:latest run \\\ 
  --datastore-engine postgres \\\ 
  --datastore-uri 'postgres://postgres:password@postgres:5432/postgres?sslmode=disable' \\\ 
  --authn-method=preshared \\\ 
  --authn-preshared-keys='key1,key2' \\\ 
  --playground-enabled=false
\`\`\`

</TabItem>
</Tabs>

`;

function jsonToMdx(url, mdxFile) {
    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', async () => {
            const jsonData = JSON.parse(data);
            let mdxContent = mdxContentHeader + `## List of options

The following table lists the configuration options for the OpenFGA server, based on the [config-schema.json](https://github.com/openfga/openfga/blob/main/.config-schema.json).

| Config File | Env Var | Flag Name | Type | Description | Default Value |
|-------------|---------|-----------|------|-------------|---------------|\n`;

            if (jsonData.properties) {
                mdxContent += await processProperties(jsonData.properties, jsonData);
            }

            mdxContent += `\n## Related Sections

<RelatedSection
  description="Check the following sections for more on how to configure OpenFGA."
  relatedLinks={[
    {
      title: 'Configuring OpenFGA',
      description: 'Learn more about the different ways to configure OpenFGA',
      link: './configure-openfga',
      id: './configure-openfga',
    },
    {
      title: 'Production Best Practices',
      description: 'Learn the best practices of running OpenFGA in a production environment',
      link: '../running-in-production',
      id: './running-in-production',
    }
  ]}
/>`

            fs.writeFile(mdxFile, mdxContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file: ${err}`);
                    return;
                }
                console.log(`MDX file has been saved as ${mdxFile}`);
            });
        });
    }).on('error', (err) => {
        console.error(`Error fetching URL: ${err}`);
    });
}

jsonToMdx('https://raw.githubusercontent.com/openfga/openfga/refs/heads/main/.config-schema.json', 'docs/content/getting-started/setup-openfga/configuration.mdx');