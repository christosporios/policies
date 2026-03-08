import { useState, useEffect } from 'react';
import { C } from '../lib/theme';
import { Icon } from './icon';
import { AccordionBody } from './accordion-body';

export const ReferencesSection = ({ refs, refIndex, isOpen, onToggle, mobile, highlightRef }) => {
  const usedMap = refIndex.getMap();
  const usedRefs = refs.filter(r => usedMap[r.id]).sort((a, b) => usedMap[a.id] - usedMap[b.id]);
  const [flashId, setFlashId] = useState(null);

  useEffect(() => {
    if (highlightRef?.id) {
      setFlashId(highlightRef.id);
      const timer = setTimeout(() => setFlashId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [highlightRef]);

  return (
    <div data-section="refs" style={{ background: isOpen ? C.hover : 'transparent', transition: 'background 0.2s' }}>
      <div style={{ borderTop: `1px solid ${C.rule}` }} />
      <button onClick={onToggle} aria-expanded={isOpen} style={{ cursor: 'pointer', userSelect: 'none', background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0, font: 'inherit', color: 'inherit' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: mobile ? '20px 20px' : '24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: mobile ? 12 : 20, flex: 1 }}>
            {!mobile && <span style={{ color: C.faint, paddingTop: 7, minWidth: 28, display: 'flex' }}><Icon name="book" size={16} /></span>}
            <div>
              <div style={{ fontFamily: C.serif, fontSize: mobile ? 18 : 22, fontWeight: 600, color: C.ink }}>References</div>
              <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, marginTop: 3, letterSpacing: '0.04em' }}>{usedRefs.length} sources · Academic, legislative, municipal data</div>
            </div>
          </div>
          <div style={{ width: 28, height: 28, border: `1px solid ${C.rule}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: isOpen ? C.ink : 'transparent' }}>
            <Icon name={isOpen ? 'minus' : 'plus'} size={10} style={{ color: isOpen ? '#f7f6f4' : C.mid }} />
          </div>
        </div>
      </button>

      <AccordionBody isOpen={isOpen}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? '0 20px 40px' : '0 40px 40px' }}>
          {usedRefs.map(r => {
            const refNum = usedMap[r.id];
            const isFlashing = flashId === refNum;
            return (
              <div key={r.id} id={`ref-${refNum}`} style={{
                display: 'flex', gap: 14, padding: '10px 0', borderBottom: `1px solid ${C.rule}`, fontSize: 12.5, color: C.light, lineHeight: 1.55,
                background: isFlashing ? 'rgba(26,26,26,0.08)' : 'transparent',
                transition: 'background 0.3s ease',
              }}>
                <span style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, minWidth: 20, paddingTop: 2, flexShrink: 0 }}>[{refNum}]</span>
                <span>
                  {r.author && <>{r.author}, </>}
                  <em>{r.title}</em>
                  {r.year && <>, {r.year}</>}
                  {r.publication && <>. {r.publication}</>}
                  {r.url && <> ({r.url})</>}
                  {r.detail && <>. {r.detail}</>}
                </span>
              </div>
            );
          })}
        </div>
      </AccordionBody>
    </div>
  );
};
