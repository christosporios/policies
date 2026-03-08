import { useState } from 'react';
import { motion } from 'framer-motion';
import { C } from '../lib/theme';
import { fmtRange } from '../lib/format';
import { useIsMobile } from '../hooks/use-is-mobile';

const CreateCard = ({ index, onSelect, style }) => {
  const [hovered, setHovered] = useState(false);
  const mobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      onClick={() => onSelect('create')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 6,
        cursor: 'pointer', minHeight: mobile ? 120 : 160,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        border: `1px dashed rgba(247,246,244,${hovered ? 0.3 : 0.15})`,
        background: hovered ? 'rgba(26,25,23,0.04)' : 'transparent',
        transition: 'background 0.3s, border-color 0.3s',
        ...style,
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${C.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: hovered ? C.ink : 'transparent', transition: 'background 0.3s' }}>
        <span style={{ fontSize: 20, color: hovered ? '#f7f6f4' : C.faint, transition: 'color 0.3s' }}>+</span>
      </div>
      <span style={{ fontFamily: C.serif, fontSize: mobile ? 18 : 22, fontWeight: 600, color: C.mid }}>Create your own</span>
      <span style={{ fontFamily: C.serif, fontSize: mobile ? 14 : 15, fontStyle: 'italic', color: C.faint, marginTop: 4 }}>Build a structured policy proposal</span>
    </motion.div>
  );
};

const PolicyCard = ({ entry, index, onSelect }) => {
  const { data: policy, slug } = entry;
  const [hovered, setHovered] = useState(false);
  const mobile = useIsMobile();

  if (!policy) return null;

  const bg = policy.meta.background_image;
  const summary = policy.summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      onClick={() => onSelect(slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 6,
        cursor: 'pointer', minHeight: mobile ? 280 : 360,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        background: C.ink,
      }}
    >
      {bg && (
        <motion.div
          layoutId={`policy-bg-${slug}`}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: hovered ? 0.25 : 0.18,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 0.8s, transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 39px, rgba(255,255,255,0.02) 40px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', padding: mobile ? '28px 24px' : '36px 32px', zIndex: 1 }}>
        <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.4)', marginBottom: 12 }}>
          {policy.meta.scope}
        </div>
        <motion.h2
          layoutId={`policy-title-${slug}`}
          style={{ fontFamily: C.serif, fontSize: mobile ? 24 : 30, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#f7f6f4', marginBottom: 6 }}
        >
          {policy.meta.title}
        </motion.h2>
        <p style={{ fontFamily: C.serif, fontSize: mobile ? 16 : 18, fontWeight: 400, fontStyle: 'italic', color: 'rgba(247,246,244,0.55)', marginBottom: 20, lineHeight: 1.4 }}>
          {policy.meta.subtitle}
        </p>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {policy.meta.status && (
            <div>
              <span style={{ fontFamily: C.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.3)', display: 'block', marginBottom: 2 }}>Status</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(247,246,244,0.7)' }}>{policy.meta.status}</span>
            </div>
          )}
          {summary && (
            <>
              <div>
                <span style={{ fontFamily: C.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.3)', display: 'block', marginBottom: 2 }}>Setup</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(247,246,244,0.7)' }}>{fmtRange(summary.setup.low, summary.setup.high)}</span>
              </div>
              <div>
                <span style={{ fontFamily: C.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.3)', display: 'block', marginBottom: 2 }}>Annual</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(247,246,244,0.7)' }}>{fmtRange(summary.annual.low, summary.annual.high)}</span>
              </div>
            </>
          )}
          {policy.measures && (
            <div>
              <span style={{ fontFamily: C.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.3)', display: 'block', marginBottom: 2 }}>Measures</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(247,246,244,0.7)' }}>{policy.measures.length}</span>
            </div>
          )}
        </div>

        <div style={{
          position: 'absolute', right: mobile ? 24 : 32, bottom: mobile ? 28 : 36,
          width: 32, height: 32, borderRadius: '50%',
          border: '1px solid rgba(247,246,244,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hovered ? 'rgba(247,246,244,0.1)' : 'transparent',
          transition: 'background 0.3s, transform 0.3s',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}>
          <span style={{ color: 'rgba(247,246,244,0.5)', fontSize: 14 }}>&rarr;</span>
        </div>
      </div>
    </motion.div>
  );
};

export const PolicyIndex = ({ policies, onSelect }) => {
  const mobile = useIsMobile();

  return (
    <div style={{ fontFamily: C.sans, background: C.bg, color: C.ink, minHeight: '100vh', WebkitFontSmoothing: 'antialiased', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 960, width: '100%', padding: mobile ? '32px 20px' : '48px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : (policies.length + 1) <= 2 ? '1fr' : 'repeat(2, 1fr)',
          gap: mobile ? 20 : 24,
        }}>
          {policies.filter(p => p.data).map((entry, i) => (
            <PolicyCard key={entry.slug} entry={entry} index={i} onSelect={onSelect} />
          ))}
          <CreateCard index={policies.filter(p => p.data).length} onSelect={onSelect} style={{ gridColumn: '1 / -1' }} />
        </div>
      </div>
    </div>
  );
};
