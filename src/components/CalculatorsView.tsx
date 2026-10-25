import React, { useState } from 'react';
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  calculateBudgetPlan,
  calculateCompoundInterest,
  calculateDebtReduction,
  calculateInflationImpact,
  calculateLoanEmi,
  calculateSavingsGoal,
  calculateSpendingSummary,
  formatINR,
  type DebtItem,
  type ExpenseItem,
  type SpendingCategory,
} from '../utils/calculators';

type CalculatorType =
  | 'budget'
  | 'spending'
  | 'compound'
  | 'debt'
  | 'savings'
  | 'emi'
  | 'inflation';

export const CalculatorsView: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>('budget');

  // 1. Budget Planner State
  const [monthlyIncome, setMonthlyIncome] = useState<string>('30000');
  const [needsPct, setNeedsPct] = useState<string>('50');
  const [wantsPct, setWantsPct] = useState<string>('30');
  const [savingsPct, setSavingsPct] = useState<string>('20');
  const [existingEmergency, setExistingEmergency] = useState<string>('15000');

  // 2. Compound Interest & SIP State
  const [ciPrincipal, setCiPrincipal] = useState<string>('50000');
  const [ciMonthlySip, setCiMonthlySip] = useState<string>('5000');
  const [ciRate, setCiRate] = useState<string>('12');
  const [ciYears, setCiYears] = useState<string>('10');
  const [ciFreq, setCiFreq] = useState<1 | 4 | 12>(12);

  // 3. Debt Reduction Scenarios State
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: 'd1', name: 'Credit Card Balance', balance: 45000, annualRatePercent: 36, minPayment: 2500 },
    { id: 'd2', name: 'Smartphone Consumer EMI', balance: 20000, annualRatePercent: 14, minPayment: 1500 },
    { id: 'd3', name: 'Personal Loan', balance: 85000, annualRatePercent: 16, minPayment: 3200 },
  ]);
  const [extraDebtBudget, setExtraDebtBudget] = useState<string>('4000');
  const [newDebtName, setNewDebtName] = useState<string>('');
  const [newDebtBalance, setNewDebtBalance] = useState<string>('30000');
  const [newDebtRate, setNewDebtRate] = useState<string>('18');
  const [newDebtMin, setNewDebtMin] = useState<string>('1500');

  // 4. Savings Goal State
  const [goalTarget, setGoalTarget] = useState<string>('300000');
  const [goalCurrent, setGoalCurrent] = useState<string>('25000');
  const [goalYears, setGoalYears] = useState<string>('3');
  const [goalReturn, setGoalReturn] = useState<string>('7.5');

  // 5. Loan EMI State
  const [emiPrincipal, setEmiPrincipal] = useState<string>('500000');
  const [emiRate, setEmiRate] = useState<string>('10');
  const [emiYears, setEmiYears] = useState<string>('5');

  // 6. Inflation State
  const [infCurrentCost, setInfCurrentCost] = useState<string>('50000');
  const [infRate, setInfRate] = useState<string>('6');
  const [infYears, setInfYears] = useState<string>('10');

  // 7. Spending Tracker State
  const [spendingBudget, setSpendingBudget] = useState<string>('30000');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 'exp-1',
      description: 'Monthly Room Rent',
      category: 'Rent & Housing',
      amount: 10000,
      dayLabel: 'Day 1',
      type: 'Need',
    },
    {
      id: 'exp-2',
      description: 'Weekly Vegetables, Dal & Milk',
      category: 'Food & Groceries',
      amount: 4200,
      dayLabel: 'Day 5',
      type: 'Need',
    },
    {
      id: 'exp-3',
      description: 'Metro Card & Bus Pass Recharge',
      category: 'Transport & Commute',
      amount: 1800,
      dayLabel: 'Day 7',
      type: 'Need',
    },
    {
      id: 'exp-4',
      description: 'Electricity, Wi-Fi & Mobile Plan',
      category: 'Utilities & Bills',
      amount: 1500,
      dayLabel: 'Day 10',
      type: 'Need',
    },
    {
      id: 'exp-5',
      description: 'Weekend Dosa & Coffee Outing',
      category: 'Food & Groceries',
      amount: 1200,
      dayLabel: 'Day 14',
      type: 'Want',
    },
    {
      id: 'exp-6',
      description: 'Online Shopping & Movie Ticket',
      category: 'Shopping & Lifestyle',
      amount: 1800,
      dayLabel: 'Day 18',
      type: 'Want',
    },
  ]);
  const [newExpDesc, setNewExpDesc] = useState<string>('');
  const [newExpCategory, setNewExpCategory] = useState<SpendingCategory>('Food & Groceries');
  const [newExpAmount, setNewExpAmount] = useState<string>('450');
  const [newExpDay, setNewExpDay] = useState<string>('Day 20');
  const [newExpType, setNewExpType] = useState<'Need' | 'Want'>('Need');

  // Computations
  const budgetResult = calculateBudgetPlan({
    monthlyIncome: Number(monthlyIncome),
    needsPercent: Number(needsPct),
    wantsPercent: Number(wantsPct),
    savingsPercent: Number(savingsPct),
    existingEmergencyFund: Number(existingEmergency),
  });

  const spendingResult = calculateSpendingSummary(expenses, Number(spendingBudget));

  const compoundResult = calculateCompoundInterest({
    initialPrincipal: Number(ciPrincipal),
    monthlyContribution: Number(ciMonthlySip),
    annualRatePercent: Number(ciRate),
    years: Number(ciYears),
    compoundingFrequency: ciFreq,
  });

  const debtResult = calculateDebtReduction(debts, Number(extraDebtBudget));

  const savingsResult = calculateSavingsGoal({
    targetAmount: Number(goalTarget),
    currentSavings: Number(goalCurrent),
    years: Number(goalYears),
    expectedAnnualReturn: Number(goalReturn),
  });

  const emiResult = calculateLoanEmi({
    principal: Number(emiPrincipal),
    annualInterestRate: Number(emiRate),
    tenureYears: Number(emiYears),
  });

  const inflationResult = calculateInflationImpact({
    currentCost: Number(infCurrentCost),
    inflationRatePercent: Number(infRate),
    years: Number(infYears),
  });

  const calculatorTabs: { id: CalculatorType; label: string }[] = [
    { id: 'budget', label: 'Budget Planner' },
    { id: 'spending', label: 'Spending Tracker' },
    { id: 'compound', label: 'Compound Interest & SIP' },
    { id: 'debt', label: 'Debt Reduction Scenarios' },
    { id: 'savings', label: 'Savings Goal' },
    { id: 'emi', label: 'Loan EMI' },
    { id: 'inflation', label: 'Inflation Calculator' },
  ];

  const spendingCategories: SpendingCategory[] = [
    'Food & Groceries',
    'Transport & Commute',
    'Rent & Housing',
    'Utilities & Bills',
    'Shopping & Lifestyle',
    'Healthcare',
    'Other',
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDesc = newExpDesc.trim() || `${newExpCategory} Expense`;
    const parsedAmt = Number(newExpAmount);
    if (!Number.isFinite(parsedAmt) || parsedAmt <= 0) return;
    setExpenses((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        description: cleanDesc,
        category: newExpCategory,
        amount: parsedAmt,
        dayLabel: newExpDay.trim() || 'Today',
        type: newExpType,
      },
    ]);
    setNewExpDesc('');
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtName.trim()) return;
    setDebts((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        name: newDebtName.trim(),
        balance: Number(newDebtBalance),
        annualRatePercent: Number(newDebtRate),
        minPayment: Number(newDebtMin),
      },
    ]);
    setNewDebtName('');
  };

  const handleRemoveDebt = (id: string) => {
    if (debts.length <= 1) return;
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="text-xs font-medium text-teal-700">
          <span>Smart Financial Calculators</span>
          <span className="mx-1.5">·</span>
          <span>Currency in ₹ (INR)</span>
          <span className="mx-1.5">·</span>
          <span>Transparent Formulas & Assumptions</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Interactive Personal Finance Calculators
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Test real-world scenarios for budgeting, monthly saving, compound interest, debt payoff
          (Avalanche vs. Snowball), loan EMIs, and inflation. All outputs are illustrative
          educational estimates.
        </p>

        {/* Segmented Calculator Selector */}
        <div
          role="tablist"
          aria-label="Choose a financial calculator"
          className="flex flex-wrap items-center gap-1.5 pt-2"
        >
          {calculatorTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeCalc === tab.id}
              type="button"
              onClick={() => setActiveCalc(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCalc === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. BUDGET PLANNER */}
      {activeCalc === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                1. Monthly Budget & Emergency Planner
              </h2>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setNeedsPct('50');
                    setWantsPct('30');
                    setSavingsPct('20');
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer whitespace-nowrap"
                >
                  50/30/20 Rule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNeedsPct('60');
                    setWantsPct('20');
                    setSavingsPct('20');
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-teal-50 hover:bg-teal-100 text-teal-900 rounded cursor-pointer whitespace-nowrap"
                >
                  Metro 60/20/20
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="budget-income"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Monthly Take-Home Income (₹)
                </label>
                <input
                  id="budget-income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="budget-needs-pct"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Needs (%)
                  </label>
                  <input
                    id="budget-needs-pct"
                    type="number"
                    value={needsPct}
                    onChange={(e) => setNeedsPct(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="budget-wants-pct"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Wants (%)
                  </label>
                  <input
                    id="budget-wants-pct"
                    type="number"
                    value={wantsPct}
                    onChange={(e) => setWantsPct(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="budget-savings-pct"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Savings (%)
                  </label>
                  <input
                    id="budget-savings-pct"
                    type="number"
                    value={savingsPct}
                    onChange={(e) => setSavingsPct(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="budget-emergency"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Current Emergency Savings Already Saved (₹)
                </label>
                <input
                  id="budget-emergency"
                  type="number"
                  value={existingEmergency}
                  onChange={(e) => setExistingEmergency(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>
            </div>

            {/* Formula & Assumptions */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900">Formula & Assumptions:</p>
              <p className="font-mono text-[11px] text-slate-800">
                Bucket Amount = Monthly Income × (Bucket % ÷ 100)
              </p>
              <p className="font-mono text-[11px] text-slate-800">
                Emergency Target = 3 to 6 × Monthly Essential Needs
              </p>
              <p>
                Assumes steady monthly post-tax income. High-rent metro learners can adjust
                percentages as long as Needs + Wants + Savings = 100%.
              </p>
            </div>
          </div>

          {/* Results (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {!budgetResult.valid || !budgetResult.data ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Invalid Budget Input</h3>
                  <p className="text-xs mt-1">{budgetResult.error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Illustrative Monthly Budget Breakdown
                  </h3>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    Income: {formatINR(Number(monthlyIncome))}/month
                  </span>
                </div>

                {/* 3 Bucket Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Essential Needs ({needsPct}%)</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {formatINR(budgetResult.data.needsAmount)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Rent, groceries, bills, commute
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Lifestyle Wants ({wantsPct}%)</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {formatINR(budgetResult.data.wantsAmount)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Dining, movies, personal shopping
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                    <p className="text-xs text-teal-900 font-medium">
                      Savings & Goals ({savingsPct}%)
                    </p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-teal-900 mt-1">
                      {formatINR(budgetResult.data.savingsAmount)}
                    </p>
                    <p className="text-[11px] text-teal-800 mt-1">
                      {formatINR(budgetResult.data.annualSavingsProjection)} saved per year
                    </p>
                  </div>
                </div>

                {/* Emergency Fund Roadmap */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Emergency Fund Target (3 to 6 Months of Essential Needs)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">3-Month Safety Shield:</span>
                      <p className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                        {formatINR(budgetResult.data.emergencyFundTargetMin)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">6-Month Full Shield:</span>
                      <p className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                        {formatINR(budgetResult.data.emergencyFundTargetMax)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Months to Reach 3-Mo Shield:</span>
                      <p className="text-base font-bold font-mono tabular-nums text-teal-700 mt-0.5">
                        {budgetResult.data.monthsToEmergencyFund === 0
                          ? 'Already Achieved!'
                          : budgetResult.data.monthsToEmergencyFund !== null
                          ? `${budgetResult.data.monthsToEmergencyFund} months`
                          : 'Increase savings %'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 text-xs sm:text-sm text-teal-950">
                  <strong>FinBuddy Coaching Note: </strong>
                  {budgetResult.data.insight}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. COMPOUND INTEREST & SIP CALCULATOR */}
      {activeCalc === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">
              2. Compound Interest & Monthly SIP Calculator
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="ci-principal"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Initial One-Time Lump Sum Investment (₹)
                </label>
                <input
                  id="ci-principal"
                  type="number"
                  value={ciPrincipal}
                  onChange={(e) => setCiPrincipal(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>

              <div>
                <label
                  htmlFor="ci-sip"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Monthly SIP Contribution (₹)
                </label>
                <input
                  id="ci-sip"
                  type="number"
                  value={ciMonthlySip}
                  onChange={(e) => setCiMonthlySip(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="ci-rate"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Expected Annual Return (% p.a.)
                  </label>
                  <input
                    id="ci-rate"
                    type="number"
                    step="0.5"
                    value={ciRate}
                    onChange={(e) => setCiRate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ci-years"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Time Period (Years)
                  </label>
                  <input
                    id="ci-years"
                    type="number"
                    value={ciYears}
                    onChange={(e) => setCiYears(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="ci-freq"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Compounding Frequency
                </label>
                <select
                  id="ci-freq"
                  value={ciFreq}
                  onChange={(e) => setCiFreq(Number(e.target.value) as 1 | 4 | 12)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value={12}>Monthly (12× per year)</option>
                  <option value={4}>Quarterly (4× per year — typical Indian FD)</option>
                  <option value={1}>Annually (1× per year — typical PPF)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900">Formula & Assumptions:</p>
              <p className="font-mono text-[11px] text-slate-800">
                Lump Sum: A = P × (1 + r/n)^(n×t)
              </p>
              <p className="font-mono text-[11px] text-slate-800">
                SIP: FV = SIP × [((1 + i)^m − 1) ÷ i] × (1 + i)
              </p>
              <p>
                Illustrative projection only. Market-linked returns are not guaranteed and do not
                account for exit loads or capital gains taxes.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {!compoundResult.valid || !compoundResult.data ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Invalid Input</h3>
                  <p className="text-xs mt-1">{compoundResult.error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Total Principal Invested</p>
                    <p className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {formatINR(compoundResult.data.totalInvested)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Estimated Compound Returns</p>
                    <p className="text-xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
                      +{formatINR(compoundResult.data.totalInterest)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                    <p className="text-xs text-teal-900 font-medium">
                      Estimated Maturity Value
                    </p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-teal-950 mt-1">
                      {formatINR(compoundResult.data.maturityValue)}
                    </p>
                  </div>
                </div>

                {/* Compound vs Simple Interest Callout */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">
                      Power of Compounding vs. Simple Interest:
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Under simple interest, your corpus would be{' '}
                      <span className="font-mono font-semibold">
                        {formatINR(compoundResult.data.simpleInterestComparison)}
                      </span>
                      . Compounding adds an extra{' '}
                      <span className="font-mono font-semibold text-[#10B981]">
                        +{formatINR(compoundResult.data.compoundingAdvantage)}
                      </span>
                      !
                    </p>
                  </div>
                </div>

                {/* Visual Growth Chart (Principal in Classic Teal #0EA5E9 + Returns in Mint Green #10B981) */}
                <div className="space-y-2.5 bg-[#EEF4F1] border border-slate-200 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#0F172A]">
                      Visual Wealth Growth Chart (Principal vs. Compound Returns)
                    </span>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#0EA5E9] inline-block" />
                        Principal Invested
                      </span>
                      <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981] inline-block" />
                        Compound Returns
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {compoundResult.data.yearlyBreakdown.slice(-6).map((row) => {
                      const maxVal = compoundResult.data?.maturityValue || 1;
                      const principalPct = Math.max(4, Math.round((row.totalInvested / maxVal) * 100));
                      const interestPct = Math.max(2, Math.round((row.interestEarned / maxVal) * 100));
                      return (
                        <div key={row.year} className="grid grid-cols-12 items-center gap-2 text-[11px] font-mono tabular-nums">
                          <span className="col-span-2 text-slate-600">Yr {row.year}</span>
                          <div className="col-span-7 h-3 bg-slate-200/70 rounded-full overflow-hidden flex">
                            <div
                              style={{ width: `${principalPct}%` }}
                              className="h-full bg-[#0EA5E9]"
                              title={`Principal: ${formatINR(row.totalInvested)}`}
                            />
                            <div
                              style={{ width: `${interestPct}%` }}
                              className="h-full bg-[#10B981]"
                              title={`Returns: +${formatINR(row.interestEarned)}`}
                            />
                          </div>
                          <span className="col-span-3 text-right font-semibold text-[#10B981]">
                            {formatINR(row.endingBalance)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Year-by-Year Milestone Table */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Year-by-Year Compounding Schedule
                  </h4>
                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Year</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Total Invested</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Returns Earned</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Year-End Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                        {compoundResult.data.yearlyBreakdown.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50">
                            <td className="py-2 px-4 font-semibold text-slate-900">
                              Year {row.year}
                            </td>
                            <td className="py-2 px-4 text-right text-slate-700">
                              {formatINR(row.totalInvested)}
                            </td>
                            <td className="py-2 px-4 text-right text-emerald-700">
                              +{formatINR(row.interestEarned)}
                            </td>
                            <td className="py-2 px-4 text-right font-bold text-slate-900">
                              {formatINR(row.endingBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. DEBT REDUCTION SCENARIOS (AVALANCHE VS SNOWBALL) */}
      {activeCalc === 'debt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Debts List & Extra Monthly Budget (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">
              3. Debt Reduction Scenarios (Avalanche vs. Snowball)
            </h2>

            <div>
              <label
                htmlFor="debt-extra-budget"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Extra Monthly Money You Can Put Toward Debt Payoff (₹)
              </label>
              <input
                id="debt-extra-budget"
                type="number"
                value={extraDebtBudget}
                onChange={(e) => setExtraDebtBudget(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Paid on top of your required minimum monthly payments.
              </p>
            </div>

            {/* Active Debts List */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-800">
                Your Current Loans / Credit Balances ({debts.length})
              </p>
              {debts.map((debt) => (
                <div
                  key={debt.id}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{debt.name}</p>
                    <p className="text-[11px] font-mono tabular-nums text-slate-600 mt-0.5">
                      Balance: {formatINR(debt.balance)} · Rate: {debt.annualRatePercent}% p.a. ·
                      Min: {formatINR(debt.minPayment)}/mo
                    </p>
                  </div>
                  {debts.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove ${debt.name}`}
                      onClick={() => handleRemoveDebt(debt.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Another Debt Form */}
            <form
              onSubmit={handleAddDebt}
              className="pt-4 border-t border-slate-200 space-y-3"
            >
              <p className="text-xs font-semibold text-slate-800">Add Another Loan to Compare</p>
              <input
                type="text"
                placeholder="Loan name (e.g., Education Loan, Bike EMI)"
                value={newDebtName}
                onChange={(e) => setNewDebtName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500">Balance (₹)</label>
                  <input
                    type="number"
                    value={newDebtBalance}
                    onChange={(e) => setNewDebtBalance(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500">Rate (% p.a.)</label>
                  <input
                    type="number"
                    value={newDebtRate}
                    onChange={(e) => setNewDebtRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500">Min EMI (₹)</label>
                  <input
                    type="number"
                    value={newDebtMin}
                    onChange={(e) => setNewDebtMin(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Loan to Scenario</span>
              </button>
            </form>
          </div>

          {/* Right: Avalanche vs Snowball vs Minimum Comparison (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {!debtResult.valid || !debtResult.data ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Debt Scenario Validation Notice</h3>
                  <p className="text-xs mt-1">{debtResult.error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Side-by-Side Debt Payoff Strategy Comparison
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    When one loan is cleared, its freed-up minimum payment rolls into the next
                    target loan automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    debtResult.data.avalanche,
                    debtResult.data.snowball,
                    debtResult.data.minimumOnly,
                  ].map((strat, i) => (
                    <div
                      key={strat.strategyName}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        i === 0
                          ? 'bg-teal-50/60 border-teal-600'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900">{strat.strategyName}</p>
                        <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                          {strat.monthsToPayoff} months
                        </p>
                        <p className="text-[11px] text-slate-500">Time to 100% Debt-Free</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Interest:</span>
                          <span className="font-mono font-semibold tabular-nums text-slate-900">
                            {formatINR(strat.totalInterestPaid)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Paid:</span>
                          <span className="font-mono tabular-nums text-slate-700">
                            {formatINR(strat.totalAmountPaid)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80">
                        <p className="text-[11px] font-semibold text-slate-700">Payoff Order:</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {strat.payoffOrder.join(' → ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      Total Savings with Debt Avalanche:{' '}
                      <span className="font-mono">
                        {formatINR(debtResult.data.interestSavedByAvalanche)}
                      </span>{' '}
                      & {debtResult.data.monthsSavedByAvalanche} months faster than Minimums Only!
                    </span>
                  </p>
                  <p>{debtResult.data.recommendation}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">Formula & Rollover Assumptions:</p>
                  <p className="font-mono text-[11px] text-slate-800">
                    Monthly Interest_i = Balance_i × (APR_i ÷ 12 ÷ 100); Total Monthly Pool = Σ(Min
                    Payments) + Extra Budget
                  </p>
                  <p>
                    Assumes fixed monthly commitment where freed-up minimum payments from cleared
                    loans automatically roll into the next priority debt (highest APR first for
                    Avalanche; smallest balance first for Snowball).
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. SAVINGS GOAL CALCULATOR */}
      {activeCalc === 'savings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">4. Savings Goal Calculator</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="sg-target"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Target Goal Amount (₹)
                </label>
                <input
                  id="sg-target"
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label
                  htmlFor="sg-current"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Amount Already Saved Toward This Goal (₹)
                </label>
                <input
                  id="sg-current"
                  type="number"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="sg-years"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Years to Reach Goal
                  </label>
                  <input
                    id="sg-years"
                    type="number"
                    value={goalYears}
                    onChange={(e) => setGoalYears(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sg-return"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Expected Return (% p.a.)
                  </label>
                  <input
                    id="sg-return"
                    type="number"
                    step="0.5"
                    value={goalReturn}
                    onChange={(e) => setGoalReturn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Formula & Assumptions:</p>
              <p className="font-mono text-[11px] text-slate-800">
                Monthly Saving = (Target − FV of Current Savings) ÷ SIP Factor
              </p>
              <p>Assumes monthly compounding and consistent beginning-of-month contributions.</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {!savingsResult.valid || !savingsResult.data ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Invalid Goal Input</h3>
                  <p className="text-xs mt-1">{savingsResult.error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1">
                  <p className="text-xs font-semibold text-teal-900">
                    Required Monthly Savings (RD / SIP)
                  </p>
                  <p className="text-3xl font-bold font-mono tabular-nums text-teal-950">
                    {formatINR(savingsResult.data.requiredMonthlySaving)} / month
                  </p>
                  <p className="text-xs text-teal-800">
                    To reach {formatINR(savingsResult.data.targetAmount)} in {goalYears} years at{' '}
                    {goalReturn}% p.a.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Total Principal You Contribute</p>
                    <p className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {formatINR(savingsResult.data.totalPrincipalContributed)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Estimated Interest / Returns Earned</p>
                    <p className="text-xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
                      +{formatINR(savingsResult.data.estimatedReturnsEarned)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 5. LOAN EMI CALCULATOR */}
      {activeCalc === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">5. Loan EMI Calculator</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="emi-principal"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Loan Principal Amount (₹)
                </label>
                <input
                  id="emi-principal"
                  type="number"
                  value={emiPrincipal}
                  onChange={(e) => setEmiPrincipal(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="emi-rate"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    id="emi-rate"
                    type="number"
                    step="0.25"
                    value={emiRate}
                    onChange={(e) => setEmiRate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emi-years"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Loan Tenure (Years)
                  </label>
                  <input
                    id="emi-years"
                    type="number"
                    value={emiYears}
                    onChange={(e) => setEmiYears(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Reducing-Balance EMI Formula:</p>
              <p className="font-mono text-[11px] text-slate-800">
                EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)
              </p>
              <p>Where r = monthly interest rate (Annual Rate ÷ 12 ÷ 100) and n = months.</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {!emiResult.valid || !emiResult.data ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Invalid Loan Input</h3>
                  <p className="text-xs mt-1">{emiResult.error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                    <p className="text-xs font-medium text-teal-900">Monthly EMI</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-teal-950 mt-1">
                      {formatINR(emiResult.data.monthlyEmi)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Total Interest Payable</p>
                    <p className="text-xl font-bold font-mono tabular-nums text-amber-800 mt-1">
                      {formatINR(emiResult.data.totalInterest)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Total Amount Payable</p>
                    <p className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {formatINR(emiResult.data.totalPayment)}
                    </p>
                  </div>
                </div>

                {/* Principal vs Interest Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Principal ({emiResult.data.principalSharePercent}%)</span>
                    <span>Interest Cost ({emiResult.data.interestSharePercent}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-amber-200 overflow-hidden flex">
                    <div
                      style={{ width: `${emiResult.data.principalSharePercent}%` }}
                      className="bg-teal-600 h-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 6. INFLATION & PURCHASING POWER CALCULATOR */}
      {activeCalc === 'inflation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">
              6. Inflation & Purchasing Power Calculator
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="inf-cost"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Today’s Expense or Cash Amount (₹)
                </label>
                <input
                  id="inf-cost"
                  type="number"
                  value={infCurrentCost}
                  onChange={(e) => setInfCurrentCost(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="inf-rate"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Annual Inflation Rate (%)
                  </label>
                  <input
                    id="inf-rate"
                    type="number"
                    step="0.5"
                    value={infRate}
                    onChange={(e) => setInfRate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="inf-years"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Years into Future
                  </label>
                  <input
                    id="inf-years"
                    type="number"
                    value={infYears}
                    onChange={(e) => setInfYears(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Inflation Formula:</p>
              <p className="font-mono text-[11px] text-slate-800">
                Future Cost = Current Cost × (1 + Inflation Rate)^Years
              </p>
              <p className="font-mono text-[11px] text-slate-800">
                Real Purchasing Power = Current Cash ÷ (1 + Inflation Rate)^Years
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {!inflationResult.valid || !inflationResult.data ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Invalid Inflation Input</h3>
                  <p className="text-xs mt-1">{inflationResult.error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200">
                    <p className="text-xs font-semibold text-amber-900">
                      Future Cost of Today’s {formatINR(Number(infCurrentCost))} Expense
                    </p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-amber-950 mt-1">
                      {formatINR(inflationResult.data.futureCost)}
                    </p>
                    <p className="text-xs text-amber-800 mt-1">
                      After {infYears} years at {infRate}% annual inflation
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700">
                      Purchasing Power of Idle {formatINR(Number(infCurrentCost))} Cash
                    </p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {formatINR(inflationResult.data.purchasingPowerOfCurrentMoney)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Loses {inflationResult.data.purchasingPowerLossPercent}% of its buying power
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 7. SPENDING TRACKER & MONTHLY SUMMARY TABLE */}
      {activeCalc === 'spending' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Monthly Budget Input + Log Daily Expense Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Daily Spending Tracker & Categorizer
              </h2>
              <p className="text-xs text-slate-600">
                Log your daily expenses by category (Food, Transport, Rent, etc.) to see where your
                money goes each month.
              </p>
            </div>

            <div>
              <label
                htmlFor="spending-monthly-budget"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Monthly Income / Spending Budget Target (₹)
              </label>
              <input
                id="spending-monthly-budget"
                type="number"
                value={spendingBudget}
                onChange={(e) => setSpendingBudget(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#EEF4F1] border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            {/* Add Daily Expense Form */}
            <form
              onSubmit={handleAddExpense}
              className="bg-[#EEF4F1] border border-slate-200 rounded-xl p-4 space-y-3.5"
            >
              <h3 className="text-xs font-bold text-[#0F172A]">
                Log a New Daily Expense
              </h3>

              <div>
                <label
                  htmlFor="spending-desc-input"
                  className="block text-[11px] font-semibold text-slate-700 mb-1"
                >
                  Expense Description
                </label>
                <input
                  id="spending-desc-input"
                  type="text"
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  placeholder="e.g., Tiffin Lunch, Auto Fare, Grocery"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="spending-category-select"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="spending-category-select"
                    value={newExpCategory}
                    onChange={(e) => setNewExpCategory(e.target.value as SpendingCategory)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                  >
                    {spendingCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="spending-amount-input"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Amount (₹)
                  </label>
                  <input
                    id="spending-amount-input"
                    type="number"
                    min="1"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono tabular-nums text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="spending-day-input"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Day / Date
                  </label>
                  <input
                    id="spending-day-input"
                    type="text"
                    value={newExpDay}
                    onChange={(e) => setNewExpDay(e.target.value)}
                    placeholder="e.g., Day 20"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="spending-type-select"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Need vs. Want
                  </label>
                  <select
                    id="spending-type-select"
                    value={newExpType}
                    onChange={(e) => setNewExpType(e.target.value as 'Need' | 'Want')}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="Need">Essential Need</option>
                    <option value="Want">Lifestyle Want</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense to Tracker</span>
              </button>
            </form>

            {/* Formula & Assumptions */}
            <div className="bg-[#EEF4F1] border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-[#0F172A]">Formula & Assumptions:</p>
              <p className="font-mono text-[11px] text-slate-800">
                Category Total = Σ(Daily Expenses in Category)
              </p>
              <p className="font-mono text-[11px] text-slate-800">
                Remaining Surplus = Monthly Budget − Total Monthly Spend
              </p>
              <p>
                Grouping daily cash and digital expenses into clear categories helps spot spending
                leaks and protect your 20% monthly savings target.
              </p>
            </div>
          </div>

          {/* Right Column: Monthly Summary Table & Daily Expense Log (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {!spendingResult.valid || !spendingResult.data ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Invalid Spending Tracker Input</h3>
                  <p className="text-xs mt-1">{spendingResult.error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* 3 KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#EEF4F1] border border-slate-200">
                    <p className="text-xs text-slate-500">Total Monthly Spent</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-[#0F172A] mt-1">
                      {formatINR(spendingResult.data.totalSpent)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Across {expenses.length} logged expenses
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#EEF4F1] border border-slate-200">
                    <p className="text-xs text-slate-500">Needs vs. Wants Split</p>
                    <p className="text-lg font-bold font-mono tabular-nums text-[#0F172A] mt-1">
                      {spendingResult.data.needsSharePercent}% Needs ·{' '}
                      <span className="text-[#0EA5E9]">
                        {spendingResult.data.wantsSharePercent}% Wants
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Needs: {formatINR(spendingResult.data.needsTotal)} · Wants:{' '}
                      {formatINR(spendingResult.data.wantsTotal)}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      spendingResult.data.remainingBudget >= 0
                        ? 'bg-emerald-50/70 border-[#10B981]'
                        : 'bg-amber-50 border-amber-400'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#0F172A]">
                      {spendingResult.data.remainingBudget >= 0
                        ? 'Remaining Budget Surplus'
                        : 'Over Monthly Budget'}
                    </p>
                    <p
                      className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
                        spendingResult.data.remainingBudget >= 0
                          ? 'text-[#10B981]'
                          : 'text-amber-900'
                      }`}
                    >
                      {spendingResult.data.remainingBudget >= 0 ? '+' : ''}
                      {formatINR(spendingResult.data.remainingBudget)}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      From {formatINR(spendingResult.data.monthlyBudget)} target
                    </p>
                  </div>
                </div>

                {/* Monthly Summary by Category Table */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[#0F172A]">
                      Monthly Spending Summary by Category
                    </h3>
                    <span className="text-xs text-slate-500">
                      Highest Category: <strong className="text-[#0F172A]">{spendingResult.data.highestCategory}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table
                      aria-label="Monthly spending summary by category"
                      className="w-full text-left border-collapse text-xs sm:text-sm"
                    >
                      <thead>
                        <tr className="bg-[#EEF4F1] border-b border-slate-200 text-[#0F172A]">
                          <th className="py-3 px-4 font-semibold">Category</th>
                          <th className="py-3 px-3 font-semibold">Bucket</th>
                          <th className="py-3 px-3 font-semibold text-right">Items</th>
                          <th className="py-3 px-4 font-semibold text-right">Monthly Total (₹)</th>
                          <th className="py-3 px-4 font-semibold text-right">% of Spend</th>
                          <th className="py-3 px-4 font-semibold text-right">% of Budget</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                        {spendingResult.data.categoryRows.map((row) => (
                          <tr key={row.category} className="hover:bg-[#EEF4F1]">
                            <td className="py-2.5 px-4 font-sans font-semibold text-[#0F172A]">
                              {row.category}
                            </td>
                            <td className="py-2.5 px-3 font-sans text-xs">
                              <span
                                className={
                                  row.defaultType === 'Need'
                                    ? 'text-[#0F172A] font-medium'
                                    : 'text-[#0EA5E9] font-semibold'
                                }
                              >
                                {row.defaultType}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-600">{row.count}</td>
                            <td className="py-2.5 px-4 text-right font-bold text-[#0F172A]">
                              {formatINR(row.totalAmount)}
                            </td>
                            <td className="py-2.5 px-4 text-right text-[#0EA5E9] font-semibold">
                              {row.shareOfSpendPercent}%
                            </td>
                            <td className="py-2.5 px-4 text-right text-slate-700">
                              {row.shareOfBudgetPercent}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#EEF4F1] border-t-2 border-slate-200 font-mono tabular-nums font-bold text-[#0F172A]">
                          <td className="py-3 px-4 font-sans">Total Monthly Summary</td>
                          <td className="py-3 px-3 font-sans text-xs text-slate-500">All</td>
                          <td className="py-3 px-3 text-right">{expenses.length}</td>
                          <td className="py-3 px-4 text-right">
                            {formatINR(spendingResult.data.totalSpent)}
                          </td>
                          <td className="py-3 px-4 text-right text-[#0EA5E9]">100%</td>
                          <td className="py-3 px-4 text-right text-[#10B981]">
                            {Math.round(
                              (spendingResult.data.totalSpent /
                                spendingResult.data.monthlyBudget) *
                                100
                            )}
                            %
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Daily Expense Log Table */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Logged Daily Expenses ({expenses.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#EEF4F1] border-b border-slate-200 sticky top-0 text-[#0F172A]">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Day</th>
                          <th className="py-2.5 px-3 font-semibold">Expense Description</th>
                          <th className="py-2.5 px-3 font-semibold">Category</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {expenses.map((item) => (
                          <tr key={item.id} className="hover:bg-[#F8F9FA]">
                            <td className="py-2 px-3 text-slate-500 font-mono">{item.dayLabel}</td>
                            <td className="py-2 px-3 font-medium text-[#0F172A]">
                              {item.description}
                              <span className="ml-1.5 text-[11px] text-slate-500">
                                · {item.type}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-600">{item.category}</td>
                            <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums text-[#0F172A]">
                              {formatINR(item.amount)}
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                aria-label={`Remove ${item.description}`}
                                onClick={() => handleRemoveExpense(item.id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Coaching Callout */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-[#10B981] text-xs sm:text-sm text-[#0F172A] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F172A]">FinBuddy Spending Insight: </strong>
                    <span>{spendingResult.data.coachingNote}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

