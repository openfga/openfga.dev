import { buildApiRequest } from './api-operation-codegen.mjs';

// Validate the JSON subset used by our fixtures against the pinned OpenAPI,
// including nested models. This is not a general-purpose OpenAPI validator.
function validateValue(spec, schema, value, location) {
  if (schema.$ref) {
    if (!schema.$ref.startsWith('#/components/schemas/')) throw new Error(`Unexpected schema reference at ${location}`);
    const referenced = spec.components.schemas[schema.$ref.split('/').at(-1)];
    if (!referenced) throw new Error(`Missing schema at ${location}: ${schema.$ref}`);
    validateValue(spec, referenced, value, location);
    return;
  }
  for (const member of schema.allOf ?? []) validateValue(spec, member, value, location);
  if (schema.enum && !schema.enum.includes(value)) throw new Error(`Invalid enum at ${location}`);
  if (schema.type === 'object' || schema.properties) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Expected object at ${location}`);
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) throw new Error(`Missing required field ${location}.${key}`);
    }
    for (const [key, item] of Object.entries(value)) {
      const child = schema.properties?.[key] ?? schema.additionalProperties;
      if (child && typeof child === 'object') validateValue(spec, child, item, `${location}.${key}`);
      else if (schema.properties && !child) throw new Error(`Unknown request field ${location}.${key}`);
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) throw new Error(`Expected array at ${location}`);
    if (value.length < (schema.minItems ?? 0) || value.length > (schema.maxItems ?? Infinity))
      throw new Error(`Invalid array length at ${location}`);
    value.forEach((item, index) => validateValue(spec, schema.items, item, `${location}[${index}]`));
  } else if (schema.type) {
    const valid = schema.type === 'integer' ? Number.isInteger(value) : typeof value === schema.type;
    if (!valid) throw new Error(`Expected ${schema.type} at ${location}`);
    if (typeof value === 'number' && (value < (schema.minimum ?? -Infinity) || value > (schema.maximum ?? Infinity)))
      throw new Error(`Invalid number at ${location}`);
    if (
      typeof value === 'string' &&
      (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? Infinity))
    )
      throw new Error(`Invalid string length at ${location}`);
  }
}

export function validateSampleRequests(spec, metadata) {
  for (const { operationId, props } of metadata.operations) {
    const { method, path, body, query } = buildApiRequest(operationId, props);
    const operation = spec.paths[path][method];
    const bodySchema = operation.requestBody?.content?.['application/json']?.schema;
    if (body !== undefined) {
      if (!bodySchema) throw new Error(`Unexpected request body for ${operationId}`);
      validateValue(spec, bodySchema, body, operationId);
    } else if (operation.requestBody?.required) throw new Error(`Missing request body for ${operationId}`);
    for (const [name, value] of Object.entries(query)) {
      const parameter = operation.parameters?.find((entry) => entry.in === 'query' && entry.name === name);
      if (!parameter) throw new Error(`Unknown query parameter ${operationId}.${name}`);
      validateValue(spec, parameter.schema, value, `${operationId}.${name}`);
    }
  }
}
