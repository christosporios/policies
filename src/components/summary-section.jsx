import { C } from '../lib/theme';
import { fmtRange, summaryCost } from '../lib/format';
import { Icon } from './icon';

export const SummarySection = ({ policy, isOpen, onToggle, mobile }) => (
  <div data-section="summary" style={{ background: isOpen ? C.hover : 'transparent', transition: 'background 0.2s' }}>
    <div style={{ borderTop: `1px solid ${C.rule}` }} />
    <button onClick={onToggle} aria-expanded={isOpen} style={{ cursor: 'pointer', userSelect: 'none', background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0, font: 'inherit', color: 'inherit' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: mobile ? '20px 20px' : '24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: mobile ? 12 : 20, flex: 1 }}>
          {!mobile && <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: '0.15em', color: C.faint, paddingTop: 4, minWidth: 28 }}>—</span>}
          <div>
            <div style={{ fontFamily: C.serif, fontSize: mobile ? 18 : 22, fontWeight: 600, color: C.ink }}>Costs, Timeline & Assumptions</div>
            <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, marginTop: 3, letterSpacing: '0.04em' }}>Combined budget · Implementation schedule</div>
          </div>
        </div>
        <div style={{ width: 28, height: 28, border: `1px solid ${C.rule}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: isOpen ? C.ink : 'transparent' }}>
          <Icon name={isOpen ? 'minus' : 'plus'} size={10} style={{ color: isOpen ? '#f7f6f4' : C.mid }} />
        </div>
      </div>
    </button>

    <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0, transition: 'grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease' }}>
      <div style={{ overflow: 'hidden' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? '0 20px 40px' : '0 40px 40px' }}>
        {/* Summary grid */}
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: C.rule, border: `1px solid ${C.rule}`, marginBottom: 32 }}>
          {policy.measures.map((m, i) => {
            const costs = summaryCost(m);
            return (
              <div key={i} style={{ background: C.card, padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.faint, marginBottom: 8 }}>Measure {String(i+1).padStart(2,'0')}</div>
                <div style={{ fontFamily: C.serif, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 10 }}>{m.title.split('—')[0].trim()}</div>
                <div style={{ fontSize: 12, color: C.light, lineHeight: 1.5, marginBottom: 12, flex: 1 }}>{m.tagline}</div>
                <div style={{ fontFamily: C.mono, fontSize: 11, color: C.mid, borderTop: `1px solid ${C.rule}`, paddingTop: 10, lineHeight: 1.6, marginTop: 'auto' }}>
                  {costs.map((l, j) => <div key={j}>{l}</div>)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total band */}
        <div style={{ background: C.ink, color: '#f7f6f4', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
          <div>
            <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.45)', display: 'block', marginBottom: 4 }}>Total Year 1 Annual Cost</span>
            <span style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 600 }}>{fmtRange(policy.summary.total_annual_low, policy.summary.total_annual_high)} / year</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(247,246,244,0.45)', maxWidth: 260, textAlign: mobile ? 'left' : 'right', lineHeight: 1.55 }}>{policy.summary.note}</div>
        </div>

        {/* Timeline */}
        <div>
          {policy.timeline.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '10px 0', borderBottom: i < policy.timeline.length - 1 ? `1px solid ${C.rule}` : 'none' }}>
              <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.1em', color: C.faint, minWidth: 52, paddingTop: 2 }}>Month {t.month}</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.ink, flexShrink: 0, marginTop: 7 }} />
              <span style={{ fontSize: 13.5, color: C.mid, lineHeight: 1.5 }}>{t.milestone}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  </div>
);
