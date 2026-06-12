import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

const F   = "'Inter', system-ui, sans-serif";
const CLR = '#818cf8';

// LLMNode is fully standalone so System/Prompt labels
export const LLMNode = ({ id, data, selected }) => {
  const glow = selected ? `0 0 0 1.5px ${CLR}90, 0 0 24px ${CLR}20` : 'none';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 248, fontFamily: F, position: 'relative', overflow: 'visible',
        background: 'linear-gradient(160deg, #151d2e 0%, #0f1622 100%)',
        borderRadius: 12,
        border: selected ? `1px solid ${CLR}60` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: selected
          ? `${glow}, 0 16px 40px rgba(0,0,0,0.55)`
          : '0 2px 8px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Top accent */}
      {/* <div style={{
        position: 'absolute', top: 0, left: 12, right: 12, height: 2,
        background: `linear-gradient(90deg, ${CLR}00, ${CLR}, ${CLR}00)`,
        borderRadius: '0 0 2px 2px', opacity: 0.8,
      }} /> */}

      {/* System handle + label row */}
      <Handle type="target" position={Position.Left} id={`${id}-system`}
        style={{ top: '38%', width: 11, height: 11, background: CLR, border: '2.5px solid #080c14', boxShadow: `0 0 0 2px ${CLR}30` }}
      />
      {/* Prompt handle + label row */}
      <Handle type="target" position={Position.Left} id={`${id}-prompt`}
        style={{ top: '72%', width: 11, height: 11, background: CLR, border: '2.5px solid #080c14', boxShadow: `0 0 0 2px ${CLR}30` }}
      />
      {/* Response output handle */}
      <Handle type="source" position={Position.Right} id={`${id}-response`}
        style={{ top: '50%', width: 11, height: 11, background: CLR, border: '2.5px solid #080c14', boxShadow: `0 0 0 2px ${CLR}30` }}
      />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px 9px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{
          width: 24, height: 24, borderRadius: 6,
          background: `${CLR}18`, border: `1px solid ${CLR}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: CLR, fontWeight: 700,
        }}>✦</span>
        <span style={{
          fontSize: 11, fontWeight: 600, color: '#7b8fa8',
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>LLM</span>
      </div>

      {/* Body — 3 rows matching handle positions */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* System row — vertically centered near top handle (38%) */}
        <div>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 600, color: '#3d5270',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5,
          }}>System</label>
          <div style={{
            padding: '6px 10px', borderRadius: 7,
            background: '#080c14', border: '1.5px dashed rgba(129,140,248,0.2)',
            fontSize: 11, color: '#3d5270', fontStyle: 'italic',
            lineHeight: 1.4,
          }}>Connect a node →</div>
        </div>

        {/* Model select */}
        <div>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 600, color: '#3d5270',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5,
          }}>Model</label>
          <select defaultValue={data?.model || 'gpt-4o'} style={{
            width: '100%', background: '#080c14',
            border: '1.5px solid rgba(255,255,255,0.09)', borderRadius: 7,
            color: '#dce4f0', fontSize: 12, padding: '6px 30px 6px 10px',
            outline: 'none', fontFamily: F, cursor: 'pointer', appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234a5f7a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
            boxSizing: 'border-box',
          }}>
            {['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'gemini-1.5-pro'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Prompt row — vertically centered near bottom handle (72%) */}
        <div>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 600, color: '#3d5270',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5,
          }}>Prompt</label>
          <div style={{
            padding: '6px 10px', borderRadius: 7,
            background: '#080c14', border: '1.5px dashed rgba(129,140,248,0.2)',
            fontSize: 11, color: '#3d5270', fontStyle: 'italic',
            lineHeight: 1.4,
          }}>Connect a node →</div>
        </div>
      </div>
    </motion.div>
  );
};