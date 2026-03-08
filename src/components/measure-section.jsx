import { C } from '../lib/theme';
import { resolveTokens, resolveBody } from '../lib/tokens';
import { Icon } from './icon';
import { Subheading } from './subheading';
import { Note } from './note';
import { CaseStudy } from './case-study';
import { BudgetTable } from './budget-table';
import { AllocationGrid } from './allocation-grid';
import { ParamGrid } from './param-grid';
import { AccordionBody } from './accordion-body';

export const MeasureSection = ({ measure, index, isOpen, onToggle, ctx, sectionId }) => {
  const mobile = ctx.mobile;
  const sectionCtx = {
    stats: measure.context?.stats || [],
    legal: measure.context?.legal || [],
    refs: ctx.refs,
    refIndex: ctx.refIndex,
    onRefClick: ctx.onRefClick,
    mobile,
  };

  return (
    <div data-section={sectionId} style={{ background: isOpen ? C.hover : 'transparent', transition: 'background 0.2s' }}>
      <div style={{ borderTop: `1px solid ${C.rule}` }} />
      <button onClick={onToggle} aria-expanded={isOpen} style={{ cursor: 'pointer', userSelect: 'none', background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0, font: 'inherit', color: 'inherit' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: mobile ? '20px 20px' : '24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: mobile ? 12 : 20, flex: 1 }}>
            {!mobile && <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: '0.15em', color: C.faint, paddingTop: 4, minWidth: 28 }}>
              {String(index + 1).padStart(2, '0')}
            </span>}
            <div>
              <div style={{ fontFamily: C.serif, fontSize: mobile ? 18 : 22, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{measure.title}</div>
              <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, marginTop: 3, letterSpacing: '0.04em' }}>{measure.subtitle}</div>
            </div>
          </div>
          <div style={{ width: 28, height: 28, border: `1px solid ${C.rule}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: isOpen ? C.ink : 'transparent', transition: 'background 0.2s' }}>
            <Icon name={isOpen ? 'minus' : 'plus'} size={10} style={{ color: isOpen ? '#f7f6f4' : C.mid }} />
          </div>
        </div>
      </button>

      <AccordionBody isOpen={isOpen}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? '0 20px 40px' : '0 40px 40px' }}>

          <Subheading>Context</Subheading>
          <div style={{ marginBottom: 4 }}>{resolveBody(measure.context?.body, sectionCtx)}</div>
          {measure.context?.images?.map((img, i) => (
            <figure key={i} style={{ margin: '24px 0', padding: 0, border: `1px solid ${C.rule}`, borderRadius: 5, overflow: 'hidden' }}>
              <img src={img.src} alt={img.caption || ''} style={{ width: '100%', display: 'block' }} />
              {img.caption && (
                <figcaption style={{ fontSize: 12.5, color: C.mid, padding: '12px 16px', background: C.card, lineHeight: 1.5, borderTop: `1px solid ${C.rule}` }}>
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
          {measure.context?.notes?.map((n, i) => <Note key={i}>{resolveTokens(n.replace(/\n/g, ' '), sectionCtx)}</Note>)}

          <Subheading>Action</Subheading>
          <div style={{ marginBottom: 4 }}>{resolveBody(measure.action?.body, sectionCtx)}</div>
          {measure.action?.images?.map((img, i) => (
            <figure key={i} style={{ margin: '24px 0', padding: 0, border: `1px solid ${C.rule}`, borderRadius: 5, overflow: 'hidden' }}>
              <img src={img.src} alt={img.caption || ''} style={{ width: '100%', display: 'block' }} />
              {img.caption && (
                <figcaption style={{ fontSize: 12.5, color: C.mid, padding: '12px 16px', background: C.card, lineHeight: 1.5, borderTop: `1px solid ${C.rule}` }}>
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
          {measure.action?.tranches && (
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : `repeat(${measure.action.tranches.length}, 1fr)`, gap: 1, background: C.rule, border: `1px solid ${C.rule}`, margin: '20px 0' }}>
              {measure.action.tranches.map((t, i) => (
                <div key={i} style={{ background: C.card, padding: '18px 16px' }}>
                  <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.faint, marginBottom: 6 }}>Tranche {t.tranche} · Months {t.months}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 500, color: C.ink, marginBottom: 4 }}>{t.spaces}</div>
                  <div style={{ fontSize: 12, color: C.light, lineHeight: 1.4, marginBottom: 6 }}>spaces</div>
                  <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.5 }}>{t.area}</div>
                  {t.mix && <div style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, marginTop: 8, letterSpacing: '0.03em' }}>{t.mix}</div>}
                </div>
              ))}
            </div>
          )}
          {measure.action?.allocations && <AllocationGrid allocations={measure.action.allocations} mobile={ctx.mobile} />}
          {measure.action?.params && <ParamGrid params={measure.action.params} mobile={ctx.mobile} />}
          {measure.action?.notes?.map((n, i) => <Note key={i}>{resolveTokens(n.replace(/\n/g, ' '), sectionCtx)}</Note>)}

          {measure.context?.case_studies?.length > 0 && (
            <>
              {measure.context.case_studies.map((cs, i) => <CaseStudy key={i} cs={cs} ctx={sectionCtx} />)}
            </>
          )}

          <Subheading>Budget</Subheading>
          <BudgetTable items={measure.budget.items} assumptions={measure.budget.assumptions} notes={measure.budget.notes} ctx={sectionCtx} />
        </div>
      </AccordionBody>
    </div>
  );
};
