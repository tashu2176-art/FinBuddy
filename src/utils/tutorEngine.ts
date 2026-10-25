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

export const FINBUDDY_SYSTEM_INSTRUCTION = `You are FinBuddy, a friendly, intelligent, patient, and interactive AI Financial Literacy Tutor.
Your tagline is: "Learn Money. Build Confidence. Secure Your Future."

FOLLOW THIS PERSONALIZED TEACHING APPROACH:
1. Address the learner by name if provided, and adapt to their current knowledge level, preferred focus topic, difficulty preference (Beginner, Intermediate, Advanced), learning goal, and whether "Explain in Simple Language" mode is enabled.
2. Divide complex subjects into small, easy-to-understand explanations.
3. Explain every concept in plain English, avoiding unnecessary jargon (or immediately defining any financial term you use).
4. Use relatable Indian examples involving salaries in ₹ (INR), groceries, rent, savings, SIPs, and everyday purchases.
5. Provide a concrete practical example for each major concept.
6. Ask ONE interactive follow-up question at the end of your response to check understanding or personalize the next step.
7. Give encouraging, non-judgmental feedback. When a learner struggles or asks to explain differently, use an everyday analogy (like a kitchen tiffin, water tank, or cricket match) instead of repeating the same explanation.
8. Include 3 to 5 bullet-point key takeaways when explaining a core lesson.

SAFETY & FINANCIAL RESPONSIBILITY RULES:
- You are an educational tutor, NOT a licensed financial, tax, legal, or investment advisor.
- Explain financial concepts without guaranteeing profits or financial outcomes. Clearly state that market-linked returns (stocks, mutual funds, ETFs) are NOT guaranteed and involve risk.
- Distinguish general financial education from personalized investment recommendations.
- Never encourage borrowing money to make speculative investments.
- Never request passwords, OTPs, PINs, CVVs, or complete banking credentials.
- Do not fabricate financial data, current interest rates, tax slabs, or government rules; encourage verifying live rates with official sources.`;

export function generateDemoTutorResponse(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: LearnerContext
): { reply: string; suggestedReplies: string[]; groundingSources: GroundingSource[] } {
  const q = userMessage.toLowerCase().trim();
  const cleanName = context.learnerName ? context.learnerName.trim() : '';
  const nameAddressing = cleanName ? ` ${cleanName}` : '';
  const nameGreeting = cleanName ? `${cleanName}, ` : '';
  const prevAssistant =
    history.length > 0
      ? [...history].reverse().find((m) => m.role === 'assistant')?.content.toLowerCase() || ''
      : '';

  // Check if user is answering the Emergency Fund follow-up question from the ₹30,000 salary example
  if (
    prevAssistant.includes('do you already have an emergency fund') &&
    (q.includes('no') || q.includes('not yet') || q.includes("don't") || q.includes('zero'))
  ) {
    return {
      reply: `That is completely okay—almost everyone starts at ₹0! Building your Emergency Fund is your **#1 financial superpower**.

Here is a simple 3-step game plan to build your safety shield:

- **Step 1 — Pick Your Starter Target:** If your essential monthly needs (rent, groceries, bills) are around ₹18,000, a 3-month emergency buffer is **₹54,000**. If ₹54,000 feels big right now, aim for a **Mini-Starter Buffer of ₹15,000 first**.
- **Step 2 — Open a Separate Safe Bucket:** Keep this money in a separate high-interest Savings Account or a Sweep-in Fixed Deposit (FD) so you don't accidentally spend it on UPI orders.
- **Step 3 — Automate on Salary Day:** Transfer ₹5,000 to ₹6,000 on the 2nd of every month right after your salary arrives. In 3 months, you'll have ₹15,000–₹18,000 saved!

**Key Takeaways:**
- Emergency funds protect you from taking costly loans during medical or job emergencies.
- Keep emergency money 100% safe and liquid—never in volatile stocks.
- Automate the transfer on salary day ("Pay Yourself First").

Before we move to the next step, tell me: **Which date of the month does your salary or income usually arrive?**`,
      suggestedReplies: [
        'On the 1st of every month',
        'Around the 7th of the month',
        'Where should I park my emergency fund safely?',
      ],
      groundingSources: DEFAULT_GROUNDING_SOURCES,
    };
  }

  if (
    prevAssistant.includes('do you already have an emergency fund') &&
    (q.includes('yes') || q.includes('have one') || q.includes('already have'))
  ) {
    return {
      reply: `Fantastic! Having an emergency fund puts you ahead of most beginners and gives you true peace of mind.

Since your safety net is in place, you are ready to put your monthly ₹6,000+ savings toward **goal-based wealth building**:

| Goal Timeline | Example Goal | Suitable Educational Options |
| :--- | :--- | :--- |
| **Short-Term (1–3 yrs)** | Buying a laptop, bike, or course | Recurring Deposit (RD), Fixed Deposit (FD), or Liquid Debt Fund |
| **Medium-Term (3–7 yrs)** | Higher education or home down payment | Conservative Hybrid Fund + PPF / FD mix |
| **Long-Term (7+ yrs)** | Retirement & long-term wealth | Diversified Nifty 50 Index Fund SIP + PPF / EPF / NPS |

*Note: Market-linked investments like mutual funds do not guarantee returns and carry short-term risk, which is why matching your time horizon is essential.*

**Your next question:** What is the #1 financial goal you want to save for over the next 3 to 5 years?`,
      suggestedReplies: [
        'How does a monthly SIP in an Index Fund work?',
        'Explain PPF vs ELSS vs NPS for long-term saving',
        'I want to save ₹3 Lakh in 3 years',
      ],
      groundingSources: DEFAULT_GROUNDING_SOURCES,
    };
  }

  // Exact match or salary saving question (e.g. "I earn ₹30,000 per month. How can I start saving?")
  const salaryMatch = userMessage.replace(/,/g, '').match(/(?:₹|rs\.?|inr|\b)(\d{4,7})\b/i);
  if (
    q.includes('30,000') ||
    q.includes('30000') ||
    ((q.includes('earn') || q.includes('salary') || q.includes('income')) &&
      (q.includes('save') || q.includes('saving') || q.includes('budget')))
  ) {
    const detectedIncome = salaryMatch ? Number(salaryMatch[1]) : 30000;
    const income = detectedIncome >= 5000 && detectedIncome <= 5000000 ? detectedIncome : 30000;
    const needs = Math.round(income * 0.6);
    const wants = Math.round(income * 0.2);
    const savings = Math.round(income * 0.2);

    return {
      reply: `Great question${nameAddressing}! Let's make your money work better for you.

Suppose your monthly salary is **₹${income.toLocaleString('en-IN')}**. Here is an illustrative budget tailored for your **${context.level}** difficulty preference:

- **Essential expenses (60%):** ₹${needs.toLocaleString('en-IN')} *(rent, groceries, electricity, transport)*
- **Lifestyle and personal spending (20%):** ₹${wants.toLocaleString('en-IN')} *(dining out, shopping, entertainment)*
- **Savings and financial goals (20%):** ₹${savings.toLocaleString('en-IN')} *(emergency fund & future investments)*

This is only an example. Your actual budget should reflect your rent, family responsibilities, debt, and other needs.

**Your first lesson:** Try tracking your expenses for 30 days and transfer your ₹${savings.toLocaleString('en-IN')} savings on the very day your salary arrives ("Pay Yourself First").

Before we continue, tell me: **Do you already have an emergency fund?**`,
      suggestedReplies: [
        'No, I do not have an emergency fund yet',
        'Yes, I already have an emergency fund',
        'How do I track expenses easily for 30 days?',
      ],
      groundingSources: DEFAULT_GROUNDING_SOURCES,
    };
  }

  // Compound Interest / SIP
  if (q.includes('compound') || q.includes('sip') || q.includes('mutual fund') || q.includes('index fund')) {
    const simpleNote = context.simpleLanguage
      ? `**Simple Analogy:** Think of Simple Interest like planting a mango tree that gives you 10 mangoes every summer, which you eat right away. **Compound Interest** is when you plant the seeds from those 10 mangoes too—soon you have a whole orchard producing mangoes for you!\n\n`
      : '';
    return {
      reply: `${simpleNote}Let's break down **SIPs and the Power of Compounding**${nameAddressing ? ` for you,${nameAddressing}` : ''} at a **${context.level}** level!

A **Systematic Investment Plan (SIP)** is simply a method of investing a fixed amount (even ₹500 or ₹3,000) every month into a Mutual Fund or Index Fund instead of waiting to save a huge lump sum.

### Practical ₹ Example (Illustrative)
Suppose you invest **₹5,000 per month** in a diversified Nifty 50 Index Fund for **15 years**:
- **Total money you put in:** ₹9,00,000 (₹5,000 × 180 months)
- **Illustrative value at 12% p.a. compounded:** ~**₹25,22,880**
- **Wealth created by compounding:** ~**₹16,22,880** *(more than your own contribution!)*

*Important Educational Note: Equity mutual fund returns are market-linked and NOT guaranteed. Markets go up and down in the short term, which is why equity SIPs are best suited for long-term goals of 5 to 10+ years.*

**3 Key Takeaways:**
- **Rupee Cost Averaging:** A monthly SIP automatically buys more fund units when the market falls and fewer when the market rises.
- **Low Cost Matters:** Check the fund's **Expense Ratio** (annual fee)—index funds often charge just 0.1%–0.3% per year.
- **Start Early:** Starting 5 years earlier often builds more wealth than doubling your monthly amount later.

**Quick check for you:** If the stock market drops by 10% next month, should a long-term SIP investor (with a 10-year goal) panic and stop their SIP, or continue automatically?`,
      suggestedReplies: [
        'Continue the SIP so it buys more units at lower prices!',
        'Stop the SIP immediately',
        'What is the difference between an Index Fund and a regular Mutual Fund?',
      ],
      groundingSources: DEFAULT_GROUNDING_SOURCES,
    };
  }

  // Needs vs Wants / Assets vs Liabilities
  if (q.includes('need') || q.includes('want') || q.includes('asset') || q.includes('liabilit')) {
    return {
      reply: `Great topic${nameAddressing}! Mastering **Needs vs. Wants** and **Assets vs. Liabilities** is the foundation of financial confidence.

| Concept | Plain-English Meaning | Practical ₹ Example |
| :--- | :--- | :--- |
| **Need** | Essential for living, health, and earning income | Rent (₹10,000), groceries (₹4,000), electricity, basic commute |
| **Want** | Optional comfort or entertainment | Weekend dining out (₹1,500), upgrading a working phone |
| **Asset** | Something you own that holds or grows value | Emergency savings deposit, Nifty 50 Index Fund SIP |
| **Liability** | Money you owe that charges interest | High-interest consumer loan or EMI |

**Key Takeaways:**
- Cover your **Needs** first, save 20% toward **Assets**, and enjoy **Wants** debt-free with the remainder.
- Wait 72 hours before buying an expensive Want to avoid impulse spending.

**Interactive check:** If you buy a ₹50,000 television using a 18% personal loan EMI, is that loan an Asset or a Liability?`,
      suggestedReplies: [
        'It is a Liability because it charges 18% interest',
        'I earn ₹30,000 per month. How can I start saving?',
        'How do Debt Avalanche vs. Debt Snowball payoff methods work?',
      ],
      groundingSources: DEFAULT_GROUNDING_SOURCES,
    };
  }

  // Debt Avalanche vs Snowball / Loans
  if (
    q.includes('avalanche') ||
    q.includes('snowball') ||
    q.includes('emi') ||
    q.includes('loan') ||
    q.includes('debt')
  ) {
    return {
      reply: `Understanding **Debt Payoff Strategies**${nameAddressing ? `,${nameAddressing},` : ''} can save you thousands of rupees in unnecessary interest!

### How to Pay Off Multiple Loans Faster
| Strategy | How It Works | Best For |
| :--- | :--- | :--- |
| **Debt Avalanche** | Pay minimums on all loans, put 100% extra cash toward the loan with the **HIGHEST interest rate** (e.g., 36% APR) | Saving the maximum ₹ in total interest |
| **Debt Snowball** | Pay minimums on all loans, put 100% extra cash toward the **SMALLEST balance** first | Quick psychological wins & motivation |

**Key Takeaways:**
- Always pay required minimum installments on every loan on time.
- Direct all extra monthly savings toward your highest-interest debt first (**Debt Avalanche**) for the fastest mathematical payoff.
- Avoid borrowing high-interest loans for short-term lifestyle wants.

**Interactive Question:** Suppose you have a ₹25,000 debt at 36% interest and a ₹1,00,000 vehicle loan at 11% interest. Which one should you clear first to save the most money?`,
      suggestedReplies: [
        'The ₹25,000 debt at 36% interest (Debt Avalanche)',
        'I earn ₹30,000 per month. How can I start saving?',
        'Explain Compound Interest & SIPs with an example',
      ],
      groundingSources: DEFAULT_GROUNDING_SOURCES,
    };
  }

  // Default personalized educational response
  const focusLabel = context.preferredTopic || 'Budgeting & Saving';
  const currentLvlLabel = context.currentLevel || 'New to Finance';
  return {
    reply: `I'd love to help you master that${nameAddressing}! As **FinBuddy**, I've tailored this explanation to your profile (**Current Level:** ${currentLvlLabel} · **Focus Topic:** ${focusLabel} · **Difficulty Preference:** ${context.level}).

Here is how we can explore **"${userMessage}"** step by step:

1. **Core Principle:** Every healthy financial decision starts with protecting your downside first (budgeting, building a 3–6 month emergency fund, and avoiding high-interest debt) before taking calculated long-term risk to beat inflation.
2. **Practical ₹ Rule of Thumb:**
   - **50%–60% Needs:** Rent, groceries, utility bills, essential travel.
   - **20%–30% Wants:** Dining out, hobbies, shopping—guilt-free once savings are done!
   - **20%+ Savings & Investing:** Emergency fund first (3–6 months of expenses in a safe liquid account), followed by long-term goals (diversified Index Fund SIPs).
3. **Safety First:** Never fall for "guaranteed high return" schemes, and never share OTPs or private credentials.

To tailor our next mini-lesson specifically for you, ${nameGreeting}**what monthly income or savings goal in ₹ would you like us to plan around?**`,
    suggestedReplies: [
      'I earn ₹30,000 per month. How can I start saving?',
      'Explain Compound Interest & SIPs with an example',
      'What is the difference between Needs vs. Wants and Assets vs. Liabilities?',
      'How do Debt Avalanche vs. Debt Snowball payoff methods work?',
    ],
    groundingSources: DEFAULT_GROUNDING_SOURCES,
  };
}
