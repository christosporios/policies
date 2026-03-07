import { C } from '../lib/theme';
import { fmtRange, budgetTotals } from '../lib/format';
import { resolveTokens } from '../lib/tokens';
import { Note } from './note';

export const BudgetTable = ({ items, notes, ctx }) => {
  const oneTime = items.filter(i => i.type === 'one_time');
  const annual = items.filter(i => i.type === 'annual' || i.type === 'annual_credit');
  const { setupLow, setupHigh, annualLow, annualHigh } = budgetTotals(items);

  const Row = ({ item }) => (
    <tr style={{ borderBottom: `1px solid ${C.rule}` }}>
      <td style={{ padding: '11px 0', color: C.mid, fontSize: 13 }}>{item.label}</td>
      <td style={{ padding: '11px 0 11px 20px', fontFamily: C.mono, fontSize: 12.5, color: C.mid, whiteSpace: 'nowrap' }}>
        {item.type === 'annual_credit'
          ? `−${fmtRange(Math.abs(item.high), Math.abs(item.low))}`
          : fmtRange(item.low, item.high)}
      </td>
    </tr>
  );
  const TotalRow = ({ label, low, high }) => (
    <tr>
      <td style={{ padding: '12px 0 11px', fontWeight: 500, color: C.ink, fontSize: 13, borderTop: `1.5px solid ${C.ink}` }}>{label}</td>
      <td style={{ padding: '12px 0 11px 20px', fontFamily: C.mono, fontSize: 12.5, fontWeight: 500, color: C.ink, whiteSpace: 'nowrap', borderTop: `1.5px solid ${C.ink}` }}>~{fmtRange(low, high)}</td>
    </tr>
  );
  const thStyle = { fontFamily: C.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.faint, textAlign: 'left', paddingBottom: 10, fontWeight: 400, borderBottom: `1.5px solid ${C.ink}` };

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', fontSize: 13, minWidth: 320 }}>
        <thead>
          <tr><th style={thStyle}>Item</th><th style={{ ...thStyle, paddingLeft: 20 }}>Cost</th></tr>
        </thead>
        <tbody>
          {oneTime.map(item => <Row key={item.id} item={item} />)}
          {setupLow > 0 && <TotalRow label="Total setup" low={setupLow} high={setupHigh} />}
          {annual.map(item => <Row key={item.id} item={item} />)}
          {annualLow > 0 && <TotalRow label="Net annual cost" low={annualLow} high={annualHigh} />}
        </tbody>
      </table>
      {notes?.map((note, i) => <Note key={i}>{resolveTokens(note.replace(/\n/g, ' '), ctx)}</Note>)}
    </div>
  );
};
