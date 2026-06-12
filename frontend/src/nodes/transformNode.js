import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => (
  <BaseNode
    id={id} data={data}
    title="Transform" icon="⇄"
    color="#818cf8"
    handles={{
      inputs:  [{ id: `${id}-in` }],
      outputs: [{ id: `${id}-out` }],
    }}
    fields={[
      { key: 'operation', label: 'Operation', type: 'select', default: 'to_uppercase',
        options: ['to_uppercase', 'to_lowercase', 'trim', 'json_parse', 'json_stringify', 'extract_field', 'replace'] },
      { key: 'param', label: 'Parameter', type: 'text', default: '', placeholder: 'e.g. field name or regex' },
    ]}
  />
);