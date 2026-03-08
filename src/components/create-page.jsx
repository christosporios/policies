import { motion } from 'framer-motion';
import { C } from '../lib/theme';
import { useIsMobile } from '../hooks/use-is-mobile';
import { policies } from '../lib/policies';

const Step = ({ number, title, children }) => (
  <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
    <div style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, flexShrink: 0, paddingTop: 2 }}>{String(number).padStart(2, '0')}</div>
    <div>
      <div style={{ fontFamily: C.serif, fontSize: 18, fontWeight: 600, marginBottom: 8, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 14.5, color: C.mid, lineHeight: 1.7 }}>{children}</div>
    </div>
  </div>
);

const Code = ({ children }) => (
  <code style={{ fontFamily: C.mono, fontSize: 12, background: C.hover, border: `1px solid ${C.rule}`, padding: '2px 6px', borderRadius: 3 }}>{children}</code>
);

const DownloadButton = ({ href, children }) => (
  <a
    href={href}
    download
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: C.mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: '#f7f6f4', background: C.ink, border: 'none', borderRadius: 4,
      padding: '10px 20px', cursor: 'pointer', textDecoration: 'none',
      transition: 'opacity 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
  >
    <span style={{ fontSize: 14 }}>↓</span> {children}
  </a>
);

export const CreatePage = ({ onBack }) => {
  const mobile = useIsMobile();
  const px = mobile ? 20 : 40;

  const policyEntries = policies.filter(p => p.data);

  return (
    <div style={{ fontFamily: C.sans, background: C.bg, color: C.ink, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <header style={{ background: C.ink, color: '#f7f6f4', padding: mobile ? '40px 0 36px' : '64px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px)', pointerEvents: 'none' }} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          style={{ maxWidth: 860, margin: '0 auto', padding: `0 ${px}px`, position: 'relative' }}
        >
          {onBack && (
            <span onClick={onBack} style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(247,246,244,0.4)', cursor: 'pointer', display: 'inline-block', marginBottom: 16 }}>
              &larr; All policies
            </span>
          )}
          <h1 style={{ fontFamily: C.serif, fontSize: mobile ? 28 : 'clamp(32px, 5vw, 50px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#f7f6f4', marginBottom: 0 }}>
            Create your own
          </h1>
          <div style={{ fontFamily: C.serif, fontSize: mobile ? 28 : 'clamp(32px, 5vw, 50px)', fontStyle: 'italic', fontWeight: 400, color: 'rgba(247,246,244,0.65)', lineHeight: 1.2, marginBottom: 6 }}>
            Build a structured policy proposal
          </div>
        </motion.div>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: mobile ? '40px 20px' : '56px 40px' }}>
        <p style={{ fontSize: 16, color: C.mid, lineHeight: 1.75, marginBottom: 48 }}>
          Each policy on this site is a single YAML file. You write the policy, drop the file in, and the site renders it — budgets, timelines, KPIs, references, and all.
        </p>

        <Step number={1} title="Research with Claude">
          <p>
            Open <a href="https://claude.ai" target="_blank" rel="noopener" style={{ color: C.ink, textDecoration: 'underline' }}>claude.ai</a> and
            start a conversation with <strong>Deep Research</strong> enabled. Describe the problem you want to solve, the jurisdiction,
            and any constraints. Claude will research the legal framework, find cost benchmarks, identify case studies, and gather
            the statistics you need.
          </p>
        </Step>

        <Step number={2} title="Add the skill file">
          <p style={{ marginBottom: 12 }}>
            A skill file teaches Claude the exact YAML schema and writing conventions for policy documents.
            Download it, then add it to a Claude project:
          </p>
          <ol style={{ paddingLeft: 20, marginBottom: 16, lineHeight: 2 }}>
            <li>On <a href="https://claude.ai" target="_blank" rel="noopener" style={{ color: C.ink, textDecoration: 'underline' }}>claude.ai</a>, click <strong>Projects</strong> in the left sidebar, then <strong>Create project</strong>.</li>
            <li>In your new project, find the <strong>Project knowledge</strong> panel on the right and click the <strong>+</strong> button.</li>
            <li>Upload the skill file you downloaded below. Claude will now use it across all chats in that project.</li>
          </ol>
          <DownloadButton href="/policy-skill.md">Download skill file</DownloadButton>
        </Step>

        <Step number={3} title="Generate the policy">
          <p>
            Ask Claude to write a <Code>.policy.yaml</Code> file for your reform. The skill file
            ensures it follows the schema — with sourced statistics, legal grounding, itemised budgets,
            measurable KPIs, and a realistic timeline.
          </p>
          <p style={{ marginTop: 8 }}>
            Review the output. Push Claude on weak citations, vague targets, or missing legal authority.
            The best policies are specific and honest about uncertainty.
          </p>
        </Step>

        <Step number={4} title="Publish">
          <p>
            Clone the <a href="https://github.com/christosporios/policies" target="_blank" rel="noopener" style={{ color: C.ink, textDecoration: 'underline' }}>repository</a>, drop
            your <Code>.policy.yaml</Code> file into the <Code>policies/</Code> folder,
            add a background image to <Code>public/</Code>, and run <Code>npm run dev</Code> to
            preview locally. Push your changes and open a pull request to publish.
          </p>
        </Step>

        <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 32, marginTop: 16 }}>
          <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.faint, marginBottom: 16 }}>Schema overview</div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            {[
              { label: 'meta', desc: 'Title, subtitle, scope, tagline, background image' },
              { label: 'measures[]', desc: 'Context, action, budget, and KPIs per measure' },
              { label: 'summary', desc: 'Aggregated setup + annual costs with breakdowns' },
              { label: 'timeline[]', desc: 'Month-by-month milestones' },
              { label: 'kpis', desc: 'Programme-wide indicators and reporting cadence' },
              { label: 'references[]', desc: 'Cited sources with title, author, year, URL' },
            ].map(({ label, desc }) => (
              <div key={label} style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 4, padding: '14px 18px' }}>
                <div style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 500, color: C.ink, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {policyEntries.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 32, marginTop: 32 }}>
            <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.faint, marginBottom: 16 }}>Example policies</div>
            <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.6, marginBottom: 16 }}>
              Download existing policies to use as a reference or starting point.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {policyEntries.map(entry => (
                <a
                  key={entry.slug}
                  href={URL.createObjectURL(new Blob([entry.raw], { type: 'text/yaml' }))}
                  download={`${entry.slug}.policy.yaml`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: C.mono, fontSize: 11, color: C.mid,
                    background: C.card, border: `1px solid ${C.rule}`, borderRadius: 4,
                    padding: '8px 16px', textDecoration: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.mid}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.rule}
                >
                  <span style={{ fontSize: 13 }}>↓</span> {entry.data.meta.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
