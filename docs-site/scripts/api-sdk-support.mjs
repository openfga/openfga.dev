import { apiOperations } from './api-operation-contract.mjs';

export const sdkVersions = {
  'js-sdk': {
    version: '0.9.7',
    clientSource: 'https://github.com/openfga/js-sdk/blob/ff0a9f54631700f98349662746e0d6b3cae52993/client.ts',
    apiSource: 'https://github.com/openfga/js-sdk/blob/ff0a9f54631700f98349662746e0d6b3cae52993/api.ts',
  },
  'go-sdk': {
    version: '0.8.2',
    clientSource: 'https://github.com/openfga/go-sdk/blob/76d209a9753a5284db64df848eea41fea2506c6f/client/client.go',
    apiSource: 'https://github.com/openfga/go-sdk/blob/76d209a9753a5284db64df848eea41fea2506c6f/api_open_fga.go',
  },
  'dotnet-sdk': {
    version: '0.10.4',
    clientSource:
      'https://github.com/openfga/dotnet-sdk/blob/ec8ee04761b41e2400693b911a17463877e500c3/src/OpenFga.Sdk/Client/Client.cs',
    apiSource:
      'https://github.com/openfga/dotnet-sdk/blob/ec8ee04761b41e2400693b911a17463877e500c3/src/OpenFga.Sdk/Api/OpenFgaApi.cs',
  },
  'python-sdk': {
    version: '0.10.4',
    clientSource:
      'https://github.com/openfga/python-sdk/blob/60a0a73a8481867dd25dadf7e6516fb4aca82a14/openfga_sdk/client/client.py',
    apiSource:
      'https://github.com/openfga/python-sdk/blob/60a0a73a8481867dd25dadf7e6516fb4aca82a14/openfga_sdk/api/open_fga_api.py',
  },
  'java-sdk': {
    version: '0.10.0',
    clientSource:
      'https://github.com/openfga/java-sdk/blob/0c5c5c77c1a25e6d0b0ce684833981a6a74db510/src/main/java/dev/openfga/sdk/api/client/OpenFgaClient.java',
    apiSource:
      'https://github.com/openfga/java-sdk/blob/0c5c5c77c1a25e6d0b0ce684833981a6a74db510/src/main/java/dev/openfga/sdk/api/OpenFgaApi.java',
  },
};

const methodLanguages = ['js-sdk', 'go-sdk', 'python-sdk', 'dotnet-sdk', 'java-sdk'];
const methods = {
  Check: ['check', 'Check', 'check', 'Check', 'check'],
  BatchCheck: ['batchCheck', 'BatchCheck', 'batch_check', 'BatchCheck', 'batchCheck'],
  Write: ['write', 'Write', 'write', 'Write', 'write'],
  ListObjects: ['listObjects', 'ListObjects', 'list_objects', 'ListObjects', 'listObjects'],
  ListUsers: ['listUsers', 'ListUsers', 'list_users', 'ListUsers', 'listUsers'],
  CreateStore: ['createStore', 'CreateStore', 'create_store', 'CreateStore', 'createStore'],
  ListStores: ['listStores', 'ListStores', 'list_stores', 'ListStores', 'listStores'],
  GetStore: ['getStore', 'GetStore', 'get_store', 'GetStore', 'getStore'],
  DeleteStore: ['deleteStore', 'DeleteStore', 'delete_store', 'DeleteStore', 'deleteStore'],
  ReadAuthorizationModels: [
    'readAuthorizationModels',
    'ReadAuthorizationModels',
    'read_authorization_models',
    'ReadAuthorizationModels',
    'readAuthorizationModels',
  ],
  ReadAuthorizationModel: [
    'readAuthorizationModel',
    'ReadAuthorizationModel',
    'read_authorization_model',
    'ReadAuthorizationModel',
    'readAuthorizationModel',
  ],
  WriteAuthorizationModel: [
    'writeAuthorizationModel',
    'WriteAuthorizationModel',
    'write_authorization_model',
    'WriteAuthorizationModel',
    'writeAuthorizationModel',
  ],
  Read: ['read', 'Read', 'read', 'Read', 'read'],
  ReadChanges: ['readChanges', 'ReadChanges', 'read_changes', 'ReadChanges', 'readChanges'],
  Expand: ['expand', 'Expand', 'expand', 'Expand', 'expand'],
  ReadAssertions: ['readAssertions', 'ReadAssertions', 'read_assertions', 'ReadAssertions', 'readAssertions'],
  WriteAssertions: ['writeAssertions', 'WriteAssertions', 'write_assertions', 'WriteAssertions', 'writeAssertions'],
  StreamedListObjects: [
    'streamedListObjects',
    'StreamedListObjects',
    'streamed_list_objects',
    'StreamedListObjects',
    'streamedListObjects',
  ],
};

const authzenOperations = [
  'GetConfiguration',
  'Evaluation',
  'Evaluations',
  'ActionSearch',
  'ResourceSearch',
  'SubjectSearch',
];
const authzenReason =
  'No named client or generated low-level AuthZen operation in this audited SDK version; generic HTTP request builders are not operation support.';

export const apiSdkSupport = Object.fromEntries([
  ...Object.entries(methods).map(([operation, row]) => [
    operation,
    Object.fromEntries(methodLanguages.map((language, index) => [language, { method: row[index], level: 'client' }])),
  ]),
  ...authzenOperations.map((operation) => [
    operation,
    Object.fromEntries(methodLanguages.map((language) => [language, { method: null, reason: authzenReason }])),
  ]),
]);

export function validateSdkCoverage(coverage = apiSdkSupport, versions = sdkVersions) {
  const expectedLanguages = ['js-sdk', 'go-sdk', 'dotnet-sdk', 'python-sdk', 'java-sdk'];
  const sameKeys = (value, expected) => value && Object.keys(value).sort().join() === [...expected].sort().join();
  if (!sameKeys(versions, expectedLanguages)) throw new Error('SDK version inventory must include all five languages');
  for (const sdk of Object.values(versions)) {
    if (!/^\d+\.\d+\.\d+$/.test(sdk.version)) throw new Error('SDK version must be exact');
    for (const key of ['clientSource', 'apiSource']) {
      if (!/^https:\/\/github\.com\/openfga\/[^/]+\/blob\/[a-f0-9]{40}\/.+/.test(sdk[key]))
        throw new Error('SDK evidence must use immutable public OpenFGA source');
    }
  }
  if (!sameKeys(coverage, Object.keys(apiOperations)))
    throw new Error('SDK coverage must account for all 24 operations');
  for (const [operation, languages] of Object.entries(coverage)) {
    if (!sameKeys(languages, expectedLanguages))
      throw new Error(`Incomplete five-language support inventory: ${operation}`);
    for (const [language, entry] of Object.entries(languages)) {
      if (entry.method === null) {
        if (!sameKeys(entry, ['method', 'reason']) || typeof entry.reason !== 'string' || !entry.reason.trim())
          throw new Error(`Unsupported ${operation} must explain why`);
      } else if (
        !sameKeys(entry, ['method', 'level']) ||
        typeof entry.method !== 'string' ||
        !/^[A-Za-z]\w*$/.test(entry.method) ||
        !['client', 'api'].includes(entry.level)
      ) {
        throw new Error(`Invalid named SDK method for ${operation}`);
      }
      const reviewed = apiSdkSupport[operation][language];
      if (entry.method !== reviewed?.method || entry.level !== reviewed?.level)
        throw new Error(`SDK method differs from reviewed source: ${operation}/${language}`);
    }
  }
}
