import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import yaml from 'js-yaml';
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

const DropZone = ({ onFile }) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const processText = useCallback((text) => {
    setError(null);
    try {
      const data = yaml.load(text);
      if (!data?.meta?.title) {
        setError('Missing meta.title — is this a valid .policy.yaml file?');
        return;
      }
      onFile({ slug: 'preview', raw: text, data, error: null });
    } catch (e) {
      setError(`YAML parse error: ${e.message}`);
    }
  }, [onFile]);

  const handleFile = useCallback((file) => {
    if (!file) return;
    file.text().then(processText);
  }, [processText]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
    else {
      const text = e.dataTransfer.getData('text');
      if (text) processText(text);
    }
  }, [handleFile, processText]);

  const onPaste = useCallback((e) => {
    const text = e.clipboardData.getData('text');
    if (text) processText(text);
  }, [processText]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onPaste={onPaste}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.yaml,.yml';
        input.onchange = (e) => handleFile(e.target.files[0]);
        input.click();
      }}
      style={{
        border: `1px dashed ${dragging ? C.mid : C.rule}`,
        borderRadius: 6,
        padding: '36px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? C.hover : 'transparent',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <div style={{ fontFamily: C.serif, fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 6 }}>
        Drop a .policy.yaml file here
      </div>
      <div style={{ fontSize: 13, color: C.faint }}>
        or click to browse, or paste YAML content
      </div>
      {error && (
        <div style={{ fontFamily: C.mono, fontSize: 12, color: '#c44', marginTop: 12 }}>{error}</div>
      )}
    </div>
  );
};

export const CreatePage = ({ onBack, onPreview }) => {
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
        <p style={{ fontSize: 16, color: C.mid, lineHeight: 1.75, marginBottom: 32 }}>
          Each policy on this site is a single YAML file. You write the policy, and the site renders it — budgets, timelines, KPIs, references, and all. Drop your file below to preview it instantly.
        </p>

        <div style={{ marginBottom: 48 }}>
          <DropZone onFile={onPreview} />
        </div>

        <Step number={1} title="Set up a Claude project">
          <p style={{ marginBottom: 12 }}>
            A skill file teaches Claude the exact YAML schema and writing conventions for policy documents.
            Download it and create a project on Claude:
          </p>
          <ol style={{ paddingLeft: 20, marginBottom: 16, lineHeight: 2 }}>
            <li>Download the skill file below.</li>
            <li>On <a href="https://claude.ai" target="_blank" rel="noopener" style={{ color: C.ink, textDecoration: 'underline' }}>claude.ai</a>, click <strong>Projects</strong> in the left sidebar, then <strong>Create project</strong>.</li>
            <li>In your new project, find the <strong>Project knowledge</strong> panel on the right and click the <strong>+</strong> button.</li>
            <li>Upload the skill file. Claude will now use it across all chats in that project.</li>
          </ol>
          <DownloadButton href="/policy-skill.md">Download skill file</DownloadButton>
        </Step>

        <Step number={2} title="Research">
          <p>
            Start a new chat in your project with <strong>Deep Research</strong> enabled. Describe the problem you want to solve, the jurisdiction,
            and any constraints. Claude will research the legal framework, find cost benchmarks, identify case studies, and gather
            the statistics you need.
          </p>
          <p style={{ marginTop: 8 }}>
            You can also start from an existing policy — download one from below, upload it to the chat, and ask Claude to
            deconstruct it critically: what works, what's weak, what's missing. Then iterate from there.
          </p>
        </Step>

        <Step number={3} title="Generate the policy">
          <p>
            Ask Claude to write a <Code>.policy.yaml</Code> file for your reform. The skill file
            ensures it follows the schema — with sourced statistics, legal grounding, itemised budgets,
            measurable KPIs, and a realistic timeline.
          </p>
          <p style={{ marginTop: 8 }}>
            Review the output. Push Claude on weak citations, vague targets, or missing legal authority.
            The best policies are specific and honest about uncertainty. Drop the file above to preview how it will look.
          </p>
        </Step>

        <Step number={4} title="Preview and publish">
          <p>
            Drop your <Code>.policy.yaml</Code> file into the upload area above to see a full preview
            of how your policy will look — budgets, timelines, KPIs, and all. The preview is local to your
            browser and can't be shared.
          </p>
          <p style={{ marginTop: 8 }}>
            When you're happy with it, clone the <a href="https://github.com/christosporios/policies" target="_blank" rel="noopener" style={{ color: C.ink, textDecoration: 'underline' }}>repository</a>,
            add your file to the <Code>policies/</Code> folder along with a background image
            in <Code>public/</Code>, and open a pull request to publish it on the site.
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
