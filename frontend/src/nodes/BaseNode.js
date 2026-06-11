import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { useStore } from '../store';

const F = "'Inter', system-ui, sans-serif";

/* ── Field renderer ──────────────────────────────────────── */
const Field = ({ field, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const ac = field.accentColor || '#6366f1';

  const base = {
    width: '100%',
    background: '#080c14',
    border: `1.5px solid ${focused ? ac + '70' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: 7,
    color: '#dce4f0',
    fontSize: 12,
    padding: '6px 10px',
    outline: 'none',
    fontFamily: F,
    boxSizing: 'border-box',
    lineHeight: 1.5,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: focused ? `0 0 0 3px ${ac}18` : 'none',
  };

  const ev = {
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
    onChange, value,
  };

  if (field.type === 'select') return (
    <select style={{
      ...base, cursor: 'pointer', appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234a5f7a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      paddingRight: 30,
    }} {...ev}>
      {(field.options || []).map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );

  if (field.type === 'textarea') return (
    <textarea rows={3}
      style={{ ...base, resize: 'vertical', lineHeight: 1.6 }}
      {...ev} placeholder={field.placeholder || ''} />
  );

  return (
    <input type={field.type || 'text'}
      style={base} {...ev} placeholder={field.placeholder || ''} />
  );
};

/* ── Handle builder ──────────────────────────────────────── */
export const buildHandles = (list = [], type, color) =>
  list.map((h, i) => {
    const n   = list.length;
    const top = n === 1 ? '50%' : `${((i + 1) / (n + 1)) * 100}%`;
    const isL = type === 'target';
    return (
      <Handle key={h.id} type={type} id={h.id}
        position={isL ? Position.Left : Position.Right}
        style={{
          top,
          width: 11, height: 11,
          background: color,
          border: '2.5px solid #080c14',
          boxShadow: `0 0 0 2px ${color}30`,
        }}
      />
    );
  });

/* ── BaseNode ────────────────────────────────────────────── */
export const BaseNode = ({
  id, data, title, color = '#6366f1', icon = '',
  fields = [], handles = {}, minWidth = 240, children, selected,
}) => {
  const updateNodeField = useStore(s => s.updateNodeField);

  const [vals, setVals] = useState(() => {
    const s = {};
    fields.forEach(f => { s[f.key] = data?.[f.key] ?? f.default ?? ''; });
    return s;
  });

  const onChange = key => e => {
    const val = e.target.value;
    setVals(p => ({ ...p, [key]: val }));
    updateNodeField(id, key, val);
  };

  const glow = selected ? `0 0 0 1.5px ${color}90, 0 0 24px ${color}20` : 'none';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minWidth,
        fontFamily: F,
        position: 'relative',
        overflow: 'visible',
        /* layered card look */
        background: 'linear-gradient(160deg, #151d2e 0%, #0f1622 100%)',
        borderRadius: 12,
        border: selected
          ? `1px solid ${color}60`
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: selected
          ? `${glow}, 0 16px 40px rgba(0,0,0,0.55)`
          : '0 2px 8px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Colored top accent line */}
      {/* <div style={{
        position: 'absolute', top: 0, left: 12, right: 12, height: 2,
        background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`,
        borderRadius: '0 0 2px 2px',
        opacity: 0.8,
      }} /> */}

      {buildHandles(handles.inputs  || [], 'target', color)}
      {buildHandles(handles.outputs || [], 'source', color)}

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px 9px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{
          width: 24, height: 24, borderRadius: 6,
          background: `${color}18`,
          border: `1px solid ${color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color, fontWeight: 700, flexShrink: 0,
          letterSpacing: '-0.02em',
        }}>{icon}</span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: '#7b8fa8',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
        }}>{title}</span>
      </div>

      {/* ── Body ── */}
      {(fields.length > 0 || children) && (
        <div style={{
          padding: '12px 14px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{
                display: 'block',
                fontSize: 10, fontWeight: 600,
                color: '#3d5270',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 5,
              }}>{f.label}</label>
              <Field field={{ ...f, accentColor: color }} value={vals[f.key]} onChange={onChange(f.key)} />
            </div>
          ))}
          {children}
        </div>
      )}
    </motion.div>
  );
};