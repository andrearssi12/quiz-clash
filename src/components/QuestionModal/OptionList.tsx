'use client';

import React from 'react';
import { OptionItem } from './OptionItem';
import { Question } from '@/types';

interface OptionListProps {
  question: Question;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  disabled?: boolean;
}

export function OptionList({
  question,
  selectedOption,
  onSelectOption,
  disabled,
}: OptionListProps) {
  const options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[] = [
    { label: 'A', text: question.option_a },
    { label: 'B', text: question.option_b },
    { label: 'C', text: question.option_c },
    { label: 'D', text: question.option_d },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-2">
      {options.map((opt) => (
        <OptionItem
          key={opt.label}
          label={opt.label}
          text={opt.text}
          isSelected={selectedOption === opt.label}
          onSelect={() => onSelectOption(opt.label)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
