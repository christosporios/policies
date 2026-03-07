import { C } from '../lib/theme';
import { Icon } from './icon';

export const AllocationGrid = ({ allocations, mobile }) => (
  <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: C.rule, border: `1px solid ${C.rule}`, margin: '20px 0' }}>
    {allocations.map((a, i) => (
      <div key={i} style={{ background: C.card, padding: '22px 18px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <Icon name={a.icon} size={24} style={{ color: C.ink }} />
        </div>
        <span style={{ fontFamily: C.mono, fontSize: 22, fontWeight: 500, color: C.ink, display: 'block', marginBottom: 4 }}>{a.quantity}</span>
        <span style={{ fontSize: 12, color: C.light, lineHeight: 1.4 }}>{a.label}</span>
        <div style={{ marginTop: 8, fontFamily: C.mono, fontSize: 10, color: C.faint, letterSpacing: '0.05em' }}>{a.output}</div>
      </div>
    ))}
  </div>
);
