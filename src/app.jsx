import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import yaml from 'js-yaml';
import policyYaml from '../policies/mobility.policy.yaml?raw';
import { useIsMobile } from './hooks/use-is-mobile';
import { C } from './lib/theme';
import { fmtRange, cardCostTags } from './lib/format';
import { makeRefIndex } from './lib/ref-index';
import { resolveTokens } from './lib/tokens';
import { Icon } from './components/icon';
import { MeasureSection } from './components/measure-section';
import { SummarySection } from './components/summary-section';
import { ReferencesSection } from './components/references-section';
import { KpiSection } from './components/kpi-section';

// Build section IDs from measure IDs in the YAML
function sectionIds(policy) {
  const ids = policy.measures.map(m => m.id);
  ids.push('summary');
  if (policy.kpis) ids.push('kpis');
  ids.push('refs');
  return ids;
}

export default function App() {
  const [policy, yamlError] = useMemo(() => {
    try { return [yaml.load(policyYaml), null]; }
    catch (e) { return [null, e]; }
  }, []);
  const allIds = useMemo(() => policy ? sectionIds(policy) : [], [policy]);

  const mobile = useIsMobile();
  const px = mobile ? 20 : 40;

  // Read initial open sections from URL hash
  const [openSections, setOpenSections] = useState(() => {
    if (!policy) return new Set();
    const hash = window.location.hash.slice(1);
    if (hash && allIds.includes(hash)) return new Set([hash]);
    return new Set([policy.measures[0].id]);
  });
  const hasUserNavigated = useRef(false);

  const [highlightRef, setHighlightRef] = useState(null); // { id, tick }
  const [copied, setCopied] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerRef = useRef(null);

  // Sticky header on mobile: show when main header scrolls out of view
  useEffect(() => {
    if (!mobile) {
      setShowStickyHeader(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    const el = headerRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [mobile]);

  // Sync URL hash when sections change (only after user interaction)
  useEffect(() => {
    if (!hasUserNavigated.current) return;
    const ids = [...openSections];
    if (ids.length === 1) {
      window.history.replaceState(null, '', `#${ids[0]}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [openSections]);

  const refIndexRef = useRef(null);
  if (!refIndexRef.current) refIndexRef.current = makeRefIndex(policy.references);
  const refIndex = refIndexRef.current;

  const toggle = useCallback((id) => {
    hasUserNavigated.current = true;
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAndScroll = useCallback((id) => {
    hasUserNavigated.current = true;
    setOpenSections(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      const el = document.querySelector(`[data-section="${id}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const onRefClick = useCallback((e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const refNum = parseInt(href?.replace('#ref-', ''), 10);
    setOpenSections(prev => new Set([...prev, 'refs']));
    setHighlightRef({ id: refNum, tick: Date.now() });
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 420);
  }, []);

  const allOpen = openSections.size === allIds.length;
  const toggleAll = useCallback(() => {
    setOpenSections(prev => prev.size === allIds.length ? new Set() : new Set(allIds));
  }, [allIds]);

  if (yamlError) {
    return (
      <div style={{ fontFamily: C.sans, background: C.bg, color: C.ink, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.faint, marginBottom: 16 }}>Policy file error</div>
          <h1 style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 600, color: C.ink, marginBottom: 12 }}>{yamlError.reason || 'Invalid YAML'}</h1>
          {yamlError.mark && (
            <div style={{ fontFamily: C.mono, fontSize: 12, color: C.mid, background: C.card, border: `1px solid ${C.rule}`, padding: '16px 20px', borderRadius: 4, lineHeight: 1.6, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              Line {yamlError.mark.line + 1}, column {yamlError.mark.column + 1}
              {yamlError.mark.snippet && <>{'\n\n'}{yamlError.mark.snippet}</>}
            </div>
          )}
        </div>
      </div>
    );
  }

  const allStats = policy.measures.flatMap(m => m.context?.stats || []);
  const metaCtx = { stats: allStats, legal: [], refs: policy.references, refIndex, onRefClick, mobile };
  const ctx = { refs: policy.references, refIndex, onRefClick, mobile };
  const summary = policy.summary;

  return (
    <div style={{ fontFamily: C.sans, background: C.bg, color: C.ink, fontSize: 15, lineHeight: 1.7, WebkitFontSmoothing: 'antialiased', minHeight: '100vh' }}>

      {/* Sticky mobile header */}
      {mobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: C.ink, color: '#f7f6f4', padding: '10px 20px',
          fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
          opacity: showStickyHeader ? 1 : 0, transform: showStickyHeader ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'opacity 0.25s, transform 0.25s',
          pointerEvents: showStickyHeader ? 'auto' : 'none',
        }}>
          {policy.meta.title}
        </div>
      )}

      {/* HEADER */}
      <header ref={headerRef} style={{ background: C.ink, color: '#f7f6f4', padding: mobile ? '40px 0 36px' : '64px 0 56px', position: 'relative', overflow: 'hidden' }}>
        {policy.meta.background_image && (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'absolute', inset: 0, backgroundImage: `url(${policy.meta.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08, pointerEvents: 'none' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ maxWidth: 860, margin: '0 auto', padding: `0 ${px}px`, position: 'relative' }}>
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.45)', marginBottom: 16 }}>
            Municipality of Athens &nbsp;·&nbsp; Mobility Reform
          </div>
          <h1 style={{ fontFamily: C.serif, fontSize: mobile ? 28 : 'clamp(32px, 5vw, 50px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20, color: '#f7f6f4' }}>
            {policy.meta.title}<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(247,246,244,0.65)' }}>{policy.meta.subtitle}</em>
          </h1>
          <p style={{ fontSize: mobile ? 14 : 16, fontWeight: 300, color: 'rgba(247,246,244,0.7)', lineHeight: 1.75, borderLeft: '2px solid rgba(247,246,244,0.2)', paddingLeft: 16, marginBottom: 32 }}>
            {resolveTokens(policy.meta.tagline?.replace(/\n/g, ' '), metaCtx)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, auto)', gap: mobile ? '16px 24px' : '0 32px', alignItems: 'start' }}>
            {[
              { label: 'Scope', value: policy.meta.scope },
              { label: 'Status', value: policy.meta.status },
              { label: 'Year 1 Annual', value: fmtRange(summary.annual.low, summary.annual.high) },
              { label: 'Year 1 Setup', value: fmtRange(summary.setup.low, summary.setup.high) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.3)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(247,246,244,0.75)', lineHeight: 1.4 }}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      {/* MEASURE STRIP */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.rule}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? 0 : `0 ${px}px`, display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)' }}>
          {policy.measures.map((m, i) => {
            const isLast = i === policy.measures.length - 1;
            const active = openSections.has(m.id);
            return (
              <div key={m.id} onClick={() => toggleAndScroll(m.id)}
                style={{
                  padding: mobile ? '24px 20px' : '36px 28px 32px',
                  borderRight: (!mobile && !isLast) ? `1px solid ${C.rule}` : 'none',
                  borderBottom: (mobile && !isLast) ? `1px solid ${C.rule}` : 'none',
                  cursor: 'pointer', display: 'flex', flexDirection: mobile ? 'row' : 'column',
                  alignItems: mobile ? 'center' : 'flex-start',
                  gap: mobile ? 16 : 0,
                  background: active ? C.hover : 'transparent', transition: 'background 0.2s', position: 'relative'
                }}>
                {active && <div style={{ position: 'absolute', [mobile ? 'left' : 'bottom']: -1, [mobile ? 'top' : 'left']: 0, [mobile ? 'bottom' : 'right']: 0, [mobile ? 'width' : 'height']: 2, background: C.ink }} />}
                <div style={{ color: C.ink, opacity: 0.8, flexShrink: 0, marginBottom: mobile ? 0 : 16 }}><Icon name={m.icon} size={mobile ? 24 : 32} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.faint, marginBottom: 4 }}>Measure {String(i+1).padStart(2,'0')}</div>
                  <div style={{ fontFamily: C.serif, fontSize: mobile ? 15 : 16, fontWeight: 600, lineHeight: 1.3, marginBottom: mobile ? 0 : 6, color: C.ink }}>{m.title}</div>
                  {!mobile && <div style={{ fontSize: 12.5, color: C.light, lineHeight: 1.55 }}>{m.tagline}</div>}
                </div>
                {mobile
                  ? <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: `1px solid ${C.rule}`, borderRadius: '50%', background: active ? C.ink : 'transparent' }}>
                      <Icon name={active ? 'minus' : 'plus'} size={10} style={{ color: active ? '#f7f6f4' : C.mid }} />
                    </div>
                  : <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {cardCostTags(m).map((tag, j) => (
                        <span key={j} style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.08em', background: C.bg, border: `1px solid ${C.rule}`, padding: '3px 8px', borderRadius: 3, color: C.mid, display: 'inline-block', alignSelf: 'flex-start' }}>{tag}</span>
                      ))}
                    </div>
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <main style={{ padding: mobile ? '32px 0' : '56px 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: mobile ? '0 20px' : '0 40px', marginBottom: 4 }}>
          <span style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.label }}>Policy Measures</span>
          <span onClick={toggleAll} style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.faint, cursor: 'pointer', padding: '4px 0' }}>
            {allOpen ? 'Collapse all' : 'Expand all'}
          </span>
        </div>

        {policy.measures.map((m, i) => (
          <MeasureSection key={m.id} measure={m} index={i} isOpen={openSections.has(m.id)} onToggle={() => toggle(m.id)} ctx={ctx} sectionId={m.id} />
        ))}

        <div style={{ maxWidth: 860, margin: '0 auto', fontFamily: C.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.label, padding: mobile ? '40px 20px 4px' : '40px 40px 4px' }}>Summary & Timeline</div>
        <SummarySection policy={policy} isOpen={openSections.has('summary')} onToggle={() => toggle('summary')} mobile={mobile} />

        {policy.kpis && (
          <>
            <div style={{ maxWidth: 860, margin: '0 auto', fontFamily: C.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.label, padding: mobile ? '40px 20px 4px' : '40px 40px 4px' }}>Performance</div>
            <KpiSection kpis={policy.kpis} measures={policy.measures} isOpen={openSections.has('kpis')} onToggle={() => toggle('kpis')} mobile={mobile} ctx={ctx} />
          </>
        )}

        <div style={{ maxWidth: 860, margin: '0 auto', fontFamily: C.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.label, padding: mobile ? '40px 20px 4px' : '40px 40px 4px' }}>Sources</div>
        <ReferencesSection refs={policy.references} refIndex={refIndex} isOpen={openSections.has('refs')} onToggle={() => toggle('refs')} mobile={mobile} highlightRef={highlightRef} />
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.rule}`, padding: mobile ? '24px 20px' : '32px 40px', maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: mobile ? 12 : 8 }}>
        <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint }}>Municipality of Athens · Mobility Reform</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            onClick={() => {
              navigator.clipboard.writeText(policyYaml).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint, cursor: 'pointer', borderBottom: `1px dotted ${C.rule}`, paddingBottom: 1 }}
          >
            {copied ? 'Copied' : 'Copy policy file'}
          </span>
          <span style={{ fontSize: 12, color: C.faint }}>{policy.meta.footer}</span>
        </div>
      </footer>
    </div>
  );
}
