// noteNode.js — sticky note / comment node (no handles)
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => (
  <BaseNode
    id={id} data={data}
    title="Note" icon="✎"
    color="#fbbf24"
    handles={{}}
    minWidth={200}
    fields={[
      { key: 'note', label: 'Content', type: 'textarea', default: 'Add a comment...', placeholder: 'Write your note here...' },
      { key: 'color', label: 'Label Color', type: 'select', default: 'Yellow',
        options: ['Yellow', 'Blue', 'Green', 'Red', 'Purple'] },
    ]}
  />
);