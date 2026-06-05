import { useState, useEffect, useRef } from 'react';

const LocationAutocomplete = ({
  value = '',
  onChange,
  name,
  placeholder = 'Location',
  required = false,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = inputValue.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&countrycodes=in&format=json&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSuggestions(data || []);
        setIsOpen(data?.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange({ target: { name, value: e.target.value } });
  };

  const handleSelect = (suggestion) => {
    setInputValue(suggestion.display_name);
    setIsOpen(false);
    onChange({ target: { name, value: suggestion.display_name } });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className={className || undefined}
        autoComplete="off"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-[#136040] rounded-full animate-spin" />
        </div>
      )}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className="px-4 py-2.5 text-[13px] text-[#111827] cursor-pointer hover:bg-[#f5f7f6] border-b border-gray-100 last:border-b-0 transition-colors"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
