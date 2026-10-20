'use client';

import React from 'react';

interface OptionItemProps {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function OptionItem({
  label,
  text,
  isSelected,
  onSelect,
  disabled,
}: OptionItemProps) {
  if (!text) return null;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`group w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 select-none ${
        isSelected
          ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg ring-2 ring-amber-500/40'
          : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800/90 hover:border-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition shrink-0 ${
          isSelected
            ? 'bg-amber-500 text-slate-950 shadow-md'
            : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
        }`}
      >
        {label}
      </div>
      <div className="flex-1 text-base sm:text-lg font-medium leading-relaxed">
        {text}
      </div>
    </button>
  );
}
