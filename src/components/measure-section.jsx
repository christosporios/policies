import { C } from '../lib/theme';
import { resolveTokens, resolveBody } from '../lib/tokens';
import { Icon } from './icon';
import { Subheading } from './subheading';
import { Note } from './note';
import { CaseStudy } from './case-study';
import { BudgetTable } from './budget-table';
import { AllocationGrid } from './allocation-grid';
import { ParamGrid } from './param-grid';

export const MeasureSection = ({ measure, index, isOpen, onToggle, ctx, sectionId }) => {
  const mobile = ctx.mobile;
  const sectionCtx = {
    stats: measure.context?.stats || [],
    legal: measure.action?.legal || [],
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

      <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0, transition: 'grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease' }}>
        <div style={{ overflow: 'hidden' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? '0 20px 40px' : '0 40px 40px' }}>

          <Subheading>Context</Subheading>
          <div style={{ marginBottom: 4 }}>{resolveBody(measure.context?.body, sectionCtx)}</div>
          {measure.context?.notes?.map((n, i) => <Note key={i}>{resolveTokens(n.replace(/\n/g, ' '), sectionCtx)}</Note>)}

          <Subheading>Action</Subheading>
          <div style={{ marginBottom: 4 }}>{resolveBody(measure.action?.body, sectionCtx)}</div>
          {measure.action?.allocations && <AllocationGrid allocations={measure.action.allocations} mobile={ctx.mobile} />}
          {measure.action?.params && <ParamGrid params={measure.action.params} mobile={ctx.mobile} />}
          {measure.action?.notes?.map((n, i) => <Note key={i}>{resolveTokens(n.replace(/\n/g, ' '), sectionCtx)}</Note>)}

          {measure.case_studies?.length > 0 && (
            <>
              {measure.case_studies.map((cs, i) => <CaseStudy key={i} cs={cs} ctx={sectionCtx} />)}
            </>
          )}

          <Subheading>Budget</Subheading>
          <BudgetTable items={measure.budget.items} notes={measure.budget.notes} ctx={sectionCtx} />
        </div>
        </div>
      </div>
    </div>
  );
};
