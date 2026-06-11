import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

const F = "'Inter', system-ui, sans-serif";
const VAR_RE = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVars = t => {
  const out = [], seen = new Set(); let m;
  const r = new RegExp(VAR_RE.source, 'g');
  while ((m = r.exec(t)) !== null)
    if (!seen.has(m[1])) { seen.add(m[1]); out.push(m[1]); }
  return out;
};

const calcW = t => {
  const max = Math.max(...t.split('\n').map(l => l.length));
  return Math.min(480, Math.max(240, max * 7.8 + 56));
};

export const TextNode = ({ id, data, selected }) => {
  const updateNodeField = useStore(s => s.updateNodeField);
  const [text, setText] = useState(data?.text || '{{input}}');
  const [vars, setVars] = useState(() => extractVars(data?.text || '{{input}}'));
  const [minW, setMinW] = useState(() => calcW(data?.text || '{{input}}'));
  const taRef = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = taRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const onType = e => {
    const v = e.target.value;
    setText(v);
    const nv = extractVars(v);
    setVars(nv); setMinW(calcW(v));
    updateNodeField(id, 'text', v);
    updateNodeField(id, 'variables', nv);
  };

  const CLR = '#f97316';

  const varHandles = vars.map((v, i) => {
    const n = vars.length;
    const top = n === 1 ? '50%' : `${((i + 1) / (n + 1)) * 100}%`;
    return (
      <Handle key={v} type="target" position={Position.Left} id={`${id}-${v}`}
        style={{ top, width: 11, height: 11, background: CLR, border: '2.5px solid #080c14', boxShadow: `0 0 0 2px ${CLR}30` }}
      />
    );
  });

  return (
    <BaseNode id={id} data={data} title="Text" icon="T" color={CLR}
      handles={{ outputs: [{ id: `${id}-output` }] }}
      minWidth={minW} selected={selected}
    >
      {varHandles}

      <div>
        <label style={{
          display: 'block', fontSize: 10, fontWeight: 600, color: '#3d5270',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5,
        }}>Content</label>
        <textarea ref={taRef} value={text} onChange={onType}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          rows={2}
          style={{
            width: '100%', background: '#080c14',
            border: `1.5px solid ${focused ? CLR + '70' : 'rgba(255,255,255,0.09)'}`,
            borderRadius: 7, color: '#dce4f0', fontSize: 12,
            padding: '6px 10px', outline: 'none', fontFamily: F,
            resize: 'none', overflow: 'hidden', lineHeight: 1.6,
            boxSizing: 'border-box',
            boxShadow: focused ? `0 0 0 3px ${CLR}15` : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />
      </div>

      {vars.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
          {vars.map(v => (
            <span key={v} style={{
              fontSize: 10.5, fontWeight: 500,
              background: `${CLR}14`,
              color: CLR,
              border: `1px solid ${CLR}30`,
              borderRadius: 5, padding: '2px 7px',
              letterSpacing: '0.01em',
            }}>{`{{${v}}}`}</span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};