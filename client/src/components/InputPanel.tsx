import { useState, type FormEvent } from 'react';
import type { BusinessType, Priority } from '../lib/types';

interface InputPanelProps {
  onSubmit: (address: string, businessType: BusinessType, priorities: Priority[]) => void;
  isLoading: boolean;
}

const BUSINESS_TYPES: Array<{ value: BusinessType; label: string; icon: string }> = [
  { value: 'coffee_shop', label: 'Coffee Shop', icon: '☕' },
  { value: 'clinic', label: 'Medical Clinic', icon: '🏥' },
  { value: 'gym', label: 'Fitness Center', icon: '💪' },
  { value: 'grocery', label: 'Grocery Store', icon: '🛒' },
];

const PRIORITIES: Array<{ value: Priority; label: string }> = [
  { value: 'high_foot_traffic', label: 'High Foot Traffic' },
  { value: 'low_competition', label: 'Low Competition' },
  { value: 'family_area', label: 'Family-Heavy Area' },
  { value: 'premium_demographic', label: 'Premium Demographics' },
  { value: 'accessibility', label: 'Strong Accessibility' },
];

export default function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('coffee_shop');
  const [priorities, setPriorities] = useState<Priority[]>([]);

  const togglePriority = (p: Priority) =>
    setPriorities((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    onSubmit(address.trim(), businessType, priorities);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-200">Business Address</label>
          <p className="mt-0.5 text-xs text-gray-500">Enter the address you want to evaluate</p>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 350 5th Ave, New York, NY"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-gray-100 placeholder-gray-600 focus:border-blue-500 focus:bg-white/8 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200">Business Type</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {BUSINESS_TYPES.map((bt) => (
              <button
                key={bt.value}
                type="button"
                onClick={() => setBusinessType(bt.value)}
                disabled={isLoading}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                  businessType === bt.value
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300 ring-1 ring-blue-500'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <span>{bt.icon}</span>
                {bt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200">
            Priorities <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">Boost weight on factors that matter most</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => togglePriority(p.value)}
                disabled={isLoading}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  priorities.includes(p.value)
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing location...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Evaluate This Location
            </>
          )}
        </button>
      </div>
    </form>
  );
}
