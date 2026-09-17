import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import test from 'node:test';
import { metadataUrl, overlayUrl, languagesForOperation } from './api-code-samples.mjs';
import { buildApiExample } from './viewer-runtime.mjs';
import { apiOperation, paginatedOperations } from './api-operation-contract.mjs';
import { sdkVersions, apiSdkSupport, validateSdkCoverage } from './api-sdk-support.mjs';
import { readRegressionFixture } from './regression-fixtures.mjs';

const metadata = JSON.parse(await readFile(metadataUrl, 'utf8'));
const overlay = JSON.parse(await readFile(overlayUrl, 'utf8'));
const storeId = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
const modelId = '01ARZ3NDEKTSV4RRFFQ69G5FAW';
const tuple = { user: 'user:anne', relation: 'reader', object: 'document:budget' };
const bodies = {
  Check: { tuple_key: tuple, authorization_model_id: modelId },
  BatchCheck: {
    checks: [{ tuple_key: tuple, correlation_id: 'budget-reader' }],
    authorization_model_id: modelId,
  },
  Write: { writes: { tuple_keys: [tuple] }, authorization_model_id: modelId },
  ListObjects: { user: tuple.user, relation: tuple.relation, type: 'document', authorization_model_id: modelId },
  ListUsers: {
    object: { type: 'document', id: 'budget' },
    relation: tuple.relation,
    user_filters: [{ type: 'user' }],
    authorization_model_id: modelId,
  },
  CreateStore: { name: 'FGA Demo Store' },
  WriteAuthorizationModel: metadata.operations.find(({ operationId }) => operationId === 'WriteAuthorizationModel')
    .props.model,
  Read: { tuple_key: tuple, page_size: 20 },
  Expand: { tuple_key: { relation: tuple.relation, object: tuple.object }, authorization_model_id: modelId },
  WriteAssertions: { assertions: [{ tuple_key: tuple, expectation: true }] },
  StreamedListObjects: {
    user: tuple.user,
    relation: tuple.relation,
    type: 'document',
    authorization_model_id: modelId,
  },
  Evaluation: {
    subject: { type: 'user', id: 'anne' },
    action: { name: 'reader' },
    resource: { type: 'document', id: 'budget' },
  },
  Evaluations: {
    evaluations: [
      {
        subject: { type: 'user', id: 'anne' },
        action: { name: 'reader' },
        resource: { type: 'document', id: 'budget' },
      },
    ],
  },
  ActionSearch: { subject: { type: 'user', id: 'anne' }, resource: { type: 'document', id: 'budget' } },
  ResourceSearch: { subject: { type: 'user', id: 'anne' }, action: { name: 'reader' }, resource: { type: 'document' } },
  SubjectSearch: {
    subject: { type: 'user' },
    action: { name: 'reader' },
    resource: { type: 'document', id: 'budget' },
  },
};
const queries = {
  ListStores: { page_size: '20' },
  ReadAuthorizationModels: { page_size: '20' },
  ReadChanges: { page_size: '20', type: 'document' },
};
const responses = {
  Check: { allowed: true },
  BatchCheck: { result: { 'budget-reader': { allowed: true } } },
  Write: {},
  ListObjects: { objects: [] },
  ListUsers: { users: [] },
  CreateStore: {
    id: storeId,
    name: 'FGA Demo Store',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
};

test('installed Node SDK matches the exact audited version', () => {
  const require = createRequire(import.meta.url);
  assert.equal(require('@openfga/sdk/package.json').version, sdkVersions['js-sdk'].version);
});

test('historical and native installation instructions name the audited SDK versions', async () => {
  const source = await readFile(new URL('../docs/getting-started/install-sdk.mdx', import.meta.url), 'utf8');
  const historicalInstalls = readRegressionFixture('static-requests').sdkInstalls;
  for (const [language, { version }] of Object.entries(sdkVersions)) {
    const install = {
      'js-sdk': `@openfga/sdk@${version}`,
      'go-sdk': `github.com/openfga/go-sdk@v${version}`,
      'dotnet-sdk': `OpenFGA.Sdk --version ${version}`,
      'python-sdk': `openfga_sdk==${version}`,
      'java-sdk': `<version>${version}</version>`,
    }[language];
    assert.equal(historicalInstalls[language], install, `Historical installation pins must match the audited ${language}`);
    assert.ok(source.includes(install), `Native instructions must install the audited ${language} ${version}`);
  }
});

test('documented 24-operation matrix agrees with every audited SDK method and HTTP-only case', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const order = ['js-sdk', 'go-sdk', 'dotnet-sdk', 'python-sdk', 'java-sdk'];
  for (const { operationId } of metadata.operations) {
    const row = readme.split('\n').find((line) => line.startsWith(`| ${operationId} |`));
    assert.ok(row, `Missing documentation coverage row: ${operationId}`);
    assert.deepEqual(
      row
        .split('|')
        .slice(2, 8)
        .map((cell) => cell.trim()),
      [
        ...order.map((language) =>
          apiSdkSupport[operationId][language].method ? `\`${apiSdkSupport[operationId][language].method}\`` : 'No',
        ),
        'Yes',
      ],
    );
  }
});

test('support inventory rejects missing operations/languages, unknown methods and unexplained omissions', () => {
  validateSdkCoverage();
  for (const mutate of [
    (coverage) => {
      delete coverage.ListStores;
    },
    (coverage) => {
      delete coverage.ListStores['python-sdk'];
    },
    (coverage) => {
      coverage.ListStores['python-sdk'] = { method: null };
    },
    (coverage) => {
      coverage.ListStores['python-sdk'] = { method: '', level: 'client' };
    },
    (coverage) => {
      coverage.Evaluation['js-sdk'] = { method: null, reason: '' };
    },
    (coverage) => {
      coverage.Evaluation['js-sdk'] = { method: 'executeApiRequest', level: 'client' };
    },
    (coverage) => {
      coverage.ListStores['python-sdk'] = { method: 'invented_method', level: 'client' };
    },
  ]) {
    const coverage = structuredClone(apiSdkSupport);
    mutate(coverage);
    assert.throws(() => validateSdkCoverage(coverage));
  }
  for (const id of [
    'GetConfiguration',
    'Evaluation',
    'Evaluations',
    'ActionSearch',
    'ResourceSearch',
    'SubjectSearch',
  ]) {
    const { props } = metadata.operations.find(({ operationId }) => operationId === id);
    for (const language of Object.keys(sdkVersions))
      assert.throws(() => buildApiExample(language, id, props), /No named SDK operation/);
  }
});

test('all committed programs equal the shared generator with exact audited per-operation coverage and setup scope', () => {
  assert.equal(overlay.actions.length, 24);
  for (const [index, entry] of metadata.operations.entries()) {
    const samples = overlay.actions[index].update['x-codeSamples'];
    const expectedLanguages = languagesForOperation(entry.operationId);
    assert.equal(samples.length, expectedLanguages.length);
    for (const [languageIndex, language] of expectedLanguages.entries()) {
      assert.deepEqual(samples[languageIndex], {
        lang: language.lang,
        label: language.label,
        source: buildApiExample(language.id, entry.operationId, entry.props),
      });
      assert.match(samples[languageIndex].source, /FGA_API_URL/);
      assert.doesNotMatch(samples[languageIndex].source, /Fixture generator|01HVMMBCMGZNT3SED4Z17ECXCA/);
      if (language.id !== 'curl')
        assert.match(
          samples[languageIndex].source,
          new RegExp(`\\.${apiSdkSupport[entry.operationId][language.id].method}\\(`),
        );
      const { scope } = apiOperation(entry.operationId);
      if (scope !== 'api') {
        assert.match(samples[languageIndex].source, /FGA_STORE_ID/);
      } else {
        assert.doesNotMatch(samples[languageIndex].source, /FGA_STORE_ID/);
      }
      if (scope === 'model') {
        assert.match(samples[languageIndex].source, /FGA_MODEL_ID/);
      } else {
        assert.doesNotMatch(samples[languageIndex].source, /FGA_MODEL_ID/);
      }
    }
  }
});

function execute(command, args, source, apiUrl) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: new URL('../../', import.meta.url),
      env: { PATH: process.env.PATH, FGA_API_URL: apiUrl, FGA_STORE_ID: storeId, FGA_MODEL_ID: modelId },
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15_000,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => {
      stdout += data;
    });
    child.stderr.on('data', (data) => {
      stderr += data;
    });
    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} failed (${code ?? signal}): ${stderr}\n${stdout}`));
    });
    child.stdin.end(source);
  });
}

for (const language of ['node', 'bash']) {
  for (const [index, entry] of metadata.operations.entries()) {
    if (!languagesForOperation(entry.operationId).some(({ lang }) => lang === language)) continue;
    for (const pagination of paginatedOperations.includes(entry.operationId) ? [false, true] : [false]) {
      test(`executes ${entry.operationId} ${language === 'node' ? 'OpenFGA Node.js SDK' : 'curl'}${pagination ? ' with pagination/filter values' : ''} against loopback only`, async (t) => {
        const requests = [];
        const server = createServer(async (request, response) => {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          requests.push({
            method: request.method,
            url: request.url,
            body: Buffer.concat(chunks).toString(),
            headers: request.headers,
          });
          response.writeHead(entry.operationId === 'CreateStore' ? 201 : 200, { 'content-type': 'application/json' });
          response.end(
            entry.operationId === 'StreamedListObjects'
              ? '{"result":{"object":"document:budget"}}\n'
              : JSON.stringify(responses[entry.operationId] ?? {}),
          );
        });
        server.listen(0, '127.0.0.1');
        await once(server, 'listening');
        t.after(
          () =>
            new Promise((resolve) => {
              server.closeAllConnections();
              server.close(resolve);
            }),
        );
        const props = {
          ...entry.props,
          ...(pagination
            ? {
                pageSize: 7,
                continuationToken: 'a+/= &?%',
                ...(entry.operationId === 'ListStores' ? { name: 'Demo & more' } : {}),
                ...(entry.operationId === 'ReadChanges' ? { startTime: '2026-01-01T12:34:56Z' } : {}),
              }
            : {}),
        };
        const source = pagination
          ? buildApiExample(language === 'node' ? 'js-sdk' : 'curl', entry.operationId, props)
          : overlay.actions[index].update['x-codeSamples'].find(({ lang }) => lang === language).source;
        const apiUrl = `http://127.0.0.1:${server.address().port}`;
        const result = await execute(
          language === 'node' ? process.execPath : 'bash',
          language === 'node' ? ['--input-type=commonjs'] : [],
          source,
          apiUrl,
        );
        assert.equal(requests.length, 1, 'one real SDK/HTTP request must reach the loopback fixture');
        assert.equal(requests[0].method, entry.method.toUpperCase());
        const url = new URL(requests[0].url, apiUrl);
        assert.equal(
          url.pathname,
          entry.path
            .replace('{store_id}', storeId)
            .replace('{id}', modelId)
            .replace('{authorization_model_id}', modelId),
        );
        const expectedQuery = { ...queries[entry.operationId] };
        if (pagination && entry.operationId !== 'Read') {
          Object.assign(expectedQuery, { page_size: '7', continuation_token: props.continuationToken });
          if (props.name) expectedQuery.name = props.name;
          if (props.startTime) expectedQuery.start_time = props.startTime;
        }
        assert.deepEqual(Object.fromEntries(url.searchParams), expectedQuery);
        assert.equal(requests[0].headers.authorization, undefined, 'samples use no-auth setup');
        const expectedBody = structuredClone(bodies[entry.operationId]);
        if (pagination && entry.operationId === 'Read')
          Object.assign(expectedBody, { page_size: 7, continuation_token: props.continuationToken });
        // SDK defaults are explicit on the wire; curl leaves these optional fields absent.
        if (language === 'node') {
          if (['Check', 'ListObjects', 'Expand', 'StreamedListObjects'].includes(entry.operationId))
            expectedBody.contextual_tuples = { tuple_keys: [] };
          if (entry.operationId === 'ListUsers') expectedBody.contextual_tuples = [];
          if (entry.operationId === 'Write') expectedBody.writes.on_duplicate = 'error';
        }
        assert.deepEqual(requests[0].body ? JSON.parse(requests[0].body) : undefined, expectedBody);
        if (entry.operationId === 'StreamedListObjects' && language === 'node')
          assert.match(result.stdout, /document:budget/);
      });
    }
  }
}
