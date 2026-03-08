import { C } from '../lib/theme';
import { fmt, fmtRange, summaryCost, budgetTotals } from '../lib/format';
import { resolveTokens } from '../lib/tokens';
import { Icon } from './icon';
import { Note } from './note';
import { AccordionBody } from './accordion-body';

const SummaryBand = ({ label, low, high, note, suffix }) => (
  <div style={{ background: C.ink, color: '#f7f6f4', padding: '20px 24px', marginBottom: 16 }}>
    <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.45)', display: 'block', marginBottom: 4 }}>{label}</span>
    <span style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 600 }}>{fmtRange(low, high)}{suffix || ''}</span>
    {note && <div style={{ fontSize: 12, color: 'rgba(247,246,244,0.45)', lineHeight: 1.55, marginTop: 10 }}>{note.trim ? note.trim() : note}</div>}
  </div>
);

const CrossCuttingTable = ({ crossCutting, ctx }) => {
  const { items, note } = crossCutting;
  const thStyle = { fontFamily: C.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.faint, textAlign: 'left', paddingBottom: 10, fontWeight: 400, borderBottom: `1.5px solid ${C.ink}` };

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.faint, marginTop: 32, marginBottom: 14, paddingBottom: 6, borderBottom: `1px solid ${C.rule}` }}>
        Cross-Cutting Costs
      </div>
      {note && <Note>{note.trim ? note.trim() : note}</Note>}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: 13, minWidth: 320 }}>
          <thead>
            <tr><th style={thStyle}>Item</th><th style={{ ...thStyle, paddingLeft: 20 }}>Cost</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${C.rule}` }}>
                <td style={{ padding: '11px 0', color: C.mid, fontSize: 13 }}>
                  {item.label}
                  {item.note && <div style={{ fontSize: 12, color: C.light, fontStyle: 'italic', marginTop: 4, lineHeight: 1.5 }}>{item.note.trim ? item.note.trim() : item.note}</div>}
                </td>
                <td style={{ padding: '11px 0 11px 20px', fontFamily: C.mono, fontSize: 12.5, color: C.mid, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                  {fmtRange(item.low, item.high)}{item.type === 'annual' ? ' / yr' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SummarySection = ({ policy, isOpen, onToggle, mobile }) => {
  const summary = policy.summary;
  // Support both old flat format and new structured format
  const hasStructured = summary.setup || summary.annual;

  return (
    <div data-section="summary" style={{ background: isOpen ? C.hover : 'transparent', transition: 'background 0.2s' }}>
      <div style={{ borderTop: `1px solid ${C.rule}` }} />
      <button onClick={onToggle} aria-expanded={isOpen} style={{ cursor: 'pointer', userSelect: 'none', background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0, font: 'inherit', color: 'inherit' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: mobile ? '20px 20px' : '24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: mobile ? 12 : 20, flex: 1 }}>
            {!mobile && <span style={{ color: C.faint, paddingTop: 7, minWidth: 28, display: 'flex' }}><Icon name="coins" size={16} /></span>}
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

      <AccordionBody isOpen={isOpen}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? '0 20px 40px' : '0 40px 40px' }}>
          {/* Per-measure summary grid */}
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : `repeat(${policy.measures.length}, 1fr)`, gap: 1, background: C.rule, border: `1px solid ${C.rule}`, marginBottom: 32 }}>
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

          {/* Cross-cutting costs */}
          {policy.cross_cutting_costs && (
            <CrossCuttingTable crossCutting={policy.cross_cutting_costs} ctx={{}} />
          )}

          {/* Total bands */}
          {hasStructured ? (
            <>
              <SummaryBand label={summary.setup?.label || 'Total Setup'} low={summary.setup.low} high={summary.setup.high} note={summary.setup.note} mobile={mobile} />
              <SummaryBand label={summary.annual?.label || 'Total Annual'} low={summary.annual.low} high={summary.annual.high} note={summary.annual.note} suffix=" / year" mobile={mobile} />
              {summary.eu_grants && (
                <SummaryBand label={summary.eu_grants.label || 'EU Grants (potential)'} low={summary.eu_grants.low} high={summary.eu_grants.high} note={summary.eu_grants.note} mobile={mobile} />
              )}
            </>
          ) : (
            <div style={{ background: C.ink, color: '#f7f6f4', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.45)', display: 'block', marginBottom: 4 }}>Total Year 1 Annual Cost</span>
                <span style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 600 }}>{fmtRange(summary.total_annual_low, summary.total_annual_high)} / year</span>
              </div>
              {summary.note && <div style={{ fontSize: 12, color: 'rgba(247,246,244,0.45)', maxWidth: 260, textAlign: mobile ? 'left' : 'right', lineHeight: 1.55 }}>{summary.note}</div>}
            </div>
          )}

          {/* Timeline */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.faint, marginBottom: 20, paddingBottom: 6, borderBottom: `1px solid ${C.rule}` }}>
              Timeline
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '36px 9px 1fr' : '52px 9px 1fr', columnGap: mobile ? 12 : 16, position: 'relative' }}>
              {/* Vertical line through the dot column */}
              <div style={{ position: 'absolute', left: mobile ? `calc(36px + 12px + 4px)` : `calc(52px + 16px + 4px)`, top: 4, bottom: 4, width: 1, background: C.rule }} />
              {policy.timeline.map((t, i) => {
                const isFirst = i === 0;
                const isLast = i === policy.timeline.length - 1;
                const dotSize = isFirst || isLast ? 9 : 7;
                return (
                  <div key={i} style={{ display: 'contents' }}>
                    {/* Month label */}
                    <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.06em', color: isFirst ? C.ink : C.faint, textAlign: 'right', paddingTop: 2 }}>
                      {t.month} mo
                    </span>
                    {/* Dot */}
                    <span style={{
                      width: dotSize, height: dotSize, borderRadius: '50%',
                      background: isFirst ? C.ink : isLast ? C.mid : C.bg,
                      border: isFirst || isLast ? 'none' : `1.5px solid ${C.mid}`,
                      alignSelf: 'start', justifySelf: 'center', marginTop: 5, position: 'relative', zIndex: 1,
                    }} />
                    {/* Milestone text */}
                    <span style={{ fontSize: 13.5, color: isFirst ? C.ink : C.mid, lineHeight: 1.55, fontWeight: isFirst ? 500 : 400, paddingBottom: isLast ? 0 : 24 }}>
                      {typeof t.milestone === 'string' ? t.milestone : t.milestone?.trim?.() || ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AccordionBody>
    </div>
  );
};
