import { GLOSSARY_TERMS, LESSONS } from '../data/curriculum';

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedReplies?: string[];
  groundingSources?: GroundingSource[];
  mode?: 'ai' | 'demo';
}

export interface LearnerContext {
  learnerName?: string;
  currentLevel?: string;
  preferredTopic?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: string;
  simpleLanguage: boolean;
}

export const DEFAULT_GROUNDING_SOURCES: GroundingSource[] = [
  {
    uri: 'https://www.rbi.org.in/FinancialEducation/Home.aspx',
    title: 'RBI Financial Education – Reserve Bank of India',
  },
  {
    uri: 'https://investor.sebi.gov.in/',
    title: 'SEBI Saarthi – Investor Education & Mutual Fund Guide',
  },
  {
    uri: 'https://ncfe.org.in/',
    title: 'National Centre for Financial Education (NCFE India)',
  },
];

const TOPIC_GROUNDING_MAP: { keywords: string[]; sources: GroundingSource[] }[] = [
  {
    keywords: ['sip', 'mutual fund', 'index fund', 'etf', 'stock', 'share', 'nifty', 'sensex', 'sebi', 'diversif', 'expense ratio'],
    sources: [
      {
        uri: 'https://investor.sebi.gov.in/',
        title: 'SEBI Investor Portal – Mutual Funds, SIPs & Market Safety',
      },
      {
        uri: 'https://www.amfiindia.com/investor-corner/knowledge-center',
        title: 'AMFI India – Mutual Fund & SIP Knowledge Center',
      },
    ],
  },
  {
    keywords: ['rbi', 'inflation', 'repo', 'interest', 'loan', 'emi', 'fd', 'fixed deposit', 'rd', 'bank', 'upi', 'credit', 'cibil'],
    sources: [
      {
        uri: 'https://www.rbi.org.in/FinancialEducation/Home.aspx',
        title: 'Reserve Bank of India (RBI) – Financial Education',
      },
      {
        uri: 'https://ncfe.org.in/',
        title: 'NCFE India – Banking, Credit & Borrowing Guide',
      },
    ],
  },
  {
    keywords: ['tax', '80c', 'income tax', 'regime', 'ltcg', 'stcg', 'deduction'],
    sources: [
      {
        uri: 'https://incometaxindia.gov.in/',
        title: 'Income Tax Department India – Tax Slabs & Deductions',
      },
      {
        uri: 'https://ncfe.org.in/',
        title: 'NCFE India – Personal Tax & Financial Planning',
      },
    ],
  },
  {
    keywords: ['insurance', 'health insurance', 'term plan', 'life insurance', 'irdai', 'claim', 'medical'],
    sources: [
      {
        uri: 'https://policyholder.gov.in/',
        title: 'IRDAI Policyholder Education – Health & Term Insurance',
      },
      {
        uri: 'https://ncfe.org.in/',
        title: 'NCFE India – Risk Protection & Insurance Basics',
      },
    ],
  },
  {
    keywords: ['retire', 'nps', 'ppf', 'epf', 'pension', 'pfrda', 'fire'],
    sources: [
      {
        uri: 'https://www.pfrda.org.in/',
        title: 'PFRDA – National Pension System (NPS) & Retirement Planning',
      },
      {
        uri: 'https://www.epfindia.gov.in/',
        title: 'EPFO India – Provident Fund & Retirement Savings',
      },
    ],
  },
];

export function selectRelevantGroundingSources(
  userMessage: string,
  replyText = ''
): GroundingSource[] {
  const userLower = userMessage.toLowerCase();
  const matched: GroundingSource[] = [];

  for (const group of TOPIC_GROUNDING_MAP) {
    if (group.keywords.some((kw) => userLower.includes(kw))) {
      for (const src of group.sources) {
        if (!matched.some((m) => m.uri === src.uri)) {
          matched.push(src);
        }
      }
    }
  }

  if (matched.length === 0 && replyText) {
    const replyLower = replyText.toLowerCase();
    for (const group of TOPIC_GROUNDING_MAP) {
      if (group.keywords.some((kw) => replyLower.includes(kw))) {
        for (const src of group.sources) {
          if (!matched.some((m) => m.uri === src.uri)) {
            matched.push(src);
          }
        }
      }
    }
  }

  if (matched.length === 0) {
    return DEFAULT_GROUNDING_SOURCES;
  }
  return matched.slice(0, 3);
}

export function buildDynamicSuggestedReplies(
  userMessage: string,
  replyText = ''
): string[] {
  const matchTopic = (text: string): string[] | null => {
    const q = text.toLowerCase();
    if (q.includes('cibil') || q.includes('credit score') || q.includes('credit card') || q.includes('loan') || q.includes('emi') || q.includes('debt')) {
      return [
        'How can I improve my CIBIL credit score above 750?',
        'Should I prepay my loan or invest extra money in a SIP?',
        'Explain the Debt Avalanche vs. Debt Snowball method with numbers',
      ];
    }
    if (q.includes('insurance') || q.includes('term') || q.includes('health cover') || q.includes('mediclaim') || q.includes('ulip')) {
      return [
        'How much Term Life Insurance cover do I actually need?',
        'Why should I avoid mixing insurance and investment (like ULIPs)?',
        'What should I check before buying a Health Insurance policy?',
      ];
    }
    if (q.includes('inflation') || q.includes('purchasing power') || q.includes('rule of 72')) {
      return [
        'How much will ₹50,000/month expenses cost in 10 years at 6% inflation?',
        'Which investments help beat inflation over 10+ years?',
        'Explain the Rule of 72 for inflation and compounding',
      ];
    }
    if (q.includes('sip') || q.includes('mutual fund') || q.includes('index fund') || q.includes('etf')) {
      return [
        'How much does a ₹5,000/month SIP grow to in 15 years?',
        'What is the difference between an Index Fund and an Active Mutual Fund?',
        'What is Expense Ratio and how does it affect my returns?',
      ];
    }
    if (q.includes('emergency fund') || q.includes('liquid')) {
      return [
        'Where should I keep my emergency fund so it stays safe and liquid?',
        'How many months of expenses should my emergency fund cover?',
        'Once my emergency fund is ready, where should I invest next?',
      ];
    }
    if (q.includes('tax') || q.includes('80c') || q.includes('regime')) {
      return [
        'What is the difference between the Old and New Tax Regime?',
        'How are Mutual Fund gains (LTCG vs STCG) taxed in India?',
        'Compare PPF, ELSS, and NPS for long-term tax-efficient investing',
      ];
    }
    if (q.includes('retire') || q.includes('ppf') || q.includes('nps') || q.includes('epf')) {
      return [
        'How much retirement corpus do I need if my monthly expense is ₹40,000?',
        'Compare PPF vs. NPS vs. Nifty 50 Index Fund for retirement',
        'How does starting 5 years earlier change my retirement corpus?',
      ];
    }
    if (q.includes('stock') || q.includes('share') || q.includes('bond') || q.includes('gold')) {
      return [
        'How should I divide my portfolio between Equity, Debt, and Gold?',
        'Why are individual stocks riskier than a Nifty 50 Index Fund?',
        'How much Gold should I hold in my portfolio?',
      ];
    }
    if (q.includes('budget') || q.includes('save') || q.includes('salary') || q.includes('50/30/20')) {
      return [
        'How do I adapt the 50/30/20 budget if my rent is high?',
        'How do I stop impulse spending on food delivery and shopping?',
        'What is the 50% Raise Rule to beat lifestyle inflation?',
      ];
    }
    return null;
  };

  return (
    matchTopic(userMessage) ||
    matchTopic(replyText) || [
      'Can you show me a step-by-step ₹ calculation for this?',
      'What are the biggest beginner mistakes to avoid here?',
      'Quiz me with 1 practical question on this topic!',
    ]
  );
}

export const FINBUDDY_SYSTEM_INSTRUCTION = `You are FinBuddy, a friendly, intelligent, patient, and interactive AI Financial Literacy Tutor.
Your tagline is: "Learn Money. Build Confidence. Secure Your Future."

CRITICAL INSTRUCTION — ALWAYS GIVE DIRECT, QUESTION-SPECIFIC ANSWERS:
- Answer the user's EXACT question immediately in the first paragraph. NEVER give a generic template response.
- If the user asks about a specific concept (e.g., inflation, CIBIL score, PPF, tax regimes, gold, rent vs. buy, options, emergency fund, FD vs. mutual fund, credit cards, insurance, or a specific ₹ calculation), explain THAT exact concept in detail.
- If the user provides specific numbers (salary, savings, loan amount, interest rate, age, or years), perform the actual math step by step in Indian Rupees (₹) using their exact numbers!

PERSONALIZED TEACHING APPROACH:
1. Address the learner by name if provided, and calibrate depth to their Current Level, Preferred Topic, Difficulty Preference (Beginner, Intermediate, Advanced), and whether "Explain in Simple Language" is ON.
2. Break down concepts into clear sections using Markdown headings (###), bullet points (-), and comparison tables (| Col 1 | Col 2 |) where helpful.
3. Use relatable Indian examples in ₹ (INR)—salaries, rent, groceries, FDs, PPF, NPS, Nifty 50 SIPs, EMIs, and everyday expenses.
4. Provide 3 concise Key Takeaways.
5. End with ONE short, relevant interactive check question about the exact topic you just explained.

SAFETY & FINANCIAL RESPONSIBILITY:
- You are an educational tutor, NOT a licensed financial, tax, or investment advisor.
- Remind learners when discussing equities/mutual funds that market-linked returns are not guaranteed and involve risk.
- Never request OTPs, PINs, passwords, or private bank details.`;

export function generateDemoTutorResponse(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: LearnerContext
): { reply: string; suggestedReplies: string[]; groundingSources: GroundingSource[] } {
  const q = userMessage.toLowerCase().trim();
  const cleanName = context.learnerName ? context.learnerName.trim() : '';
  const nameAddressing = cleanName ? ` ${cleanName}` : '';
  const prevAssistant =
    history.length > 0
      ? [...history].reverse().find((m) => m.role === 'assistant')?.content.toLowerCase() || ''
      : '';

  // Parse any numbers in the user's prompt for dynamic math
  const rawAmounts = [...userMessage.replace(/,/g, '').matchAll(/(?:₹|rs\.?\s*|inr\s*)?(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore|k|thousand)?/gi)];
  const parsedRupeeAmounts: number[] = [];
  for (const m of rawAmounts) {
    const val = parseFloat(m[1]);
    const unit = (m[2] || '').toLowerCase();
    if (isNaN(val)) continue;
    if (unit.startsWith('cr')) parsedRupeeAmounts.push(val * 10000000);
    else if (unit.startsWith('lakh')) parsedRupeeAmounts.push(val * 100000);
    else if (unit === 'k' || unit === 'thousand') parsedRupeeAmounts.push(val * 1000);
    else if (val >= 500) parsedRupeeAmounts.push(val);
  }

  // Follow-up conversation handlers
  if (
    prevAssistant.includes('do you already have an emergency fund') &&
    (q.includes('no') || q.includes('not yet') || q.includes("don't") || q.includes('zero'))
  ) {
    const reply = `That is completely okay${nameAddressing}—almost everyone starts at ₹0! Building your **Emergency Fund** is your #1 financial priority before investing in the stock market.

### 3-Step Plan to Build Your Emergency Fund
- **Step 1 — Set a Starter Target:** Aim for **3 to 6 months of essential living expenses** (rent, groceries, utility bills, EMIs). If 3 months feels big right now, start with a **₹15,000–₹25,000 Mini Safety Buffer** first.
- **Step 2 — Keep It Safe & Liquid:** Park this money in a separate high-interest Savings Account, a Sweep-in Fixed Deposit, or an overnight/liquid fund where you can access it within minutes without penalty.
- **Step 3 — Automate on Salary Day:** Transfer 20% of your income automatically on the 1st or 2nd of every month ("Pay Yourself First").

**Key Takeaways:**
- Emergency funds protect you from taking 36% APR credit card debt or personal loans during medical or job emergencies.
- Never put emergency money into volatile stocks or locked-in assets.

**Quick Question:** What are your approximate monthly essential expenses (rent + food + bills) in ₹ so we can calculate your exact 3-month target?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 1. INFLATION & PURCHASING POWER
  if (q.includes('inflation') || q.includes('purchasing power') || q.includes('price rise') || q.includes('cost of living') || q.includes('rule of 72')) {
    const baseAmount = parsedRupeeAmounts[0] || 50000;
    const years = 10;
    const rate = 6;
    const futureCost = Math.round(baseAmount * Math.pow(1 + rate / 100, years));
    const erodedValue = Math.round(baseAmount / Math.pow(1 + rate / 100, years));

    const reply = `Let's directly answer your question on **Inflation & Purchasing Power**${nameAddressing}!

**Inflation** is the rate at which the general prices of goods and services (groceries, rent, fuel, healthcare, tuition) rise over time. When prices go up, the **purchasing power** of each ₹100 note drops—meaning the same money buys fewer items in the future.

### Practical ₹ Calculation (Using ₹${baseAmount.toLocaleString('en-IN')})
At an average Indian inflation rate of **${rate}% per year** over **${years} years**:
| Scenario | Today's Value | After ${years} Years at ${rate}% Inflation | What It Means |
| :--- | :--- | :--- | :--- |
| **Future Cost of Lifestyle** | ₹${baseAmount.toLocaleString('en-IN')} | **₹${futureCost.toLocaleString('en-IN')}** | You will need ₹${futureCost.toLocaleString('en-IN')} to buy what ₹${baseAmount.toLocaleString('en-IN')} buys today |
| **Idle Cash in Cupboard (0% return)** | ₹${baseAmount.toLocaleString('en-IN')} | **₹${erodedValue.toLocaleString('en-IN')}** (real buying power) | Your idle cash loses ~44% of its real purchasing power in 10 years |

### How to Beat Inflation
- **Real Rate of Return:** Always check your return *after* inflation: $\\text{Real Return} \\approx \\text{Investment Return} - \\text{Inflation Rate}$.
- **Rule of 72 Shortcut:** Divide 72 by the inflation rate ($72 \\div 6 = 12\\text{ years}$) to see how quickly everyday prices double!
- **Actionable Solution:** Keep short-term emergency cash in safe deposits, but invest long-term goals (5–15+ years) in assets like diversified Equity Index Funds or PPF/NPS that aim to outpace inflation.

**Quick Check:** If a Fixed Deposit gives you 6.5% post-tax return while inflation is 6%, are you growing your real purchasing power rapidly, or barely breaking even?`;

    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 2. TAXES / 80C / NEW VS OLD REGIME / LTCG / STCG
  if (q.includes('tax') || q.includes('80c') || q.includes('regime') || q.includes('ltcg') || q.includes('stcg') || q.includes('itr') || q.includes('tds')) {
    const reply = `Here is a clear, practical breakdown of **Income Tax & Investment Taxation in India**${nameAddressing}:

### 1. Old Tax Regime vs. New Tax Regime
| Feature | New Tax Regime (Default) | Old Tax Regime |
| :--- | :--- | :--- |
| **Tax Rates / Slabs** | Lower tax rates with wider slabs & standard deduction | Higher slab rates unless you claim multiple deductions |
| **Deductions Allowed** | Very few (Standard Deduction + employer NPS under 80CCD(2)) | Allows **Section 80C** (up to ₹1.5L in PPF/ELSS/EPF), **80D** (Health Insurance), and **HRA** |
| **Best Suited For** | Beginners & earners who want simplicity without locking money in tax-saving instruments | Earners claiming high HRA + home loan interest + full ₹1.5L 80C + 80D deductions |

### 2. How Investments Are Taxed
- **Fixed Deposits (FD) & RD Interest:** Added to your total income and taxed at your income tax slab rate.
- **PPF (Public Provident Fund):** **EEE (Exempt-Exempt-Exempt)**—contributions (in Old Regime), interest earned, and maturity proceeds are 100% tax-free!
- **Equity Mutual Funds & Stocks:** You only pay capital gains tax when you **sell/redeem** units (Short-Term Capital Gains if held $\\le 12$ months; Long-Term Capital Gains if held $> 12$ months above the annual exemption threshold).

*Note: Always verify current assessment year slab rates on the official Income Tax India portal before filing your ITR.*

**Key Takeaways:**
- Never buy a low-return insurance policy just to save tax—choose investments based on your financial goals first.
- Even under the New Tax Regime, PPF, EPF, and ELSS remain excellent wealth-building tools.

**Interactive Question:** Are you currently choosing investments mainly to build long-term wealth, or are you also looking for Section 80C deductions?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 3. INSURANCE (HEALTH INSURANCE & TERM LIFE INSURANCE)
  if (q.includes('insurance') || q.includes('term plan') || q.includes('term life') || q.includes('health cover') || q.includes('mediclaim') || q.includes('ulip') || q.includes('endowment')) {
    const reply = `Let's cover **Insurance Basics (Health & Term Life Insurance)**${nameAddressing}—because protecting your wealth comes *before* investing!

### The 2 Essential Policies Every Earner Needs
| Insurance Type | Who Needs It | Recommended Coverage Rule | Purpose |
| :--- | :--- | :--- | :--- |
| **1. Health Insurance (Mediclaim)** | Everyone (even if your employer provides corporate cover) | **₹5 Lakh to ₹15 Lakh** base/family floater | Protects your savings from sudden ₹2L–₹5L hospital bills |
| **2. Pure Term Life Insurance** | Anyone whose family depends on their income | **10× to 15× your annual income** (e.g., ₹75L–₹1Cr cover for ₹6L/yr income) | Replaces your income for your family if something happens to you |

### Golden Rule: Never Mix Insurance and Investment
- Avoid traditional endowment/money-back plans or high-fee ULIPs that promise both "insurance + return." They typically provide **too little life cover** and **low returns (4%–5% p.a.)**.
- Instead, buy an affordable **Pure Term Plan** for protection, and invest the remaining money separately in **PPF + Nifty 50 Index Fund SIPs**.

**Key Takeaways:**
- Don't rely solely on employer health insurance—it stops the day you switch jobs or take a career break.
- Always declare pre-existing medical conditions honestly when buying insurance so claims are never rejected.

**Quick Question:** Do you currently have an independent Health Insurance policy outside of your college or employer coverage?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 4. CREDIT SCORE / CIBIL / CREDIT CARDS
  if (q.includes('cibil') || q.includes('credit score') || q.includes('credit card') || q.includes('minimum due')) {
    const reply = `Here is everything you need to know about **Credit Cards & CIBIL Credit Scores**${nameAddressing}:

A **Credit Score (like CIBIL)** is a 3-digit number between **300 and 900** that measures how responsibly you repay borrowed money. A score of **750+** helps you qualify for lower interest rates on future home or education loans.

### How to Use a Credit Card Safely & Boost Your Score to 750+
1. **Always Pay 100% Total Amount Due:** Never fall for the **"Minimum Amount Due" (5%) trap**! If you leave even ₹100 unpaid past the due date, banks revoke your interest-free grace period and charge **36% to 42% annual interest** from Day 1.
2. **Keep Credit Utilization Under 30%:** If your credit card limit is ₹1,00,000, try not to spend more than **₹30,000** in a billing cycle. Using 80%–90% of your limit lowers your credit score.
3. **Never Withdraw Cash at an ATM with a Credit Card:** Cash advances attract hefty upfront fees plus immediate daily interest (~3.5%/month) with zero grace period.

**Key Takeaways:**
- Treat a credit card like a debit card: only spend money you already have in your bank account.
- On-time full payment (35% weight) and low credit utilization (30% weight) are the two biggest drivers of your CIBIL score.

**Quick Check:** If your credit card bill is ₹20,000 and the "Minimum Due" is ₹1,000, what happens if you pay only ₹1,000?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 5. PPF / EPF / NPS / RETIREMENT / FIRE
  if (q.includes('ppf') || q.includes('epf') || q.includes('nps') || q.includes('retire') || q.includes('pension') || q.includes('fire')) {
    const monthlyExpense = parsedRupeeAmounts[0] || 30000;
    const annualExpense = monthlyExpense * 12;
    const fireCorpus = annualExpense * 25;

    const reply = `Let's break down **Retirement Planning, PPF, EPF, and NPS**${nameAddressing}!

### Comparing India's Top Long-Term Retirement Vehicles
| Product | Risk Profile | Lock-In / Horizon | Key Advantage |
| :--- | :--- | :--- | :--- |
| **EPF (Employees' Provident Fund)** | Government-backed (Very Low Risk) | Until retirement (partial withdrawals allowed for specific milestones) | Employer matches 12% of Basic Salary; steady tax-efficient compounding |
| **PPF (Public Provident Fund)** | Sovereign Guarantee (Zero Market Risk) | **15 Years** (extendable in 5-year blocks; min ₹500, max ₹1.5L/year) | **100% Tax-Free (EEE)** interest and maturity value |
| **NPS (National Pension System)** | Regulated by PFRDA (Market-linked Equity + Debt mix) | Until age 60 | Ultra-low fund management fee + automatic lifecycle asset allocation |
| **Equity Index Fund SIP** | Moderate–High (Market-linked) | Flexible (Ideal for 10–25+ years) | High long-term inflation-beating growth potential (*returns not guaranteed*) |

### Illustrative Retirement Number (The 25× Rule)
If your current monthly lifestyle expense is **₹${monthlyExpense.toLocaleString('en-IN')}** (₹${annualExpense.toLocaleString('en-IN')}/year), a standard baseline retirement target in today's money is **25× annual expenses = ₹${fireCorpus.toLocaleString('en-IN')}** (adjusted upward for inflation over the years until you retire).

**Key Takeaways:**
- Combine a safe debt floor (**EPF/PPF**) with a growth engine (**Nifty 50 Index SIP / NPS**) for a balanced retirement plan.
- Starting at age 23 instead of 33 can more than **double** your retirement corpus with the exact same monthly effort.

**Quick Question:** How many years away is your target retirement or financial independence goal?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 6. FIXED DEPOSIT (FD) vs RECURRING DEPOSIT (RD) vs SAVINGS ACCOUNT vs LIQUID FUND
  if (q.includes('fixed deposit') || q.includes(' fd ') || q.startsWith('fd ') || q.endsWith(' fd') || q.includes('recurring deposit') || q.includes(' rd ') || q.includes('liquid fund') || q.includes('savings account')) {
    const reply = `Here is a direct comparison of **Savings Accounts, Fixed Deposits (FD), Recurring Deposits (RD), and Liquid Funds**${nameAddressing}:

| Option | How It Works | Best Used For | Things to Watch Out For |
| :--- | :--- | :--- | :--- |
| **Savings Account** | Instant access via UPI/Debit Card; earns modest interest (~2.7%–4% p.a.) | Monthly bill payments + 1 month of immediate cash buffer | Keeping large sums idle here loses value to ~6% inflation |
| **Fixed Deposit (FD)** | Lock a lump sum (e.g., ₹50,000) for a fixed tenure (7 days to 10 years) at a fixed interest rate | Emergency Fund (via Sweep-in FD) & short-term goals (1–3 years) | Premature withdrawal usually carries a 0.5%–1% interest penalty; interest is taxable |
| **Recurring Deposit (RD)** | Deposit a fixed monthly amount (e.g., ₹3,000/month) for 6 to 60 months at a fixed rate | Saving for a planned 1–2 year expense (laptop, tuition, trip) | Less flexible if you miss monthly installments |
| **Liquid Mutual Fund** | Invests in very short-term government T-bills & money market instruments (up to 91 days) | Parking short-term surplus cash & emergency reserves | Market-linked (very low volatility, not fixed like an FD); redemptions take T+1 business day |

**Key Takeaways:**
- Use **FD/RD/Liquid Funds** for capital safety on goals under **3 years**.
- Do not rely solely on FDs for 15-year wealth building, as post-tax FD returns barely match inflation.

**Quick Question:** Are you looking to park a lump sum you already have, or save a fixed amount every month for a short-term goal?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 7. COMPOUND INTEREST / SIP / MUTUAL FUNDS / INDEX FUNDS / ETFs
  if (q.includes('compound') || q.includes('sip') || q.includes('mutual fund') || q.includes('index fund') || q.includes('etf') || q.includes('expense ratio')) {
    const monthlySip = parsedRupeeAmounts[0] && parsedRupeeAmounts[0] <= 200000 ? parsedRupeeAmounts[0] : 5000;
    const years = 15;
    const annualRate = 12;
    const months = years * 12;
    const r = annualRate / 12 / 100;
    const invested = monthlySip * months;
    const futureValue = Math.round(monthlySip * ((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    const wealthGain = futureValue - invested;

    const simpleAnalogy = context.simpleLanguage
      ? `**Everyday Analogy:** Simple interest is like harvesting mangoes from one tree every summer and eating them all. **Compound interest** is planting the seeds from those mangoes so that in a few years, a whole orchard is growing mangoes for you!\n\n`
      : '';

    const reply = `${simpleAnalogy}Here is how **SIPs, Index Funds, and Compounding** work${nameAddressing}:

A **Systematic Investment Plan (SIP)** lets you invest a fixed amount (even ₹500 or ₹${monthlySip.toLocaleString('en-IN')}) automatically every month into a Mutual Fund or **Index Fund** (which passively tracks India's top companies like the Nifty 50 at a low fee).

### Step-by-Step ₹ SIP Calculation (₹${monthlySip.toLocaleString('en-IN')}/month for ${years} Years)
| Metric | Amount (₹) | Explanation |
| :--- | :--- | :--- |
| **Monthly SIP Investment** | ₹${monthlySip.toLocaleString('en-IN')}/month | Automated over ${months} months (${years} years) |
| **Total Money You Put In** | **₹${invested.toLocaleString('en-IN')}** | Your actual out-of-pocket contribution |
| **Estimated Compounding Gain** | **+₹${wealthGain.toLocaleString('en-IN')}** | Interest earning interest at an illustrative ${annualRate}% p.a. |
| **Total Estimated Corpus** | **₹${futureValue.toLocaleString('en-IN')}** | *Illustrative estimate; equity returns are market-linked and not guaranteed* |

### Active Mutual Fund vs. Index Fund vs. ETF
- **Index Fund:** Tracks an index (like Nifty 50) automatically; low **Expense Ratio** (0.1%–0.3% p.a.); no Demat account required; ideal for SIPs.
- **ETF (Exchange-Traded Fund):** Also tracks an index, but trades live on the stock exchange and requires a Demat + brokerage account.
- **Active Mutual Fund:** A fund manager picks stocks trying to beat the index, charging a higher fee (0.8%–2.0% p.a.).

**Key Takeaways:**
- **Rupee Cost Averaging:** Your SIP automatically buys *more* units when the market dips and *fewer* when it rises.
- **Stay Invested:** Equity SIPs work best over **5 to 15+ years**—never panic-sell during short-term market corrections.

**Quick Check:** If the stock market drops 10% next month, does your ₹${monthlySip.toLocaleString('en-IN')} SIP buy *more* fund units or *fewer* fund units that month?`;

    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 8. STOCKS / BONDS / GOLD / DIVERSIFICATION / ASSET ALLOCATION
  if (q.includes('stock') || q.includes('share') || q.includes('bond') || q.includes('gold') || q.includes('diversif') || q.includes('asset allocation') || q.includes('portfolio') || q.includes('risk')) {
    const reply = `Let's explore **Asset Allocation, Diversification & Comparing Stocks, Bonds, and Gold**${nameAddressing}!

**Diversification** means spreading your money across different asset classes that don't move up and down at the exact same time—so a dip in one market never derails your entire life savings.

### Comparing the 4 Core Asset Classes
| Asset Class | Role in Portfolio | Risk & Volatility | Recommended Allocation Rule of Thumb |
| :--- | :--- | :--- | :--- |
| **1. Cash / Liquid FD** | Emergency safety shield | Near Zero | **3 to 6 months** of essential expenses |
| **2. Equity (Index Funds / Stocks)** | Long-term inflation-beating growth | High in short term; moderates over 7+ yrs | Rough guide: **(100 − Your Age)%** in Equity |
| **3. Debt (PPF / EPF / Bonds / Debt Funds)** | Stability & capital preservation | Low to Moderate | Rough guide: **Your Age%** in Debt/Fixed Income |
| **4. Gold (Gold ETF / Sovereign Gold)** | Hedge against currency & inflation shocks | Moderate | **5% to 10%** of total portfolio |

*Educational Note: Market-linked investments (stocks, equity funds, gold) fluctuate and never guarantee fixed returns.*

**Key Takeaways:**
- Beginners should build their core equity portfolio with diversified **Index Funds / Mutual Funds** before picking individual company stocks.
- Rebalance your portfolio once a year to stay aligned with your target risk level.

**Quick Question:** How many years can you leave your long-term investment untouched before you need to spend it?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 9. LOANS / EMI / DEBT AVALANCHE VS SNOWBALL / RENT VS BUY
  if (q.includes('avalanche') || q.includes('snowball') || q.includes('emi') || q.includes('loan') || q.includes('debt') || q.includes('rent vs buy') || q.includes('home loan')) {
    const loanPrincipal = parsedRupeeAmounts[0] || 500000;
    const rate = 10;
    const years = 5;
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = Math.round((loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPaid = emi * n;
    const totalInterest = totalPaid - loanPrincipal;

    const reply = `Let's break down **Loans, EMIs, and Debt Freedom Strategies**${nameAddressing}!

### 1. Illustrative EMI Breakdown (₹${loanPrincipal.toLocaleString('en-IN')} Loan at ${rate}% p.a. for ${years} Years)
- **Monthly EMI:** **₹${emi.toLocaleString('en-IN')}/month**
- **Total Principal Borrowed:** ₹${loanPrincipal.toLocaleString('en-IN')}
- **Total Interest Paid:** **₹${totalInterest.toLocaleString('en-IN')}**
- **Total Outflow Over ${years} Years:** ₹${totalPaid.toLocaleString('en-IN')}

### 2. Debt Avalanche vs. Debt Snowball (Paying Off Multiple Loans)
| Strategy | How It Works | Why Choose It |
| :--- | :--- | :--- |
| **Debt Avalanche** | Pay minimums on all loans, put 100% extra cash toward the **HIGHEST interest rate** loan first (e.g., 36% credit card before 9% loan) | Mathematically saves the **maximum ₹ in interest** |
| **Debt Snowball** | Pay minimums on all loans, put 100% extra cash toward the **SMALLEST balance** first | Gives fast psychological wins to stay motivated |

**Golden Borrowing Rule (The 30% EMI Cap):**
- Never let all your combined monthly EMIs exceed **30% of your monthly take-home pay**, and never borrow high-interest personal loans for depreciating lifestyle wants.

**Quick Question:** If you have ₹5,000 extra this month, and you owe a 36% credit card bill and a 9% education loan, which one should you pay extra toward first?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 10. NEEDS VS WANTS / ASSETS VS LIABILITIES / IMPULSE SPENDING
  if (q.includes('need') || q.includes('want') || q.includes('asset') || q.includes('liabilit') || q.includes('impulse') || q.includes('lifestyle inflation')) {
    const reply = `Let's master **Needs vs. Wants, Assets vs. Liabilities, and Smart Spending Habits**${nameAddressing}!

| Concept | Plain-English Definition | Practical Indian ₹ Example |
| :--- | :--- | :--- |
| **Need** | Mandatory for health, shelter, and earning your livelihood | House/PG rent (₹10,000), groceries (₹4,500), electricity, work commute, basic health insurance |
| **Want** | Optional comfort, status upgrade, or entertainment | Frequent food delivery orders, upgrading a working phone on EMI, luxury watches |
| **Asset** | Something you own that preserves or grows value over time | Emergency savings deposit, PPF account, Nifty 50 Index Fund SIP, career skills |
| **Liability** | Any debt or obligation that drains future income via interest | Credit card revolving balance (36%–42% p.a.), personal loan EMI, BNPL dues |

### 2 Proven Habits to Stop Impulse Spending & Lifestyle Creep
1. **The 72-Hour Rule:** Whenever you feel tempted to buy a non-essential Want costing over ₹2,000, wait **72 hours** before paying. Roughly 70% of impulse urges fade away!
2. **The 50% Raise Rule:** Whenever your salary increases (e.g., +₹10,000/month), immediately lock **50% (₹5,000)** into your automated SIP/savings and enjoy the remaining 50% guilt-free.

**Quick Check:** If you buy a ₹60,000 smartphone using an 18% personal loan EMI when your current phone works fine, is that phone acting as an Asset or a Want financed by a Liability?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 11. SCAMS / PONZI / DIGITAL SAFETY / UPI FRAUD
  if (q.includes('scam') || q.includes('fraud') || q.includes('ponzi') || q.includes('phishing') || q.includes('upi') || q.includes('otp') || q.includes('double money')) {
    const reply = `Protecting your hard-earned money from **Financial Scams & Digital Fraud** is critical${nameAddressing}!

### Top 4 Red Flags of a Financial Scam
1. **"Guaranteed High Returns" (Ponzi Schemes):** Any WhatsApp/Telegram group or app promising *"Guaranteed 5% weekly returns"* or *"Double your money in 60 days"* is 100% fraudulent. Even the best regulated stock investments never guarantee fixed high returns.
2. **Fake `.apk` Trading Apps & "VIP" Groups:** Scammers show fake profit screenshots on cloned apps and then demand an "activation/tax fee" when you try to withdraw your own money.
3. **UPI Collect Request & QR Code Traps:** Remember this iron rule: **You NEVER need to enter your UPI PIN to RECEIVE money.** Entering your UPI PIN *always* deducts money from your account.
4. **Fake KYC / Screen-Sharing Calls:** Banks, RBI, and SEBI will never ask for your OTP, CVV, UPI PIN, or ask you to install screen-sharing apps (like AnyDesk).

**What To Do If Targeted:**
- Never transfer money to unknown personal accounts for "stock tips."
- Report cyber financial fraud immediately on the official National Cyber Crime Helpline (**1930** or ` + '`cybercrime.gov.in`' + `).

**Quick Question:** If a buyer on an online marketplace sends you a QR code and tells you to scan it and enter your UPI PIN to "receive ₹5,000," what will actually happen?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 12. BUDGETING / SALARY / SAVING (50/30/20 Rule)
  if (
    q.includes('30,000') ||
    q.includes('30000') ||
    q.includes('budget') ||
    q.includes('50/30/20') ||
    q.includes('earn') ||
    q.includes('salary') ||
    q.includes('income') ||
    q.includes('save') ||
    q.includes('saving')
  ) {
    const income = parsedRupeeAmounts[0] && parsedRupeeAmounts[0] >= 3000 ? parsedRupeeAmounts[0] : 30000;
    const needs50 = Math.round(income * 0.5);
    const wants30 = Math.round(income * 0.3);
    const needs60 = Math.round(income * 0.6);
    const wants20 = Math.round(income * 0.2);
    const savings20 = Math.round(income * 0.2);
    const emergency3m = needs60 * 3;

    const reply = `Here is a tailored **Monthly Budget & Savings Plan** for a **₹${income.toLocaleString('en-IN')}** monthly income${nameAddressing}:

### Comparing Classic 50/30/20 vs. Practical 60/20/20 Split
| Budget Bucket | Classic 50/30/20 | Practical High-Rent Split (60/20/20) | What Goes Here |
| :--- | :--- | :--- | :--- |
| **1. Essential Needs** | ₹${needs50.toLocaleString('en-IN')} (50%) | **₹${needs60.toLocaleString('en-IN')} (60%)** | Rent, groceries, electricity, commute, basic bills |
| **2. Personal Wants** | ₹${wants30.toLocaleString('en-IN')} (30%) | **₹${wants20.toLocaleString('en-IN')} (20%)** | Dining out, shopping, movies, hobbies |
| **3. Savings & Goals** | ₹${savings20.toLocaleString('en-IN')} (20%) | **₹${savings20.toLocaleString('en-IN')} (20%)** | Emergency fund first, then SIP / PPF / goals |

### Your 3-Step Action Plan on ₹${income.toLocaleString('en-IN')}/month
1. **Pay Yourself First on Salary Day:** On the 1st or 2nd of the month, automatically transfer **₹${savings20.toLocaleString('en-IN')}** into a separate savings account *before* you start spending.
2. **Build Your 3-Month Emergency Shield:** With essential needs of ~₹${needs60.toLocaleString('en-IN')}/month, your 3-month Emergency Fund target is **₹${emergency3m.toLocaleString('en-IN')}**.
3. **Start a Long-Term SIP:** Once your emergency buffer is underway, direct ₹2,000–₹${Math.round(savings20 * 0.6).toLocaleString('en-IN')}/month into a diversified Index Fund SIP or PPF.

Before we continue, tell me: **Do you already have an emergency fund?**`;

    return {
      reply,
      suggestedReplies: [
        'No, I do not have an emergency fund yet',
        'Yes, I already have an emergency fund',
        `How much will ₹${Math.round(savings20 * 0.5).toLocaleString('en-IN')}/month SIP grow to in 10 years?`,
      ],
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 13. CHECK GLOSSARY TERMS & LESSONS FOR DIRECT MATCH
  const matchedGlossary = GLOSSARY_TERMS.find(
    (g) => q.includes(g.term.toLowerCase()) || g.term.toLowerCase().includes(q)
  );
  if (matchedGlossary) {
    const reply = `Let's break down **${matchedGlossary.term}** (${matchedGlossary.category})${nameAddressing}:

### Plain-English Meaning
${matchedGlossary.simpleDefinition}

### Practical Indian ₹ Example
- ${matchedGlossary.indianExample}

### Why This Matters for Your Finances
- Understanding **${matchedGlossary.term}** helps you make confident decisions aligned with your **${context.level}** learning path and goal (*${context.goal}*).

**Quick Check:** Would you like to see a step-by-step ₹ calculation showing how **${matchedGlossary.term}** works over 5 to 10 years?`;
    return {
      reply,
      suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  const matchedLesson = LESSONS.find((l) =>
    l.title.toLowerCase().split(/\s+/).some((word) => word.length > 4 && q.includes(word))
  );
  if (matchedLesson) {
    const reply = `Here is a focused breakdown on **${matchedLesson.title}**${nameAddressing}:

${matchedLesson.plainExplanation.map((p) => `- ${p}`).join('\n\n')}

### Practical Indian ₹ Example: ${matchedLesson.indianExample.title}
- **Scenario:** ${matchedLesson.indianExample.scenario}
- **Outcome:** ${matchedLesson.indianExample.calculationOrOutcome}

### Key Takeaways
${matchedLesson.keyTakeaways.map((k) => `- ${k}`).join('\n')}

**Interactive Question:** ${matchedLesson.interactiveCheck.question}`;
    return {
      reply,
      suggestedReplies: matchedLesson.interactiveCheck.options.slice(0, 3),
      groundingSources: selectRelevantGroundingSources(userMessage, reply),
    };
  }

  // 14. DYNAMIC TOPIC-AWARE SYNTHESIS FOR ANY OTHER QUESTION
  const amountExample = parsedRupeeAmounts[0] || 10000;
  const tenYearCompounded = Math.round(amountExample * Math.pow(1.1, 10));
  const reply = `Great question about **"${userMessage.trim()}"**${nameAddressing}! Let's break this down clearly in plain English with an Indian ₹ perspective.

### 1. Direct Answer & How It Works
When evaluating **${userMessage.trim()}**, financial educators look at three core factors: **Safety (Risk)**, **Liquidity (how fast you can access your cash)**, and **Real Return (growth after ~6% inflation and taxes)**.
- **Short-Term Impact (0–3 Years):** Focus on capital protection and liquidity so unexpected expenses never force you into debt.
- **Long-Term Impact (5–15+ Years):** Focus on compounding growth so your money grows faster than rising prices.

### 2. Practical ₹ Illustration (With ₹${amountExample.toLocaleString('en-IN')})
| Approach | After 1 Year | After 10 Years | Risk & Suitability |
| :--- | :--- | :--- | :--- |
| **Idle Cash (0% return)** | ₹${amountExample.toLocaleString('en-IN')} | ₹${amountExample.toLocaleString('en-IN')} *(loses ~44% buying power to inflation)* | Zero growth; eroded by inflation |
| **Safe Deposit / FD (~6.5% p.a.)** | ₹${Math.round(amountExample * 1.065).toLocaleString('en-IN')} | ₹${Math.round(amountExample * Math.pow(1.065, 10)).toLocaleString('en-IN')} | High safety; ideal for 1–3 year goals & emergency fund |
| **Long-Term Compounding (~10% p.a. illustrative)** | ₹${Math.round(amountExample * 1.1).toLocaleString('en-IN')} | **₹${tenYearCompounded.toLocaleString('en-IN')}** | Market-linked (*not guaranteed*); suited for 7+ year goals |

### Key Takeaways
- Always match any financial decision to your **time horizon** and **risk comfort** (${context.level} level).
- Keep 3–6 months of expenses in a liquid Emergency Fund before taking market risk.
- Verify live rates, charges, and tax rules on official portals (RBI, SEBI, Income Tax India).

**Quick Question:** Are you planning this decision for a short-term need (under 3 years) or a long-term wealth goal (5+ years)?`;

  return {
    reply,
    suggestedReplies: buildDynamicSuggestedReplies(userMessage, reply),
    groundingSources: selectRelevantGroundingSources(userMessage, reply),
  };
}
