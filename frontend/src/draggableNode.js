import { useState } from 'react';
import { motion } from 'framer-motion';

export const DraggableNode = ({ type, label, color = '#6366f1', icon = '' }) => {
  const [hovered, setHovered] = useState(false);

  const onDragStart = e => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.94 }}
      animate={{ scale: hovered ? 1.03 : 1 }}
      transition={{ duration: 0.12 }}
      style={{
        cursor: 'grab',
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 11px 5px 9px',
        background: hovered ? `${color}12` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? color + '45' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 8,
        userSelect: 'none', flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* subtle left accent line */}
      <div style={{
        position: 'absolute', left: 0, top: 4, bottom: 4,
        width: 2.5, background: color, borderRadius: '0 2px 2px 0',
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.15s',
      }} />
      <span style={{ fontSize: 11, color, opacity: 0.9, lineHeight: 1, marginLeft: 4 }}>{icon}</span>
      <span style={{
        color: '#8b96a8', fontSize: 11.5, fontWeight: 500,
        fontFamily: "'Inter', system-ui, sans-serif",
        letterSpacing: '0.01em',
      }}>{label}</span>
    </motion.div>
  );
};