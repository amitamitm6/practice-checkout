"use client";

import { useEffect, useRef, useState } from "react";

function flagUrl(iso2) {
  return `https://flagcdn.com/24x18/${iso2}.png`;
}

/**
 * Custom flag dropdown. Native <select><option> can't render flag images,
 * so this renders a styled button + list, backed by a hidden native <select>
 * (aria-hidden, invisible, covering the button) purely so HTML5 `required`
 * validation still fires and focuses the right spot on submit.
 */
export default function FlagDropdown({
  id,
  name,
  options,
  value,
  onChange,
  mode, // "dial" | "country"
  placeholder,
  required,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
    if (!open) setQuery("");
  }, [open]);

  const selected = options.find((o) => o.iso2 === value);
  const filtered = query
    ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
    : options;

  function selectOption(iso2) {
    onChange(iso2);
    setOpen(false);
  }

  return (
    <div className="flagDropdown" ref={wrapRef}>
      <button
        type="button"
        id={id}
        className="flagDropdown-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <>
            <img
              src={flagUrl(selected.iso2)}
              alt=""
              width={24}
              height={18}
              className="flagDropdown-flag"
            />
            <span>{mode === "dial" ? selected.dial : selected.name}</span>
          </>
        ) : (
          <span className="flagDropdown-placeholder">{placeholder}</span>
        )}
        <span className="flagDropdown-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      <select
        aria-hidden="true"
        tabIndex={-1}
        className="flagDropdown-hiddenSelect"
        name={name}
        required={required}
        value={value}
        onChange={() => {}}
      >
        <option value="" />
        {options.map((o) => (
          <option key={o.iso2} value={o.iso2}>
            {o.name}
          </option>
        ))}
      </select>

      {open && (
        <div className="flagDropdown-panel" role="listbox">
          <input
            ref={searchRef}
            type="text"
            className="flagDropdown-search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="flagDropdown-list">
            {filtered.map((o) => (
              <li key={o.iso2}>
                <button
                  type="button"
                  className="flagDropdown-option"
                  role="option"
                  aria-selected={o.iso2 === value}
                  onClick={() => selectOption(o.iso2)}
                >
                  <img
                    src={flagUrl(o.iso2)}
                    alt=""
                    width={24}
                    height={18}
                    className="flagDropdown-flag"
                  />
                  <span>{o.name}</span>
                  {mode === "dial" && (
                    <span className="flagDropdown-dial">{o.dial}</span>
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="flagDropdown-empty">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
