import { C } from '../lib/theme';
import { resolveTokens } from '../lib/tokens';
import { Icon } from './icon';
import { AccordionBody } from './accordion-body';

const typeColors = {
  operational: { bg: 'rgba(26,26,26,0.06)', text: C.mid },
  outcome:     { bg: 'rgba(26,26,26,0.10)', text: C.ink },
  financial:   { bg: 'rgba(26,26,26,0.04)', text: C.mid },
  proxy:       { bg: 'transparent', text: C.light },
};

const TypeBadge = ({ type }) => {
  const c = typeColors[type] || typeColors.operational;
  return (
    <span style={{
      fontFamily: C.mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
      color: c.text, background: c.bg, padding: '2px 7px', borderRadius: 3, whiteSpace: 'nowrap',
    }}>{type}</span>
  );
};

const FreqBadge = ({ frequency }) => (
  <span style={{
    fontFamily: C.mono, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: C.faint, whiteSpace: 'nowrap',
  }}>{frequency}</span>
);

const IndicatorRow = ({ ind, mobile, ctx }) => (
  <div style={{ padding: mobile ? '16px 0' : '14px 0', borderBottom: `1px solid ${C.rule}` }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: C.ink, flex: 1, minWidth: 0 }}>{ind.label}</span>
      <TypeBadge type={ind.type} />
      <FreqBadge frequency={ind.frequency} />
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr',
      gap: mobile ? 8 : 1,
      background: mobile ? 'transparent' : C.rule,
      border: mobile ? 'none' : `1px solid ${C.rule}`,
      marginBottom: ind.note ? 8 : 0,
    }}>
      {[
        { label: 'Baseline', value: ind.baseline },
        { label: 'Target', value: ind.target },
        { label: 'Source', value: ind.source },
      ].map(({ label, value }) => (
        <div key={label} style={{
          background: mobile ? C.hover : C.card, padding: mobile ? '8px 12px' : '10px 14px',
          borderRadius: mobile ? 4 : 0,
        }}>
          <div style={{ fontFamily: C.mono, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.faint, marginBottom: 3 }}>{label}</div>
          <div style={{ fontSize: 12.5, color: C.mid, lineHeight: 1.5 }}>{ctx ? resolveTokens(String(value), ctx) : value}</div>
        </div>
      ))}
    </div>

    {ind.note && (
      <p style={{ fontSize: 12, color: C.light, fontStyle: 'italic', margin: '6px 0 0', lineHeight: 1.5 }}>{ind.note}</p>
    )}
  </div>
);

const MeasureKpiBlock = ({ block, mobile, ctx }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{
      fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
      color: C.faint, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${C.rule}`,
    }}>
      {block.title || block.label}
    </div>
    {block.indicators.map(ind => (
      <IndicatorRow key={ind.id} ind={ind} mobile={mobile} ctx={ctx} />
    ))}
  </div>
);

export const KpiSection = ({ kpis, isOpen, onToggle, mobile, ctx }) => (
  <div data-section="kpis" style={{ background: isOpen ? C.hover : 'transparent', transition: 'background 0.2s' }}>
    <div style={{ borderTop: `1px solid ${C.rule}` }} />
    <button onClick={onToggle} aria-expanded={isOpen} style={{ cursor: 'pointer', userSelect: 'none', background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0, font: 'inherit', color: 'inherit' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: mobile ? '20px 20px' : '24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: mobile ? 12 : 20, flex: 1 }}>
          {!mobile && <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: '0.15em', color: C.faint, paddingTop: 4, minWidth: 28 }}>—</span>}
          <div>
            <div style={{ fontFamily: C.serif, fontSize: mobile ? 18 : 22, fontWeight: 600, color: C.ink }}>Key Performance Indicators</div>
            <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, marginTop: 3, letterSpacing: '0.04em' }}>
              {kpis.reporting_cadence}
            </div>
          </div>
        </div>
        <div style={{ width: 28, height: 28, border: `1px solid ${C.rule}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: isOpen ? C.ink : 'transparent' }}>
          <Icon name={isOpen ? 'minus' : 'plus'} size={10} style={{ color: isOpen ? '#f7f6f4' : C.mid }} />
        </div>
      </div>
    </button>

    <AccordionBody isOpen={isOpen}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? '0 20px 40px' : '0 40px 40px' }}>

          {kpis.note && (
            <p style={{ fontSize: 13, color: C.light, fontStyle: 'italic', marginTop: 0, marginBottom: 24, lineHeight: 1.65 }}>
              {kpis.note.trim()}
            </p>
          )}

          {/* Per-measure KPIs */}
          {kpis.measures.map(block => (
            <MeasureKpiBlock key={block.measure_id} block={block} mobile={mobile} ctx={ctx} />
          ))}

          {/* Programme-wide KPIs */}
          {kpis.programme_wide?.indicators?.length > 0 && (
            <MeasureKpiBlock
              block={{ title: 'Programme-Wide', indicators: kpis.programme_wide.indicators }}
              mobile={mobile}
              ctx={ctx}
            />
          )}
        </div>
    </AccordionBody>
  </div>
);
