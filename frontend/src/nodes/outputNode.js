// outputNode.js — refactored with BaseNode
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Output"
    icon="←"
    color="#f472b6"
    handles={{
      inputs: [{ id: `${id}-value` }],
    }}
    fields={[
      {
        key: 'outputName',
        label: 'Name',
        type: 'text',
        default: id.replace('customOutput-', 'output_'),
        placeholder: 'Output name',
      },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'Image'],
      },
    ]}
  />
);