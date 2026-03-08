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

  const activePolicy = activeSlug && activeSlug !== 'create' ? getPolicy(activeSlug) : null;
  const validPolicies = policies.filter(p => p.data);

  if (!activeSlug && validPolicies.length === 1) {
    return <PolicyViewer key={validPolicies[0].slug} policyEntry={validPolicies[0]} />;
  }

  const isCreate = activeSlug === 'create';

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
          <CreatePage onBack={() => navigate(null)} />
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
