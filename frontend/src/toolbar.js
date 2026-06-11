import { motion } from 'framer-motion';
import { DraggableNode } from './draggableNode';
import { Workflow } from 'lucide-react';

const NODES = [
  { type: 'customInput',  label: 'Input',     color: '#38bdf8', icon: '→' },
  { type: 'customOutput', label: 'Output',    color: '#e879f9', icon: '←' },
  { type: 'llm',          label: 'LLM',       color: '#818cf8', icon: '✦' },
  { type: 'text',         label: 'Text',      color: '#f97316', icon: 'T' },
  { type: 'api',          label: 'API',       color: '#34d399', icon: '⚡' },
  { type: 'filter',       label: 'Filter',    color: '#fbbf24', icon: '⊘' },
  { type: 'transform',    label: 'Transform', color: '#7dd3fc', icon: '⇄' },
  { type: 'merge',        label: 'Merge',     color: '#c084fc', icon: '⊕' },
  { type: 'note',         label: 'Note',      color: '#fde68a', icon: '✎' },
];

export const PipelineToolbar = () => (
  <div style={{
    display: 'flex', alignItems: 'center',
    height: 52, padding: '0 18px', gap: 0,
    background: '#090d13',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    userSelect: 'none', position: 'relative', zIndex: 100,
    flexShrink: 0,
  }}>
    {/* Brand */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 20, flexShrink: 0 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
        flexShrink: 0,
      }}>
        <Workflow size={14} color="#fff" strokeWidth={2.5} />
      </div>
      <span style={{
        fontSize: 14, fontWeight: 600, color: '#e8edf5',
        letterSpacing: '-0.01em', whiteSpace: 'nowrap',
      }}>VectorShift</span>
    </div>

    {/* Divider */}
    <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', marginRight: 18, flexShrink: 0 }} />

    {/* Label */}
    <span style={{
      fontSize: 9.5, fontWeight: 700, color: '#2e4060',
      letterSpacing: '0.14em', textTransform: 'uppercase',
      marginRight: 14, flexShrink: 0,
    }}>Nodes</span>

    {/* Chips */}
    <div style={{
      display: 'flex', gap: 6, alignItems: 'center',
      overflowX: 'auto', flexWrap: 'nowrap',
      padding: '2px 0', scrollbarWidth: 'none',
    }}>
      {NODES.map((n, i) => (
        <motion.div key={n.type}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.025, duration: 0.18 }}
        >
          <DraggableNode type={n.type} label={n.label} color={n.color} icon={n.icon} />
        </motion.div>
      ))}
    </div>
  </div>
);