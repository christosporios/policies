import { C } from '../lib/theme';

export const ParamGrid = ({ params, mobile }) => (
  <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 1, background: C.rule, border: `1px solid ${C.rule}`, margin: '20px 0' }}>
    {params.map((p, i) => (
      <div key={i} style={{ background: C.card, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 12.5, color: C.light }}>{p.key}</span>
        <span style={{ fontFamily: C.mono, fontSize: 12, color: C.ink, textAlign: 'right' }}>{p.value}</span>
      </div>
    ))}
  </div>
);
