import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const selector = s => ({ nodes: s.nodes, edges: s.edges });
const F = "'Inter', system-ui, sans-serif";

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      setError('Add at least one node to your pipeline before submitting.');
      return;
    }
    setLoading(true); setResult(null); setError(null);
    try {
      const resp = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!resp.ok) throw new Error(`Server responded with ${resp.status}`);
      setResult(await resp.json());
    } catch (err) {
      setError(err.message || 'Could not reach backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: '#090d13',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Stat label="Total Nodes" value={nodes.length} />
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)' }} />
          <Stat label="Total Edges" value={edges.length} />
        </div>

        {/* Button */}
        <motion.button
          onClick={handleSubmit} disabled={loading}
          whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.35)' } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          style={{
            padding: '7px 20px',
            background: loading ? 'rgba(99,102,241,0.25)' : '#6366f1',
            color: loading ? 'rgba(255,255,255,0.4)' : '#fff',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 8, fontSize: 12, fontWeight: 600,
            fontFamily: F, cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
            boxShadow: loading ? 'none' : '0 1px 6px rgba(99,102,241,0.3)',
          }}
        >
          {loading && <Spinner />}
          {loading ? 'Validating…' : 'Submit Pipeline'}
        </motion.button>
      </div>

      <AnimatePresence>
        {(result || error) && (
          <Modal result={result} error={error}
            onClose={() => { setResult(null); setError(null); }} />
        )}
      </AnimatePresence>
    </>
  );
};

const Stat = ({ label, value }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: '#dce4f0', fontFamily: F, lineHeight: 1 }}>{value}</span>
    <span style={{ fontSize: 9, fontWeight: 700, color: '#2e4060', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>{label}</span>
  </div>
);

const Spinner = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
    style={{
      display: 'inline-block', width: 12, height: 12,
      border: '2px solid rgba(255,255,255,0.15)',
      borderTopColor: 'rgba(255,255,255,0.75)',
      borderRadius: '50%',
    }}
  />
);

const Modal = ({ result, error, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(4,7,12,0.8)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 12 }}
      animate={{ scale: 1,    opacity: 1, y: 0  }}
      exit={{    scale: 0.94, opacity: 0, y: 12 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={e => e.stopPropagation()}
      style={{
        background: 'linear-gradient(160deg, #151d2e 0%, #0f1622 100%)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16, padding: '24px', width: 370,
        boxShadow: '0 32px 64px rgba(0,0,0,0.7)', fontFamily: F,
      }}
    >
      {error ? <ErrorState error={error} onClose={onClose} />
             : <SuccessState result={result} onClose={onClose} />}
    </motion.div>
  </motion.div>
);

const ErrorState = ({ error, onClose }) => (
  <>
    <ModalHeader icon="⚠" color="#ef4444" title="Validation Error" onClose={onClose} />
    <p style={{ fontSize: 13, color: '#8b96a8', lineHeight: 1.65, margin: '14px 0 0' }}>{error}</p>
    <CloseHint />
  </>
);

const SuccessState = ({ result, onClose }) => (
  <>
    <ModalHeader icon="✦" color="#6366f1" title="Pipeline Analysis"
      subtitle="Validation complete" onClose={onClose} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '18px 0 12px' }}>
      <StatCard label="Nodes" value={result.num_nodes} color="#6366f1" />
      <StatCard label="Edges" value={result.num_edges} color="#a855f7" />
    </div>
    <DAGBadge isDAG={result.is_dag} />
    <CloseHint />
  </>
);

const ModalHeader = ({ icon, color, title, subtitle, onClose }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: `${color}18`, border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e8edf5' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 9.5, fontWeight: 600, color: '#2e4060', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
    <button onClick={onClose} style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 7, width: 26, height: 26, color: '#4a5f7a',
      fontSize: 15, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F, lineHeight: 1,
    }}>×</button>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div style={{
    background: '#080c14', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '13px 14px',
  }}>
    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#2e4060', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
  </div>
);

const DAGBadge = ({ isDAG }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 11,
    padding: '13px 14px', borderRadius: 10,
    background: isDAG ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
    border: `1px solid ${isDAG ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)'}`,
  }}>
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
      background: isDAG ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1.5px solid ${isDAG ? '#22c55e' : '#ef4444'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10,
    }}>{isDAG ? '✓' : '✕'}</div>
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: isDAG ? '#4ade80' : '#f87171', marginBottom: 3 }}>
        {isDAG ? 'Valid DAG Structure' : 'Graph Cycle Detected'}
      </div>
      <div style={{ fontSize: 11, color: '#4a5f7a', lineHeight: 1.5 }}>
        {isDAG
          ? 'No loop cycles found. Pipeline is safe for execution.'
          : 'Cycles detected. Pipelines must be unidirectional to compile.'}
      </div>
    </div>
  </div>
);

const CloseHint = () => (
  <p style={{ fontSize: 10, color: '#1e2d42', textAlign: 'center', marginTop: 18, marginBottom: 0, fontWeight: 500 }}>
    Click outside or press Esc to dismiss
  </p>
);