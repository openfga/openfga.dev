export const LANG = Object.freeze({
  JS_SDK: 'js-sdk',
  GO_SDK: 'go-sdk',
  DOTNET_SDK: 'dotnet-sdk',
  PYTHON_SDK: 'python-sdk',
  JAVA_SDK: 'java-sdk',
  CLI: 'cli',
  CURL: 'curl',
  RPC: 'rpc',
  PLAYGROUND: 'playground',
});

export const languages = Object.freeze([
  { id: LANG.JS_SDK, label: 'Node.js', grammar: 'javascript' },
  { id: LANG.GO_SDK, label: 'Go', grammar: 'go' },
  { id: LANG.DOTNET_SDK, label: '.NET', grammar: 'csharp' },
  { id: LANG.PYTHON_SDK, label: 'Python', grammar: 'python' },
  { id: LANG.JAVA_SDK, label: 'Java', grammar: 'java' },
  { id: LANG.CLI, label: 'CLI', grammar: 'shell' },
  { id: LANG.CURL, label: 'curl', grammar: 'shell' },
  { id: LANG.RPC, label: 'Pseudocode', grammar: 'text' },
  { id: LANG.PLAYGROUND, label: 'Playground', grammar: 'text' },
]);

const all = languages.map(({ id }) => id);
const requests = all.filter((id) => id !== LANG.PLAYGROUND);
export const defaultLanguages = Object.freeze({
  CheckRequestViewer: all,
  BatchCheckRequestViewer: requests.filter((id) => id !== LANG.CLI),
  WriteRequestViewer: requests,
  ListObjectsRequestViewer: requests,
  ListUsersRequestViewer: requests,
  CreateStoreViewer: requests.filter((id) => id !== LANG.RPC),
});

export const defaultAuthorizationModelId = '01HVMMBCMGZNT3SED4Z17ECXCA';

export function selectLanguages(component, allowedLanguages) {
  const supported = defaultLanguages[component];
  if (!supported) throw new Error(`Unknown request viewer: ${component}`);
  const selected = allowedLanguages ?? supported;
  if (!Array.isArray(selected) || selected.length === 0) {
    throw new Error(`${component}.allowedLanguages must be a nonempty array`);
  }
  if (new Set(selected).size !== selected.length) {
    throw new Error(`${component}.allowedLanguages must not contain duplicates`);
  }
  for (const id of selected) {
    if (!supported.includes(id)) throw new Error(`${component} does not support language "${id}"`);
  }
  return selected;
}
