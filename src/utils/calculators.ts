export interface ValidationResult<T> {
  valid: boolean;
  error?: string;
  data?: T;
}

export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const abs = Math.abs(rounded);
  const formatted = abs.toLocaleString('en-IN');
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatCompactINR(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

// 1. 50/30/20 & Custom Budget Planner
export interface BudgetInput {
  monthlyIncome: number;
  needsPercent: number;
  wantsPercent: number;
  savingsPercent: number;
  existingEmergencyFund: number;
}

export interface BudgetOutput {
  needsAmount: number;
  wantsAmount: number;
  savingsAmount: number;
  annualSavingsProjection: number;
  emergencyFundTargetMin: number; // 3x monthly needs
  emergencyFundTargetMax: number; // 6x monthly needs
  emergencyFundGap: number;
  monthsToEmergencyFund: number | null;
  insight: string;
}

export function calculateBudgetPlan(input: BudgetInput): ValidationResult<BudgetOutput> {
  if (!Number.isFinite(input.monthlyIncome) || input.monthlyIncome <= 0) {
    return { valid: false, error: 'Please enter a valid monthly income greater than ₹0.' };
  }
  if (input.monthlyIncome > 10_00_00_000) {
    return { valid: false, error: 'Monthly income exceeds the calculator maximum (₹10 Crore).' };
  }
  if (
    input.needsPercent < 0 ||
    input.wantsPercent < 0 ||
    input.savingsPercent < 0 ||
    !Number.isFinite(input.needsPercent) ||
    !Number.isFinite(input.wantsPercent) ||
    !Number.isFinite(input.savingsPercent)
  ) {
    return { valid: false, error: 'Allocation percentages cannot be negative.' };
  }
  const totalPct = Math.round((input.needsPercent + input.wantsPercent + input.savingsPercent) * 10) / 10;
  if (Math.abs(totalPct - 100) > 0.1) {
    return {
      valid: false,
      error: `Needs (${input.needsPercent}%) + Wants (${input.wantsPercent}%) + Savings (${input.savingsPercent}%) must equal 100% (currently ${totalPct}%).`,
    };
  }
  if (input.existingEmergencyFund < 0 || !Number.isFinite(input.existingEmergencyFund)) {
    return { valid: false, error: 'Existing emergency fund cannot be negative.' };
  }

  const needsAmount = Math.round((input.monthlyIncome * input.needsPercent) / 100);
  const wantsAmount = Math.round((input.monthlyIncome * input.wantsPercent) / 100);
  const savingsAmount = Math.round((input.monthlyIncome * input.savingsPercent) / 100);
  const annualSavingsProjection = savingsAmount * 12;

  const emergencyFundTargetMin = needsAmount * 3;
  const emergencyFundTargetMax = needsAmount * 6;
  const emergencyFundGap = Math.max(0, emergencyFundTargetMin - input.existingEmergencyFund);
  const monthsToEmergencyFund =
    emergencyFundGap === 0
      ? 0
      : savingsAmount > 0
      ? Math.ceil(emergencyFundGap / savingsAmount)
      : null;

  let insight = 'Balanced 50/30/20 allocation. Automate your savings on salary day before spending.';
  if (input.savingsPercent < 15) {
    insight = 'Your savings rate is below 15%. Consider trimming discretionary wants by 5% to build a stronger safety net.';
  } else if (input.needsPercent > 65) {
    insight = 'Essential expenses take over 65% of your income—common in high-rent metro cities. Focus on keeping lifestyle wants lean while your income grows.';
  } else if (input.savingsPercent >= 25) {
    insight = 'Strong savings discipline! Once your 6-month emergency fund is ready, channel surplus into diversified long-term investments.';
  }

  return {
    valid: true,
    data: {
      needsAmount,
      wantsAmount,
      savingsAmount,
      annualSavingsProjection,
      emergencyFundTargetMin,
      emergencyFundTargetMax,
      emergencyFundGap,
      monthsToEmergencyFund,
      insight,
    },
  };
}

// 2. Savings Goal Calculator
export interface SavingsGoalInput {
  targetAmount: number;
  currentSavings: number;
  years: number;
  expectedAnnualReturn: number; // % p.a.
}

export interface SavingsGoalOutput {
  requiredMonthlySaving: number;
  totalPrincipalContributed: number;
  futureValueOfCurrentSavings: number;
  estimatedReturnsEarned: number;
  targetAmount: number;
}

export function calculateSavingsGoal(input: SavingsGoalInput): ValidationResult<SavingsGoalOutput> {
  if (!Number.isFinite(input.targetAmount) || input.targetAmount <= 0) {
    return { valid: false, error: 'Target goal amount must be greater than ₹0.' };
  }
  if (!Number.isFinite(input.currentSavings) || input.currentSavings < 0) {
    return { valid: false, error: 'Current savings cannot be negative.' };
  }
  if (!Number.isFinite(input.years) || input.years <= 0 || input.years > 60) {
    return { valid: false, error: 'Time horizon must be between 1 and 60 years.' };
  }
  if (!Number.isFinite(input.expectedAnnualReturn) || input.expectedAnnualReturn < 0 || input.expectedAnnualReturn > 30) {
    return { valid: false, error: 'Expected annual return must be between 0% and 30%.' };
  }

  const months = Math.round(input.years * 12);
  const monthlyRate = input.expectedAnnualReturn / 100 / 12;

  const futureValueOfCurrentSavings =
    monthlyRate === 0
      ? input.currentSavings
      : input.currentSavings * Math.pow(1 + monthlyRate, months);

  const remainingTarget = Math.max(0, input.targetAmount - futureValueOfCurrentSavings);

  let requiredMonthlySaving = 0;
  if (remainingTarget > 0) {
    if (monthlyRate === 0) {
      requiredMonthlySaving = remainingTarget / months;
    } else {
      // Ordinary annuity / SIP formula: FV = P * [((1+r)^n - 1) / r] * (1+r)
      const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      requiredMonthlySaving = remainingTarget / factor;
    }
  }

  const roundedMonthly = Math.ceil(requiredMonthlySaving);
  const totalMonthlyContributions = roundedMonthly * months;
  const totalPrincipalContributed = input.currentSavings + totalMonthlyContributions;
  const estimatedReturnsEarned = Math.max(0, Math.round(input.targetAmount - totalPrincipalContributed));

  return {
    valid: true,
    data: {
      requiredMonthlySaving: roundedMonthly,
      totalPrincipalContributed: Math.round(totalPrincipalContributed),
      futureValueOfCurrentSavings: Math.round(futureValueOfCurrentSavings),
      estimatedReturnsEarned,
      targetAmount: Math.round(input.targetAmount),
    },
  };
}

// 3. Compound Interest & SIP Calculator
export interface CompoundInterestInput {
  initialPrincipal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
  compoundingFrequency: 1 | 4 | 12; // 1 = yearly, 4 = quarterly, 12 = monthly
}

export interface YearlyGrowthRow {
  year: number;
  totalInvested: number;
  interestEarned: number;
  endingBalance: number;
}

export interface CompoundInterestOutput {
  totalInvested: number;
  totalInterest: number;
  maturityValue: number;
  simpleInterestComparison: number;
  compoundingAdvantage: number;
  yearlyBreakdown: YearlyGrowthRow[];
}

export function calculateCompoundInterest(
  input: CompoundInterestInput
): ValidationResult<CompoundInterestOutput> {
  if (!Number.isFinite(input.initialPrincipal) || input.initialPrincipal < 0) {
    return { valid: false, error: 'Initial lump sum cannot be negative.' };
  }
  if (!Number.isFinite(input.monthlyContribution) || input.monthlyContribution < 0) {
    return { valid: false, error: 'Monthly contribution (SIP) cannot be negative.' };
  }
  if (input.initialPrincipal === 0 && input.monthlyContribution === 0) {
    return { valid: false, error: 'Please enter either an initial principal or a monthly SIP contribution greater than ₹0.' };
  }
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0 || input.annualRatePercent > 35) {
    return { valid: false, error: 'Annual interest/return rate must be between 0% and 35%.' };
  }
  if (!Number.isFinite(input.years) || input.years < 1 || input.years > 50) {
    return { valid: false, error: 'Investment duration must be between 1 and 50 years.' };
  }

  const r = input.annualRatePercent / 100;
  const n = input.compoundingFrequency;
  const monthlyEffectiveRate = r === 0 ? 0 : Math.pow(1 + r / n, n / 12) - 1;

  const yearlyBreakdown: YearlyGrowthRow[] = [];
  let balance = input.initialPrincipal;
  let invested = input.initialPrincipal;

  const totalYears = Math.floor(input.years);
  for (let y = 1; y <= totalYears; y++) {
    for (let m = 1; m <= 12; m++) {
      balance = (balance + input.monthlyContribution) * (1 + monthlyEffectiveRate);
      invested += input.monthlyContribution;
    }
    yearlyBreakdown.push({
      year: y,
      totalInvested: Math.round(invested),
      interestEarned: Math.round(balance - invested),
      endingBalance: Math.round(balance),
    });
  }

  const maturityValue = Math.round(balance);
  const totalInvested = Math.round(invested);
  const totalInterest = Math.max(0, maturityValue - totalInvested);

  // Simple interest comparison on principal + linear average of monthly contributions
  const simpleOnPrincipal = input.initialPrincipal * r * totalYears;
  const simpleOnMonthly =
    input.monthlyContribution * 12 * totalYears * r * ((totalYears * 12 + 1) / (2 * 12));
  const simpleInterestComparison = Math.round(totalInvested + simpleOnPrincipal + simpleOnMonthly);
  const compoundingAdvantage = Math.max(0, maturityValue - simpleInterestComparison);

  return {
    valid: true,
    data: {
      totalInvested,
      totalInterest,
      maturityValue,
      simpleInterestComparison,
      compoundingAdvantage,
      yearlyBreakdown,
    },
  };
}

// 4. Debt Reduction Scenarios Calculator (Snowball vs Avalanche)
export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  annualRatePercent: number;
  minPayment: number;
}

export interface DebtStrategySummary {
  strategyName: 'Avalanche (Highest Interest First)' | 'Snowball (Smallest Balance First)' | 'Minimum Payments Only';
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  payoffOrder: string[];
}

export interface DebtReductionOutput {
  avalanche: DebtStrategySummary;
  snowball: DebtStrategySummary;
  minimumOnly: DebtStrategySummary;
  interestSavedByAvalanche: number;
  monthsSavedByAvalanche: number;
  recommendation: string;
}

function simulateDebtPayoff(
  debts: DebtItem[],
  extraMonthlyBudget: number,
  strategy: 'avalanche' | 'snowball' | 'minimum'
): DebtStrategySummary {
  const active = debts.map((d) => ({ ...d, currentBalance: d.balance }));
  const payoffOrder: string[] = [];
  let months = 0;
  let totalInterestPaid = 0;
  const maxMonths = 600; // 50-year cap

  while (active.some((d) => d.currentBalance > 0.5) && months < maxMonths) {
    months++;
    let availableExtra = strategy === 'minimum' ? 0 : extraMonthlyBudget;

    // 1. Accrue monthly interest and pay minimum on each debt
    for (const debt of active) {
      if (debt.currentBalance <= 0.5) continue;
      const monthlyInterest = debt.currentBalance * (debt.annualRatePercent / 100 / 12);
      totalInterestPaid += monthlyInterest;
      debt.currentBalance += monthlyInterest;

      const payment = Math.min(debt.currentBalance, debt.minPayment);
      debt.currentBalance -= payment;

      // If debt was smaller than its minimum payment, roll leftover minimum into extra pool (for snowball/avalanche)
      if (strategy !== 'minimum' && debt.minPayment > payment) {
        availableExtra += debt.minPayment - payment;
      }

      if (debt.currentBalance <= 0.5 && !payoffOrder.includes(debt.name)) {
        debt.currentBalance = 0;
        payoffOrder.push(debt.name);
      }
    }

    // Also add minimum payments of already paid-off debts to the snowball/avalanche pool
    if (strategy !== 'minimum') {
      for (const debt of active) {
        if (debt.currentBalance === 0 && payoffOrder.includes(debt.name)) {
          // Wait: only add minPayment if it wasn't paid this month
        }
      }
    }

    // Sort remaining debts according to strategy
    const remaining = active.filter((d) => d.currentBalance > 0.5);
    if (strategy === 'avalanche') {
      remaining.sort((a, b) => b.annualRatePercent - a.annualRatePercent || a.currentBalance - b.currentBalance);
    } else if (strategy === 'snowball') {
      remaining.sort((a, b) => a.currentBalance - b.currentBalance || b.annualRatePercent - a.annualRatePercent);
    }

    // Apply extra pool + freed-up minimums
    // Calculate total monthly commitment in snowball/avalanche = sum(all minPayments) + extraMonthlyBudget
    if (strategy !== 'minimum' && remaining.length > 0) {
      for (const target of remaining) {
        if (availableExtra <= 0) break;
        const extraPay = Math.min(target.currentBalance, availableExtra);
        target.currentBalance -= extraPay;
        availableExtra -= extraPay;
        if (target.currentBalance <= 0.5 && !payoffOrder.includes(target.name)) {
          target.currentBalance = 0;
          payoffOrder.push(target.name);
        }
      }
    }
  }

  // Re-run with full rollover commitment for Snowball & Avalanche so freed-up minimums compound properly
  const totalPrincipal = debts.reduce((s, d) => s + d.balance, 0);
  const strategyLabel =
    strategy === 'avalanche'
      ? 'Avalanche (Highest Interest First)'
      : strategy === 'snowball'
      ? 'Snowball (Smallest Balance First)'
      : 'Minimum Payments Only';

  return {
    strategyName: strategyLabel,
    monthsToPayoff: months,
    totalInterestPaid: Math.round(totalInterestPaid),
    totalAmountPaid: Math.round(totalPrincipal + totalInterestPaid),
    payoffOrder,
  };
}

function simulateRolloverDebtPayoff(
  debts: DebtItem[],
  extraMonthlyBudget: number,
  strategy: 'avalanche' | 'snowball' | 'minimum'
): DebtStrategySummary {
  const active = debts.map((d) => ({ ...d, currentBalance: d.balance }));
  const payoffOrder: string[] = [];
  let months = 0;
  let totalInterestPaid = 0;
  const maxMonths = 600;
  const baseTotalMinCommitment = debts.reduce((sum, d) => sum + d.minPayment, 0);

  while (active.some((d) => d.currentBalance > 0.5) && months < maxMonths) {
    months++;
    let monthlyPool = strategy === 'minimum' ? 0 : baseTotalMinCommitment + extraMonthlyBudget;

    // 1. Add interest and pay required minimums on still-active debts
    for (const debt of active) {
      if (debt.currentBalance <= 0.5) continue;
      const monthlyInterest = debt.currentBalance * (debt.annualRatePercent / 100 / 12);
      totalInterestPaid += monthlyInterest;
      debt.currentBalance += monthlyInterest;

      const minPay = Math.min(debt.currentBalance, debt.minPayment);
      debt.currentBalance -= minPay;
      if (strategy !== 'minimum') {
        monthlyPool -= minPay;
      }

      if (debt.currentBalance <= 0.5 && !payoffOrder.includes(debt.name)) {
        debt.currentBalance = 0;
        payoffOrder.push(debt.name);
      }
    }

    // 2. Direct remaining pool (extra budget + freed minimums) to priority debt
    if (strategy !== 'minimum' && monthlyPool > 0) {
      const remaining = active.filter((d) => d.currentBalance > 0.5);
      if (strategy === 'avalanche') {
        remaining.sort((a, b) => b.annualRatePercent - a.annualRatePercent || a.currentBalance - b.currentBalance);
      } else {
        remaining.sort((a, b) => a.currentBalance - b.currentBalance || b.annualRatePercent - a.annualRatePercent);
      }

      for (const target of remaining) {
        if (monthlyPool <= 0) break;
        const pay = Math.min(target.currentBalance, monthlyPool);
        target.currentBalance -= pay;
        monthlyPool -= pay;
        if (target.currentBalance <= 0.5 && !payoffOrder.includes(target.name)) {
          target.currentBalance = 0;
          payoffOrder.push(target.name);
        }
      }
    }
  }

  for (const d of active) {
    if (!payoffOrder.includes(d.name)) payoffOrder.push(d.name);
  }

  const totalPrincipal = debts.reduce((s, d) => s + d.balance, 0);
  const strategyLabel =
    strategy === 'avalanche'
      ? 'Avalanche (Highest Interest First)'
      : strategy === 'snowball'
      ? 'Snowball (Smallest Balance First)'
      : 'Minimum Payments Only';

  return {
    strategyName: strategyLabel,
    monthsToPayoff: months,
    totalInterestPaid: Math.round(totalInterestPaid),
    totalAmountPaid: Math.round(totalPrincipal + totalInterestPaid),
    payoffOrder,
  };
}

export function calculateDebtReduction(
  debts: DebtItem[],
  extraMonthlyPayment: number
): ValidationResult<DebtReductionOutput> {
  if (!debts || debts.length === 0) {
    return { valid: false, error: 'Please include at least one loan or credit balance.' };
  }
  if (!Number.isFinite(extraMonthlyPayment) || extraMonthlyPayment < 0) {
    return { valid: false, error: 'Extra monthly debt payment cannot be negative.' };
  }

  for (const debt of debts) {
    if (!Number.isFinite(debt.balance) || debt.balance <= 0) {
      return { valid: false, error: `Balance for "${debt.name}" must be greater than ₹0.` };
    }
    if (!Number.isFinite(debt.annualRatePercent) || debt.annualRatePercent < 0 || debt.annualRatePercent > 60) {
      return { valid: false, error: `Interest rate for "${debt.name}" must be between 0% and 60%.` };
    }
    const monthlyInterest = debt.balance * (debt.annualRatePercent / 100 / 12);
    if (!Number.isFinite(debt.minPayment) || debt.minPayment <= monthlyInterest) {
      return {
        valid: false,
        error: `Minimum monthly payment for "${debt.name}" (${formatINR(debt.minPayment)}) must exceed its monthly interest of ${formatINR(Math.ceil(monthlyInterest + 10))} so the loan can be paid off.`,
      };
    }
  }

  const avalanche = simulateRolloverDebtPayoff(debts, extraMonthlyPayment, 'avalanche');
  const snowball = simulateRolloverDebtPayoff(debts, extraMonthlyPayment, 'snowball');
  const minimumOnly = simulateRolloverDebtPayoff(debts, 0, 'minimum');

  const interestSavedByAvalanche = Math.max(0, minimumOnly.totalInterestPaid - avalanche.totalInterestPaid);
  const monthsSavedByAvalanche = Math.max(0, minimumOnly.monthsToPayoff - avalanche.monthsToPayoff);

  const avalancheVsSnowballDiff = Math.max(0, snowball.totalInterestPaid - avalanche.totalInterestPaid);
  const recommendation =
    avalancheVsSnowballDiff > 1000
      ? `The Debt Avalanche method saves you ${formatINR(avalancheVsSnowballDiff)} more in interest than Snowball by eliminating ${avalanche.payoffOrder[0]} (highest interest rate) first. Choose Snowball only if closing ${snowball.payoffOrder[0]} quickly keeps you motivated!`
      : `Both Avalanche and Snowball cost nearly the same in interest. Start with ${snowball.payoffOrder[0]} for a quick psychological win!`;

  return {
    valid: true,
    data: {
      avalanche,
      snowball,
      minimumOnly,
      interestSavedByAvalanche,
      monthsSavedByAvalanche,
      recommendation,
    },
  };
}

// 5. Loan EMI Calculator
export interface EmiInput {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
}

export interface EmiOutput {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principalSharePercent: number;
  interestSharePercent: number;
}

export function calculateLoanEmi(input: EmiInput): ValidationResult<EmiOutput> {
  if (!Number.isFinite(input.principal) || input.principal <= 0) {
    return { valid: false, error: 'Loan amount must be greater than ₹0.' };
  }
  if (!Number.isFinite(input.annualInterestRate) || input.annualInterestRate <= 0 || input.annualInterestRate > 45) {
    return { valid: false, error: 'Annual interest rate must be between 0.1% and 45%.' };
  }
  if (!Number.isFinite(input.tenureYears) || input.tenureYears <= 0 || input.tenureYears > 40) {
    return { valid: false, error: 'Loan tenure must be between 1 and 40 years.' };
  }

  const n = Math.round(input.tenureYears * 12);
  const r = input.annualInterestRate / 100 / 12;
  const factor = Math.pow(1 + r, n);
  const emi = (input.principal * r * factor) / (factor - 1);

  const monthlyEmi = Math.round(emi);
  const totalPayment = monthlyEmi * n;
  const totalInterest = Math.max(0, totalPayment - Math.round(input.principal));
  const principalSharePercent = Math.round((input.principal / totalPayment) * 100);
  const interestSharePercent = 100 - principalSharePercent;

  return {
    valid: true,
    data: {
      monthlyEmi,
      totalInterest,
      totalPayment,
      principalSharePercent,
      interestSharePercent,
    },
  };
}

// 6. Inflation & Purchasing Power Calculator
export interface InflationInput {
  currentCost: number;
  inflationRatePercent: number;
  years: number;
}

export interface InflationOutput {
  futureCost: number;
  purchasingPowerOfCurrentMoney: number;
  extraMoneyNeeded: number;
  purchasingPowerLossPercent: number;
}

export function calculateInflationImpact(input: InflationInput): ValidationResult<InflationOutput> {
  if (!Number.isFinite(input.currentCost) || input.currentCost <= 0) {
    return { valid: false, error: 'Current expense or corpus amount must be greater than ₹0.' };
  }
  if (!Number.isFinite(input.inflationRatePercent) || input.inflationRatePercent < 0 || input.inflationRatePercent > 25) {
    return { valid: false, error: 'Annual inflation rate must be between 0% and 25%.' };
  }
  if (!Number.isFinite(input.years) || input.years <= 0 || input.years > 50) {
    return { valid: false, error: 'Number of years must be between 1 and 50.' };
  }

  const rate = input.inflationRatePercent / 100;
  const futureCost = Math.round(input.currentCost * Math.pow(1 + rate, input.years));
  const purchasingPowerOfCurrentMoney = Math.round(input.currentCost / Math.pow(1 + rate, input.years));
  const extraMoneyNeeded = Math.max(0, futureCost - input.currentCost);
  const purchasingPowerLossPercent = Math.round(
    ((input.currentCost - purchasingPowerOfCurrentMoney) / input.currentCost) * 100
  );

  return {
    valid: true,
    data: {
      futureCost,
      purchasingPowerOfCurrentMoney,
      extraMoneyNeeded,
      purchasingPowerLossPercent,
    },
  };
}

// 7. Single-Input Debt Payoff Time Estimator (Total Debt, Monthly Payment, Interest Rate)
export interface SingleDebtPayoffInput {
  totalDebt: number;
  monthlyPayment: number;
  annualInterestRate: number;
}

export interface SingleDebtScheduleRow {
  month: number;
  payment: number;
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
}

export interface SingleDebtPayoffOutput {
  monthsToDebtFree: number;
  yearsPart: number;
  monthsPart: number;
  formattedDuration: string;
  totalInterestPaid: number;
  totalAmountPaid: number;
  principalSharePercent: number;
  interestSharePercent: number;
  minimumRequiredPayment: number;
  boostMonthlyAmount: number;
  monthsSavedWithBoost: number;
  interestSavedWithBoost: number;
  schedule: SingleDebtScheduleRow[];
}

export function calculateSingleDebtPayoff(
  input: SingleDebtPayoffInput
): ValidationResult<SingleDebtPayoffOutput> {
  if (!Number.isFinite(input.totalDebt) || input.totalDebt <= 0) {
    return { valid: false, error: 'Total debt amount must be greater than ₹0.' };
  }
  if (input.totalDebt > 10_00_00_000) {
    return { valid: false, error: 'Total debt exceeds the calculator maximum (₹10 Crore).' };
  }
  if (
    !Number.isFinite(input.annualInterestRate) ||
    input.annualInterestRate < 0 ||
    input.annualInterestRate > 60
  ) {
    return { valid: false, error: 'Annual interest rate must be between 0% and 60%.' };
  }
  if (!Number.isFinite(input.monthlyPayment) || input.monthlyPayment <= 0) {
    return { valid: false, error: 'Monthly payment must be greater than ₹0.' };
  }

  const monthlyRate = input.annualInterestRate / 100 / 12;
  const firstMonthInterest = input.totalDebt * monthlyRate;
  const minimumRequiredPayment = Math.ceil(firstMonthInterest + Math.max(100, input.totalDebt * 0.005));

  if (input.monthlyPayment <= firstMonthInterest) {
    return {
      valid: false,
      error: `Your monthly payment (${formatINR(input.monthlyPayment)}) does not cover the monthly interest charge of ${formatINR(Math.ceil(firstMonthInterest))}. Please enter at least ${formatINR(minimumRequiredPayment)}/month so your debt balance decreases.`,
    };
  }

  const runSimulation = (paymentAmount: number) => {
    let balance = input.totalDebt;
    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    const schedule: SingleDebtScheduleRow[] = [];
    const maxMonths = 600;

    while (balance > 0.01 && month < maxMonths) {
      month++;
      const interestForMonth = balance * monthlyRate;
      const actualPayment = Math.min(balance + interestForMonth, paymentAmount);
      const principalForMonth = actualPayment - interestForMonth;
      balance = Math.max(0, balance - principalForMonth);

      totalInterest += interestForMonth;
      totalPaid += actualPayment;

      schedule.push({
        month,
        payment: Math.round(actualPayment),
        interestPaid: Math.round(interestForMonth),
        principalPaid: Math.round(principalForMonth),
        remainingBalance: Math.round(balance),
      });
    }

    return {
      months: month,
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPaid),
      schedule,
    };
  };

  const baseSim = runSimulation(input.monthlyPayment);
  if (baseSim.months >= 600) {
    return {
      valid: false,
      error: `At ${formatINR(input.monthlyPayment)}/month, payoff takes over 50 years. Try increasing your monthly payment to at least ${formatINR(minimumRequiredPayment)}.`,
    };
  }

  const boostMonthlyAmount = Math.max(500, Math.round((input.monthlyPayment * 0.15) / 100) * 100);
  const boostSim = runSimulation(input.monthlyPayment + boostMonthlyAmount);

  const yearsPart = Math.floor(baseSim.months / 12);
  const monthsPart = baseSim.months % 12;
  const formattedDuration =
    yearsPart > 0 && monthsPart > 0
      ? `${yearsPart} ${yearsPart === 1 ? 'yr' : 'yrs'} ${monthsPart} ${monthsPart === 1 ? 'mo' : 'mos'}`
      : yearsPart > 0
      ? `${yearsPart} ${yearsPart === 1 ? 'year' : 'years'}`
      : `${monthsPart} ${monthsPart === 1 ? 'month' : 'months'}`;

  const principalSharePercent = Math.round((input.totalDebt / baseSim.totalPaid) * 100);
  const interestSharePercent = Math.max(0, 100 - principalSharePercent);

  return {
    valid: true,
    data: {
      monthsToDebtFree: baseSim.months,
      yearsPart,
      monthsPart,
      formattedDuration,
      totalInterestPaid: baseSim.totalInterest,
      totalAmountPaid: baseSim.totalPaid,
      principalSharePercent,
      interestSharePercent,
      minimumRequiredPayment,
      boostMonthlyAmount,
      monthsSavedWithBoost: Math.max(0, baseSim.months - boostSim.months),
      interestSavedWithBoost: Math.max(0, baseSim.totalInterest - boostSim.totalInterest),
      schedule: baseSim.schedule,
    },
  };
}

// Unused helper export suppression
export { simulateDebtPayoff };

// 8. Daily Spending Tracker & Monthly Category Summary
export type SpendingCategory =
  | 'Food & Groceries'
  | 'Transport & Commute'
  | 'Rent & Housing'
  | 'Utilities & Bills'
  | 'Shopping & Lifestyle'
  | 'Healthcare'
  | 'Other';

export interface ExpenseItem {
  id: string;
  description: string;
  category: SpendingCategory;
  amount: number;
  dayLabel: string;
  type: 'Need' | 'Want';
}

export interface CategorySummaryRow {
  category: SpendingCategory;
  defaultType: 'Need' | 'Want';
  count: number;
  totalAmount: number;
  shareOfSpendPercent: number;
  shareOfBudgetPercent: number;
}

export interface SpendingSummaryResult {
  totalSpent: number;
  monthlyBudget: number;
  remainingBudget: number;
  needsTotal: number;
  wantsTotal: number;
  needsSharePercent: number;
  wantsSharePercent: number;
  categoryRows: CategorySummaryRow[];
  highestCategory: string;
  coachingNote: string;
}

export function calculateSpendingSummary(
  expenses: ExpenseItem[],
  monthlyBudget: number
): ValidationResult<SpendingSummaryResult> {
  if (!Number.isFinite(monthlyBudget) || monthlyBudget <= 0) {
    return {
      valid: false,
      error: 'Please enter a valid monthly budget or income greater than ₹0.',
    };
  }
  if (monthlyBudget > 10_00_00_000) {
    return {
      valid: false,
      error: 'Monthly budget exceeds the calculator maximum (₹10 Crore).',
    };
  }

  for (const item of expenses) {
    if (!Number.isFinite(item.amount) || item.amount <= 0) {
      return {
        valid: false,
        error: `Expense "${item.description || 'Unnamed'}" must have an amount greater than ₹0.`,
      };
    }
  }

  const totalSpent = Math.round(expenses.reduce((sum, e) => sum + e.amount, 0));
  const remainingBudget = Math.round(monthlyBudget - totalSpent);

  const needsTotal = Math.round(
    expenses.filter((e) => e.type === 'Need').reduce((sum, e) => sum + e.amount, 0)
  );
  const wantsTotal = Math.round(
    expenses.filter((e) => e.type === 'Want').reduce((sum, e) => sum + e.amount, 0)
  );

  const needsSharePercent = totalSpent > 0 ? Math.round((needsTotal / totalSpent) * 100) : 0;
  const wantsSharePercent = totalSpent > 0 ? Math.max(0, 100 - needsSharePercent) : 0;

  const categoryOrder: SpendingCategory[] = [
    'Rent & Housing',
    'Food & Groceries',
    'Transport & Commute',
    'Utilities & Bills',
    'Shopping & Lifestyle',
    'Healthcare',
    'Other',
  ];

  const categoryMap = new Map<
    SpendingCategory,
    { count: number; totalAmount: number; wantAmount: number }
  >();

  for (const cat of categoryOrder) {
    categoryMap.set(cat, { count: 0, totalAmount: 0, wantAmount: 0 });
  }

  for (const exp of expenses) {
    const current = categoryMap.get(exp.category) || { count: 0, totalAmount: 0, wantAmount: 0 };
    current.count += 1;
    current.totalAmount += exp.amount;
    if (exp.type === 'Want') {
      current.wantAmount += exp.amount;
    }
    categoryMap.set(exp.category, current);
  }

  const categoryRows: CategorySummaryRow[] = [];
  for (const [category, stats] of categoryMap.entries()) {
    if (stats.count === 0) continue;
    const roundedTotal = Math.round(stats.totalAmount);
    const shareOfSpendPercent =
      totalSpent > 0 ? Math.round((roundedTotal / totalSpent) * 100) : 0;
    const shareOfBudgetPercent = Math.round((roundedTotal / monthlyBudget) * 100);
    const defaultType: 'Need' | 'Want' =
      stats.wantAmount > stats.totalAmount / 2 ? 'Want' : 'Need';

    categoryRows.push({
      category,
      defaultType,
      count: stats.count,
      totalAmount: roundedTotal,
      shareOfSpendPercent,
      shareOfBudgetPercent,
    });
  }

  categoryRows.sort((a, b) => b.totalAmount - a.totalAmount);

  const highestCategory =
    categoryRows.length > 0 ? categoryRows[0].category : 'No expenses logged yet';

  let coachingNote = '';
  if (totalSpent === 0) {
    coachingNote =
      'Add your daily expenses on the left to see your categorized monthly summary table.';
  } else if (remainingBudget < 0) {
    coachingNote = `You have exceeded your monthly budget of ${formatINR(monthlyBudget)} by ${formatINR(Math.abs(remainingBudget))}. Review your top category (${highestCategory}) and trim optional Wants first.`;
  } else if (remainingBudget >= monthlyBudget * 0.2) {
    coachingNote = `Great discipline! You have ${formatINR(remainingBudget)} (${Math.round((remainingBudget / monthlyBudget) * 100)}% of your budget) remaining—enough to hit FinBuddy's 20% monthly savings goal.`;
  } else {
    coachingNote = `You have ${formatINR(remainingBudget)} remaining this month. Try keeping optional Wants under 20%–30% so you can consistently save at least 20% of your income.`;
  }

  return {
    valid: true,
    data: {
      totalSpent,
      monthlyBudget,
      remainingBudget,
      needsTotal,
      wantsTotal,
      needsSharePercent,
      wantsSharePercent,
      categoryRows,
      highestCategory,
      coachingNote,
    },
  };
}


