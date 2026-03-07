import { useState } from 'react';
import { C } from './theme';

const LegalCitation = ({ citation, relevance }) => {
  const [showTip, setShowTip] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span
        title={relevance}
        onClick={(e) => { e.stopPropagation(); setShowTip(prev => !prev); }}
        style={{ borderBottom: `1px dotted currentColor`, opacity: 0.7, cursor: 'help' }}
      >{citation}</span>
      {showTip && (
        <span style={{
          position: 'absolute', bottom: '100%', left: 0, zIndex: 10,
          background: C.ink, color: '#f7f6f4', fontSize: 12, lineHeight: 1.5,
          padding: '8px 12px', borderRadius: 4, maxWidth: 280, minWidth: 180,
          marginBottom: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>{relevance}</span>
      )}
    </span>
  );
};

export function resolveTokens(text, { stats = [], legal = [], refs = [], refIndex, onRefClick = () => {} }) {
  if (!text) return [];
  const statMap = Object.fromEntries((stats || []).map(s => [s.id, s]));
  const legalMap = Object.fromEntries((legal || []).map(l => [l.id, l]));

  const parts = text.split(/({{(?:stat|legal|ref):[^}]+}})/g);
  return parts.map((part, i) => {
    const statMatch = part.match(/^{{stat:(.+)}}$/);
    const legalMatch = part.match(/^{{legal:(.+)}}$/);
    const refMatch = part.match(/^{{ref:(.+)}}$/);

    if (statMatch) {
      const s = statMap[statMatch[1]];
      if (!s) return part;
      const n = refIndex.getOrAdd(s.source?.match(/{{ref:(.+)}}/)?.[1]);
      return <strong key={i} title={s.label} style={{ fontWeight: 600, color: 'inherit' }}>{s.value}{n && <a href={`#ref-${n}`} onClick={onRefClick} style={{ fontFamily: C.mono, fontSize: 9, color: 'inherit', opacity: 0.5, marginLeft: 1, textDecoration: 'none', padding: '8px 6px', margin: '-8px -4px' }}>[{n}]</a>}</strong>;
    }
    if (legalMatch) {
      const l = legalMap[legalMatch[1]];
      if (!l) return part;
      return <LegalCitation key={i} citation={l.citation} relevance={l.relevance} />;
    }
    if (refMatch) {
      const n = refIndex.getOrAdd(refMatch[1]);
      return n ? <a key={i} href={`#ref-${n}`} onClick={onRefClick} style={{ fontFamily: C.mono, fontSize: 9, color: 'inherit', opacity: 0.5, marginLeft: 1, textDecoration: 'none', verticalAlign: 'super', padding: '8px 6px', margin: '-8px -4px' }}>[{n}]</a> : null;
    }
    return part;
  });
}

export function resolveBody(body, ctx) {
  if (!body) return null;
  return body.trim().split(/\n\n+/).map((para, i) => (
    <p key={i} style={{ marginBottom: 16, fontSize: 14.5, color: C.mid, lineHeight: 1.8 }}>
      {resolveTokens(para.replace(/\n/g, ' '), ctx)}
    </p>
  ));
}
