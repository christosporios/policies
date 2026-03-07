import { C } from '../lib/theme';
import { resolveTokens } from '../lib/tokens';

export const CaseStudy = ({ cs, ctx }) => (
  <div style={{ borderLeft: `2px solid ${C.ink}`, padding: '14px 20px', margin: '16px 0', background: C.hover }}>
    <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.faint, marginBottom: 6 }}>
      {cs.type === 'cautionary' ? 'Cautionary Case Study' : 'Case Study'} — {cs.name} · {cs.location} · {cs.period}
    </div>
    <p style={{ fontSize: 13.5, color: C.mid, margin: '0 0 10px', lineHeight: 1.7 }}>
      {resolveTokens(cs.body?.trim().replace(/\n/g, ' '), ctx)}
    </p>
    {cs.lesson && (
      <p style={{ fontSize: 13.5, color: C.mid, borderTop: `1px solid ${C.rule}`, paddingTop: 10, marginTop: 10, lineHeight: 1.7 }}>
        <strong style={{ fontWeight: 600, color: C.ink }}>Lesson: </strong>
        {resolveTokens(cs.lesson?.trim().replace(/\n/g, ' '), ctx)}
      </p>
    )}
  </div>
);
