import {
  Brain,
  FileInput,
  FileOutput,
  Filter,
  GitMerge,
  Globe,
  Replace,
  StickyNote,
  Type,
} from 'lucide-react';

const field = (config) => config;

export const NODE_DEFINITIONS = [
  {
    type: 'customInput',
    group: 'Core',
    label: 'Input',
    title: 'Input',
    icon: FileInput,
    accent: '#38bdf8',
    handles: (id) => ({
      outputs: [{ id: `${id}-value` }],
    }),
    fields: [
      field({
        key: 'inputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customInput-', 'input_'),
        placeholder: 'Variable name',
      }),
      field({
        key: 'inputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'File'],
      }),
    ],
  },
  {
    type: 'customOutput',
    group: 'Core',
    label: 'Output',
    title: 'Output',
    icon: FileOutput,
    accent: '#f0abfc',
    handles: (id) => ({
      inputs: [{ id: `${id}-value` }],
    }),
    fields: [
      field({
        key: 'outputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customOutput-', 'output_'),
        placeholder: 'Output name',
      }),
      field({
        key: 'outputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'Image'],
      }),
    ],
  },
  {
    type: 'llm',
    group: 'AI',
    label: 'LLM',
    title: 'LLM',
    icon: Brain,
    accent: '#a5b4fc',
    handles: (id) => ({
      inputs: [
        { id: `${id}-system`, label: 'System' },
        { id: `${id}-prompt`, label: 'Prompt' },
      ],
      outputs: [{ id: `${id}-response` }],
    }),
    fields: [
      field({
        key: 'model',
        label: 'Model',
        type: 'select',
        default: 'gpt-4o',
        options: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'gemini-1.5-pro'],
      }),
    ],
  },
  {
    type: 'text',
    group: 'Core',
    label: 'Text',
    title: 'Text',
    icon: Type,
    accent: '#fb923c',
    handles: (id) => ({
      outputs: [{ id: `${id}-output` }],
    }),
  },
  {
    type: 'api',
    group: 'Tools',
    label: 'API',
    title: 'API Request',
    icon: Globe,
    accent: '#34d399',
    handles: (id) => ({
      inputs: [{ id: `${id}-body` }],
      outputs: [{ id: `${id}-response` }, { id: `${id}-status` }],
    }),
    fields: [
      field({
        key: 'url',
        label: 'Endpoint URL',
        type: 'text',
        default: 'https://',
        placeholder: 'https://api.example.com/endpoint',
      }),
      field({
        key: 'method',
        label: 'Method',
        type: 'select',
        default: 'GET',
        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      }),
      field({
        key: 'auth',
        label: 'Auth',
        type: 'select',
        default: 'None',
        options: ['None', 'Bearer Token', 'API Key', 'Basic'],
      }),
    ],
  },
  {
    type: 'filter',
    group: 'Logic',
    label: 'Filter',
    title: 'Filter',
    icon: Filter,
    accent: '#fbbf24',
    handles: (id) => ({
      inputs: [{ id: `${id}-in` }],
      outputs: [{ id: `${id}-pass`, label: 'Pass' }, { id: `${id}-fail`, label: 'Fail' }],
    }),
    fields: [
      field({ key: 'field', label: 'Field', type: 'text', default: '', placeholder: 'response.score' }),
      field({
        key: 'operator',
        label: 'Condition',
        type: 'select',
        default: 'contains',
        options: ['contains', 'equals', 'greater_than', 'less_than', 'is_empty', 'not_empty'],
      }),
      field({ key: 'value', label: 'Value', type: 'text', default: '', placeholder: 'Compare value' }),
    ],
  },
  {
    type: 'transform',
    group: 'Tools',
    label: 'Transform',
    title: 'Transform',
    icon: Replace,
    accent: '#93c5fd',
    handles: (id) => ({
      inputs: [{ id: `${id}-in` }],
      outputs: [{ id: `${id}-out` }],
    }),
    fields: [
      field({
        key: 'operation',
        label: 'Operation',
        type: 'select',
        default: 'to_uppercase',
        options: ['to_uppercase', 'to_lowercase', 'trim', 'json_parse', 'json_stringify', 'extract_field', 'replace'],
      }),
      field({ key: 'param', label: 'Parameter', type: 'text', default: '', placeholder: 'Field name or regex' }),
    ],
  },
  {
    type: 'merge',
    group: 'Logic',
    label: 'Merge',
    title: 'Merge',
    icon: GitMerge,
    accent: '#c4b5fd',
    handles: (id) => ({
      inputs: [{ id: `${id}-a`, label: 'A' }, { id: `${id}-b`, label: 'B' }, { id: `${id}-c`, label: 'C' }],
      outputs: [{ id: `${id}-merged` }],
    }),
    fields: [
      field({
        key: 'strategy',
        label: 'Merge Strategy',
        type: 'select',
        default: 'concat',
        options: ['concat', 'json_merge', 'template', 'first_non_empty'],
      }),
      field({ key: 'separator', label: 'Separator', type: 'text', default: '\\n', placeholder: '\\n, comma, or space' }),
    ],
  },
  {
    type: 'note',
    group: 'Tools',
    label: 'Note',
    title: 'Note',
    icon: StickyNote,
    accent: '#fde68a',
    handles: () => ({}),
    minWidth: 220,
    fields: [
      field({
        key: 'note',
        label: 'Content',
        type: 'textarea',
        default: 'Add a comment...',
        placeholder: 'Write your note here...',
      }),
      field({
        key: 'color',
        label: 'Label Color',
        type: 'select',
        default: 'Yellow',
        options: ['Yellow', 'Blue', 'Green', 'Red', 'Purple'],
      }),
    ],
  },
];

export const NODE_CONFIG_BY_TYPE = Object.fromEntries(
  NODE_DEFINITIONS.map((definition) => [definition.type, definition]),
);

export const NODE_GROUPS = ['Core', 'AI', 'Logic', 'Tools'].map((group) => ({
  group,
  nodes: NODE_DEFINITIONS.filter((definition) => definition.group === group),
})).filter(({ nodes }) => nodes.length > 0);

export const getNodeConfig = (type) => NODE_CONFIG_BY_TYPE[type];

export const resolveNodeHandles = (type, id) => {
  const config = getNodeConfig(type);
  return config?.handles?.(id) || {};
};

export const resolveFieldDefault = (fieldConfig, id) => (
  typeof fieldConfig.default === 'function'
    ? fieldConfig.default(id)
    : fieldConfig.default ?? ''
);

export const getInitialNodeData = (type, id) => {
  const config = getNodeConfig(type);
  const data = { id, nodeType: type };

  (config?.fields || []).forEach((fieldConfig) => {
    data[fieldConfig.key] = resolveFieldDefault(fieldConfig, id);
  });

  if (type === 'text') {
    data.text = '{{input}}';
    data.variables = ['input'];
  }

  return data;
};
