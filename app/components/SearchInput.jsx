import {useState, useRef, useEffect} from 'react';
import {useFetcher} from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export function SearchInput({ classNames }) {
  const fetcher = useFetcher({key: 'search'});
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const popupRef = useRef(null);

  const results = fetcher.data?.result?.items?.products || [];

  useEffect(() => {
    function handleClickOutside(e) {
      if(
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  useEffect(() => {
    function handleEsc(e) {
      if(e.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [])

  function handleChange(e) {
    const term = e.target.value;

    if(term.length < 2) {
      setOpen(false);
      return;
    }

    fetcher.submit(
      {q: term, predictive: true},
      {method: 'GET', action: `${fetcher.data?.locale || ''}/search`}
    )

    setOpen(true);
  }

  return (
    <div
      className={`${classNames ?? ''} relative w-full h-full`}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <input
        ref={inputRef}
        type="text"
        name="search"
        placeholder="Sök produkter…"
        className="w-full border-0! p-3! pl-12! rounded-full! bg-white"
        onChange={handleChange}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
      />

      {open && (
        <div
          ref={popupRef}
          className="absolute z-50 w-full mt-2 bg-white border rounded shadow-lg p-2"
        >
          {results.length > 0 ? (
          results.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.handle}`}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
            >
              {product.selectedOrFirstAvailableVariant?.image && (
                <img
                  src={product.selectedOrFirstAvailableVariant.image.url}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <div className="font-medium">{product.title}</div>
                <div className="text-sm text-gray-500">{product.vendor}</div>
              </div>
            </a>
          ))
        ) : (
          <div>Inga sökresultat</div>
        )}
        </div>
      )}
    </div>
  )
}