import https from 'node:https';
import fs from 'node:fs/promises';

/**
 * Resolves a reference to an internal schema - external references are not supported
 * @param ref
 * @param jsonData
 * @returns {Promise<*>}
 */
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

/**
 * Parses the type of a schema value to a human-readable format
 * @param value
 * @returns {*|string}
 */
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

/**
 * Parses the value of a schema to a human-readable format
 * @param type
 * @param value
 * @returns {string|string}
 */
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

/**
 * Processes the properties of a schema and returns the MDX content
 * @param properties
 * @param jsonData
 * @param parentKey
 * @returns {Promise<string>}
 */
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

/**
 * Generates the MDX content for the .config-schema.json file
 * @param releaseData {release: string, url: string, releaseUrl: string}
 * @param jsonData
 * @returns {Promise<string>}
 */
async function getMdxContent(releaseData, jsonData) {
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
        let mdxContent = mdxContentHeader + `## List of options

The following table lists the configuration options for the OpenFGA server [${releaseData.release}](${releaseData.releaseUrl}), based on the [config-schema.json](${releaseData.url}).

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

    return mdxContent;
}

/**
 * Performs an HTTP GET request and returns a promise - assumes the URL returns a JSON response
 * @param url
 * @returns {Promise}
 */
function performHttpRequest(url) {
    return new Promise((resolve, reject) => {
        const options = new URL(url);
        options.headers = {
          'User-Agent': 'openfga-docs',
          'Accept': 'application/vnd.github.v3+json'
        };

        https
          .get(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
              data += chunk;
            });

            res.on('end', () => {
                let jsonData;
                try {
                    jsonData = JSON.parse(data);
                    return resolve(jsonData);
                } catch (err) {
                    // Not a JSON response, return the raw data
                    return reject(new Error(`Error parsing JSON response to URL (${url}): ${err.message} - ${data}`));
                }
            })
            res.on('error', (err) => {
              reject(new Error(`Error getting calling URL (${url}): ${err.message}`));
            });
        })
    });
}

/**
 * Fetches the latest release of OpenFGA and returns the URL of the .config-schema.json file
 * @returns {Promise<{ url: string, release: string, releaseUrl: string }>}
 */
async function getFileData() {
    const repo = 'openfga/openfga';
    const url = `https://api.github.com/repos/${repo}/releases/latest`;
    const response = await performHttpRequest(url);
    const latestRelease = response.tag_name;
    return {
      url: `https://raw.githubusercontent.com/${repo}/refs/tags/${latestRelease}/.config-schema.json`,
      release: latestRelease,
      releaseUrl: `https://github.com/${repo}/releases/tag/${latestRelease}`
    };
}

const OUTPUT_FILE = 'docs/content/getting-started/setup-openfga/configuration.mdx';
/**
 * Downloads the .config-schema for the latest release of OpenFGA and generates the MDX content for it
 * @returns {Promise<{release: string, url: string, releaseUrl: string}>}
 */
async function generateMdxForLatestRelease() {
    const releaseData = await getFileData();
    const jsonData = await performHttpRequest(releaseData.url);
    const mdxContent = await getMdxContent(releaseData, jsonData);

    await fs.writeFile(OUTPUT_FILE, mdxContent, 'utf8');

    return releaseData;
}


generateMdxForLatestRelease()
  .then(({ release, url }) => console.log(`Downloaded .config-schema.json file for ${release} from ${url} and saved the generated file at ${OUTPUT_FILE}`))
  .catch(console.error);