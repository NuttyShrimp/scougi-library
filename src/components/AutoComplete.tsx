'use client'
import React, { memo, useRef, useState } from "react";

type Props = {
  label: string;
  items: string[];
  value: string;
  onChange: (val: string) => void;
  name?: string;
};

//we are using dropdown, input and menu component from daisyui
const Autocomplete = (props: Props) => {
  const { label, items, value, onChange } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`dropdown not-prose ${open ? "dropdown-open" : ""}`}
      ref={ref}
    >
      {label && <div className="label">
        <span className="label-text">{label}</span>
      </div>}
      <input
        name={props.name}
        type="text"
        className="input input-bordered"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type something.."
        tabIndex={0}
      />
      {/* add this part */}
      <div className={`dropdown-content bg-base-200 top-${label ? '22' : '14'} max-h-96 overflow-auto flex-col rounded-md`}>
        <ul
          className="menu menu-compact "
          // use ref to calculate the width of parent
          style={{ width: ref.current?.clientWidth }}
        >
          {items.map((item, index) => {
            return (
              <li
                key={index}
                tabIndex={index + 1}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
              >
                <button type="button">{item}</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default memo(Autocomplete);
