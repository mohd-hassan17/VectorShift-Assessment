// mergeNode.js — merges multiple inputs into one output
import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => (
  <BaseNode
    id={id} data={data}
    title="Merge" icon="⊕"
    color="#e879f9"
    handles={{
      inputs:  [{ id: `${id}-a`,  }, { id: `${id}-b`,  }, { id: `${id}-c`,  }],
      outputs: [{ id: `${id}-merged` }],
    }}
    fields={[
      { key: 'strategy', label: 'Merge Strategy', type: 'select', default: 'concat',
        options: ['concat', 'json_merge', 'template', 'first_non_empty'] },
      { key: 'separator', label: 'Separator', type: 'text', default: '\\n', placeholder: 'e.g. \\n or , or space' },
    ]}
  />
);