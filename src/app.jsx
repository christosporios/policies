import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { policies, getPolicy } from './lib/policies';
import { PolicyIndex } from './components/policy-index';
import { PolicyViewer } from './components/policy-viewer';
import { CreatePage } from './components/create-page';

function slugFromPath() {
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  return path || null;
}

export default function App() {
  const [activeSlug, setActiveSlug] = useState(slugFromPath);
  const [previewEntry, setPreviewEntry] = useState(null);

  useEffect(() => {
    const onPop = () => setActiveSlug(slugFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((slug) => {
    if (slug) {
      window.history.pushState(null, '', `/${slug}`);
    } else {
      window.history.pushState(null, '', '/');
      window.scrollTo(0, 0);
    }
    setActiveSlug(slug);
  }, []);

  const activePolicy = activeSlug && activeSlug !== 'create' && activeSlug !== 'preview' ? getPolicy(activeSlug) : null;
  const validPolicies = policies.filter(p => p.data);

  if (!activeSlug && validPolicies.length === 1) {
    return <PolicyViewer key={validPolicies[0].slug} policyEntry={validPolicies[0]} />;
  }

  const isCreate = activeSlug === 'create';

  if (activeSlug === 'preview' && previewEntry) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{
            background: '#1a1917', color: 'rgba(247,246,244,0.6)',
            padding: '10px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(247,246,244,0.1)',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            <span style={{ fontSize: 14 }}>&#9888;</span>
            This is a local preview — this URL can't be shared
          </div>
          <PolicyViewer policyEntry={previewEntry} onBack={() => navigate('create')} />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isCreate) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="create"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <CreatePage
            onBack={() => navigate(null)}
            onPreview={(entry) => {
              setPreviewEntry(entry);
              navigate('preview');
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="popLayout">
        {activePolicy ? (
          <motion.div
            key={activeSlug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <PolicyViewer
              policyEntry={activePolicy}
              onBack={() => navigate(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="index"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 0.97 }}
            transition={{ duration: 0.5 }}
          >
            <PolicyIndex
              policies={validPolicies}
              onSelect={(slug) => navigate(slug)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
