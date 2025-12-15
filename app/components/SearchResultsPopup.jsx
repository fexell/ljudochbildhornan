import React, {useEffect, useRef} from 'react';
import { SearchResultsPredictive } from './SearchResultsPredictive';

// Top-level component — safe to use hooks here
export function SearchResultsPopup({
  items,
  total,
  term,
  state,
  closeSearch,
  queriesDatalistId,
}) {
  const popupRef = useRef(null);

  // Only attach listeners while popup should be open
  useEffect(() => {
    if (!total || !term?.current) return;

    function handleDocMouseDown(e) {
      // click outside popup -> close
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        closeSearch();
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') closeSearch();
    }

    document.addEventListener('mousedown', handleDocMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSearch]);

  // Loading / empty handled by caller or here:
  if (state === 'loading' && term?.current) {
    return <div className="mt-4">Loading...</div>;
  }
  if (!total) {
    return <SearchResultsPredictive.Empty term={term} />;
  }

  const {articles, products, queries} = items || {};

  return (
    <div className="fixed inset-0 z-40 pointer-events-auto">
      {/* Overlay: clickable area to close */}
      <button
        type="button"
        onClick={closeSearch}
        aria-label="Close search overlay"
        className="absolute inset-0 bg-neutral-900/50"
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className="absolute max-w-5xl left-0 right-0 mx-auto mt-12 p-4 rounded-2xl bg-neutral-50 z-50 shadow-xl"
      >
        <SearchResultsPredictive.Queries
          queries={queries}
          queriesDatalistId={queriesDatalistId}
        />
        <SearchResultsPredictive.Products
          products={products}
          closeSearch={closeSearch}
          term={term}
        />
        <SearchResultsPredictive.Articles
          articles={articles}
          closeSearch={closeSearch}
          term={term}
        />
      </div>
    </div>
  );
}
