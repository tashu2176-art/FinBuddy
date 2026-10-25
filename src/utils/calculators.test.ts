import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  calculateBudgetPlan,
  calculateSavingsGoal,
  calculateCompoundInterest,
  calculateDebtReduction,
  calculateLoanEmi,
  calculateInflationImpact,
} from './calculators';

test('formatINR formats Indian numbering system with rupee symbol', () => {
  assert.equal(formatINR(30000), '₹30,000');
  assert.equal(formatINR(150000), '₹1,50,000');
});

test('calculateBudgetPlan computes 50/30/20 split and validates percentages', () => {
  const res = calculateBudgetPlan({
    monthlyIncome: 30000,
    needsPercent: 50,
    wantsPercent: 30,
    savingsPercent: 20,
    existingEmergencyFund: 15000,
  });
  assert.equal(res.valid, true);
  assert.equal(res.data?.needsAmount, 15000);
  assert.equal(res.data?.wantsAmount, 9000);
  assert.equal(res.data?.savingsAmount, 6000);
  assert.equal(res.data?.emergencyFundTargetMin, 45000);
  assert.equal(res.data?.emergencyFundGap, 30000);
  assert.equal(res.data?.monthsToEmergencyFund, 5);

  const invalidPct = calculateBudgetPlan({
    monthlyIncome: 30000,
    needsPercent: 60,
    wantsPercent: 30,
    savingsPercent: 20,
    existingEmergencyFund: 0,
  });
  assert.equal(invalidPct.valid, false);
});

test('calculateSavingsGoal computes required monthly saving and rejects invalid input', () => {
  const res = calculateSavingsGoal({
    targetAmount: 120000,
    currentSavings: 0,
    years: 1,
    expectedAnnualReturn: 0,
  });
  assert.equal(res.valid, true);
  assert.equal(res.data?.requiredMonthlySaving, 10000);

  const invalid = calculateSavingsGoal({
    targetAmount: -500,
    currentSavings: 0,
    years: 2,
    expectedAnnualReturn: 8,
  });
  assert.equal(invalid.valid, false);
});

test('calculateCompoundInterest computes compounding growth above simple interest', () => {
  const res = calculateCompoundInterest({
    initialPrincipal: 100000,
    monthlyContribution: 5000,
    annualRatePercent: 12,
    years: 10,
    compoundingFrequency: 12,
  });
  assert.equal(res.valid, true);
  assert.equal(res.data?.totalInvested, 700000);
  assert.ok((res.data?.maturityValue ?? 0) > 1400000);
  assert.ok((res.data?.compoundingAdvantage ?? 0) > 0);
  assert.equal(res.data?.yearlyBreakdown.length, 10);
});

test('calculateDebtReduction compares Avalanche and Snowball payoff methods', () => {
  const res = calculateDebtReduction(
    [
      { id: '1', name: 'Credit Card', balance: 45000, annualRatePercent: 36, minPayment: 2500 },
      { id: '2', name: 'Gadget EMI Loan', balance: 20000, annualRatePercent: 14, minPayment: 1500 },
      { id: '3', name: 'Personal Loan', balance: 80000, annualRatePercent: 16, minPayment: 3000 },
    ],
    4000
  );
  assert.equal(res.valid, true);
  assert.ok(res.data);
  assert.ok(res.data.avalanche.totalInterestPaid <= res.data.snowball.totalInterestPaid);
  assert.ok(res.data.avalanche.monthsToPayoff < res.data.minimumOnly.monthsToPayoff);
  assert.ok(res.data.interestSavedByAvalanche > 0);
});

test('calculateLoanEmi computes standard reducing-balance EMI accurately', () => {
  const res = calculateLoanEmi({
    principal: 500000,
    annualInterestRate: 10,
    tenureYears: 5,
  });
  assert.equal(res.valid, true);
  assert.equal(res.data?.monthlyEmi, 10624);
  assert.ok((res.data?.totalInterest ?? 0) > 130000);
});

test('calculateInflationImpact computes future cost and purchasing power erosion', () => {
  const res = calculateInflationImpact({
    currentCost: 50000,
    inflationRatePercent: 6,
    years: 10,
  });
  assert.equal(res.valid, true);
  assert.equal(res.data?.futureCost, 89542);
  assert.ok((res.data?.purchasingPowerOfCurrentMoney ?? 0) < 30000);
});

import { generateDemoTutorResponse } from './tutorEngine';

test('generateDemoTutorResponse provides illustrative ₹30,000 budget and adapts to emergency fund answer', () => {
  const firstTurn = generateDemoTutorResponse(
    'I earn ₹30,000 per month. How can I start saving?',
    [],
    { level: 'Beginner', goal: 'Start saving', simpleLanguage: false }
  );
  assert.ok(firstTurn.reply.includes('₹18,000'));
  assert.ok(firstTurn.reply.includes('₹6,000'));
  assert.ok(firstTurn.reply.toLowerCase().includes('emergency fund'));

  const secondTurn = generateDemoTutorResponse(
    'No, I do not have an emergency fund yet',
    [{ role: 'assistant', content: firstTurn.reply }],
    { level: 'Beginner', goal: 'Start saving', simpleLanguage: false }
  );
  assert.ok(secondTurn.reply.includes('₹54,000'));
});

import { TOPIC_MODULES, LESSONS } from '../data/curriculum';

test('curriculum excludes Banking & Digital Payments and Indian Financial Literacy modules', () => {
  const moduleIds = TOPIC_MODULES.map((m) => m.id as string);
  assert.equal(moduleIds.length, 4);
  assert.equal(moduleIds.includes('banking-digital'), false);
  assert.equal(moduleIds.includes('indian-financial-literacy'), false);

  for (const lesson of LESSONS) {
    assert.notEqual(lesson.topicId as string, 'banking-digital');
    assert.notEqual(lesson.topicId as string, 'indian-financial-literacy');
  }
});

test('generateDemoTutorResponse personalizes greeting and context with name, current level, topic, and difficulty preference', () => {
  const res = generateDemoTutorResponse(
    'I earn ₹30,000 per month. How can I start saving?',
    [],
    {
      learnerName: 'Aarav',
      currentLevel: 'Know the Basics',
      preferredTopic: 'Investing Fundamentals',
      level: 'Intermediate',
      goal: 'Start investing via SIPs',
      simpleLanguage: true,
    }
  );
  assert.ok(res.reply.includes('Aarav'));
});

import { calculateSpendingSummary } from './calculators';

test('calculateSpendingSummary categorizes daily expenses and computes monthly table totals', () => {
  const res = calculateSpendingSummary(
    [
      {
        id: '1',
        description: 'Monthly Room Rent',
        category: 'Rent & Housing',
        amount: 10000,
        dayLabel: 'Day 1',
        type: 'Need',
      },
      {
        id: '2',
        description: 'Groceries & Milk',
        category: 'Food & Groceries',
        amount: 4000,
        dayLabel: 'Day 5',
        type: 'Need',
      },
      {
        id: '3',
        description: 'Metro Recharge',
        category: 'Transport & Commute',
        amount: 1500,
        dayLabel: 'Day 8',
        type: 'Need',
      },
      {
        id: '4',
        description: 'Weekend Pizza',
        category: 'Food & Groceries',
        amount: 1000,
        dayLabel: 'Day 12',
        type: 'Want',
      },
    ],
    30000
  );

  assert.equal(res.valid, true);
  assert.equal(res.data?.totalSpent, 16500);
  assert.equal(res.data?.remainingBudget, 13500);
  assert.equal(res.data?.needsTotal, 15500);
  assert.equal(res.data?.wantsTotal, 1000);
  assert.equal(res.data?.categoryRows.length, 3);
  assert.equal(res.data?.highestCategory, 'Rent & Housing');
  const foodRow = res.data?.categoryRows.find((r) => r.category === 'Food & Groceries');
  assert.equal(foodRow?.totalAmount, 5000);
  assert.equal(foodRow?.count, 2);
});




