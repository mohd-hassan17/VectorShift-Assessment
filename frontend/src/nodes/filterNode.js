// filterNode.js — conditional filter / router node
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id} data={data}
    title="Filter" icon="⊘"
    color="#f59e0b"
    handles={{
      inputs:  [{ id: `${id}-in` }],
      outputs: [{ id: `${id}-pass`,  }, { id: `${id}-fail`,  }],
    }}
    fields={[
      { key: 'field',    label: 'Field',     type: 'text',   default: '', placeholder: 'e.g. response.score' },
      { key: 'operator', label: 'Condition', type: 'select', default: 'contains', options: ['contains', 'equals', 'greater_than', 'less_than', 'is_empty', 'not_empty'] },
      { key: 'value',    label: 'Value',     type: 'text',   default: '', placeholder: 'Compare value' },
    ]}
  />
);