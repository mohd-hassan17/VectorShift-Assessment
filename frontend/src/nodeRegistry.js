import { APINode } from './nodes/apiNode';
import { FilterNode } from './nodes/filterNode';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { MergeNode } from './nodes/mergeNode';
import { NoteNode } from './nodes/noteNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { TransformNode } from './nodes/transformNode';
import { NODE_DEFINITIONS, NODE_GROUPS, getInitialNodeData } from './nodes/nodeConfig';

const componentByType = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  api: APINode,
  filter: FilterNode,
  transform: TransformNode,
  merge: MergeNode,
  note: NoteNode,
};

export const nodeTypes = Object.fromEntries(
  NODE_DEFINITIONS.map((definition) => [definition.type, componentByType[definition.type]]),
);

export { NODE_DEFINITIONS, NODE_GROUPS, getInitialNodeData };
