"use client";

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addMonths, addYears, addQuarters, isAfter, startOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function calculateNextBillingDate(referenceDate: string, frequency: 'monthly' | 'quarterly' | 'annually'): Date {
  const today = startOfDay(new Date());
  let nextDate = new Date(referenceDate);

  while (!isAfter(nextDate, today)) {
    switch (frequency) {
      case 'monthly':
        nextDate = addMonths(nextDate, 1);
        break;
      case 'quarterly':
        nextDate = addQuarters(nextDate, 1);
        break;
      case 'annually':
        nextDate = addYears(nextDate, 1);
        break;
    }
  }

  return nextDate;
}