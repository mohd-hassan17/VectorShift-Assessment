import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { InputNode }     from './nodes/inputNode';
import { LLMNode }       from './nodes/llmNode';
import { OutputNode }    from './nodes/outputNode';
import { TextNode }      from './nodes/textNode';
import { APINode }       from './nodes/apiNode';
import { FilterNode }    from './nodes/filterNode';
import { TransformNode } from './nodes/transformNode';
import { MergeNode }     from './nodes/mergeNode';
import { NoteNode }      from './nodes/noteNode';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode, llm: LLMNode, customOutput: OutputNode,
  text: TextNode, api: APINode, filter: FilterNode,
  transform: TransformNode, merge: MergeNode, note: NoteNode,
};

const selector = s => ({
  nodes: s.nodes, edges: s.edges,
  getNodeID: s.getNodeID, addNode: s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export const PipelineUI = () => {
  const wrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(e => {
    e.preventDefault();
    const bounds = wrapper.current.getBoundingClientRect();
    const raw = e.dataTransfer.getData('application/reactflow');
    if (!raw || !rfInstance) return;
    const { nodeType: type } = JSON.parse(raw);
    if (!type) return;
    const position = rfInstance.project({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    const nodeID = getNodeID(type);
    addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
  }, [rfInstance, addNode, getNodeID]);

  const onDragOver = useCallback(e => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect} onDrop={onDrop} onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes} proOptions={proOptions}
        snapGrid={[16, 16]} connectionLineType="smoothstep"
        defaultEdgeOptions={{
          type: 'smoothstep', animated: false,
          style: { stroke: '#1e3a5f', strokeWidth: 1.75 },
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 1.4 }}
        minZoom={0.2} maxZoom={2}
      >
        {/* Clearly visible dot grid with better contrast */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24} size={1.5}
          color="#1e2d42"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, #0f1e33 0%, #0d1117 70%)' }}
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={() => '#1e3a5f'}
          maskColor="rgba(9,13,19,0.82)"
          style={{ background: '#111827' }}
          zoomable pannable
        />
      </ReactFlow>
    </div>
  );
};