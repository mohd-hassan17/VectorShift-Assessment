// apiNode.js — HTTP API caller node
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => (
  <BaseNode
    id={id} data={data}
    title="API Request" icon="⚡"
    color="#34d399"
    handles={{
      inputs:  [{ id: `${id}-body` }],
      outputs: [{ id: `${id}-response` }, { id: `${id}-status` }],
    }}
    fields={[
      { key: 'url',    label: 'Endpoint URL', type: 'text',   default: 'https://', placeholder: 'https://api.example.com/endpoint' },
      { key: 'method', label: 'Method',       type: 'select', default: 'GET', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
      { key: 'auth',   label: 'Auth',         type: 'select', default: 'None', options: ['None', 'Bearer Token', 'API Key', 'Basic'] },
    ]}
  />
);