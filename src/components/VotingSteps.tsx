import React from 'react';
import { Fighter, WinMethod } from '../types';

interface VotingStepsProps {
  currentStep: number;
  selectedFighter?: Fighter;
  selectedRound?: number;
  selectedMethod?: WinMethod;
  onSelectRound: (round: number) => void;
  onSelectMethod: (method: WinMethod) => void;
}

const WIN_METHODS: { value: WinMethod; label: string }[] = [
  { value: 'KO', label: 'Knockout (KO)' },
  { value: 'TKO', label: 'Technical Knockout (TKO)' },
  { value: 'UD', label: 'Unanimous Decision (UD)' },
  { value: 'SD', label: 'Split Decision (SD)' },
  { value: 'MD', label: 'Majority Decision (MD)' },
  { value: 'Draw', label: 'Draw' },
  { value: 'DQ', label: 'Disqualification (DQ)' },
  { value: 'NC', label: 'No Contest (NC)' }
];

export function VotingSteps({ 
  currentStep,
  selectedFighter,
  selectedRound,
  selectedMethod,
  onSelectRound,
  onSelectMethod
}: VotingStepsProps) {
  if (currentStep !== 2 && currentStep !== 3) return null;

  if (currentStep === 2) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Which round will {selectedFighter === 'tyson' ? 'Tyson' : 'Paul'} win?</h2>
        <select
          value={selectedRound || ''}
          onChange={(e) => onSelectRound(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select round...</option>
          {Array.from({ length: 8 }, (_, i) => i + 1).map((round) => (
            <option key={round} value={round}>
              Round {round}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">How will they win?</h2>
      <select
        value={selectedMethod || ''}
        onChange={(e) => onSelectMethod(e.target.value as WinMethod)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select method...</option>
        {WIN_METHODS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}