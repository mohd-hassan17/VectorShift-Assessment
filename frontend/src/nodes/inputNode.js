import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Input"
    icon="→"
    color="#22d3ee"
    handles={{
      outputs: [{ id: `${id}-value` }],
    }}
    fields={[
      {
        key: 'inputName',
        label: 'Name',
        type: 'text',
        default: id.replace('customInput-', 'input_'),
        placeholder: 'Variable name',
      },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'File'],
      },
    ]}
  />
);