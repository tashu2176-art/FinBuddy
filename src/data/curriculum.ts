export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TopicId =
  | 'money-fundamentals'
  | 'budgeting-saving'
  | 'investing-fundamentals'
  | 'financial-planning';

export interface ComparisonTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface InteractiveCheck {
  question: string;
  options: string[];
  correctIndex: number;
  correctFeedback: string;
  incorrectFeedback: string;
  alternateExplanation: string;
}

export interface Lesson {
  id: string;
  topicId: TopicId;
  topicTitle: string;
  title: string;
  level: DifficultyLevel;
  durationMinutes: number;
  summary: string;
  plainExplanation: string[];
  indianExample: {
    title: string;
    scenario: string;
    calculationOrOutcome: string;
  };
  comparisonTable?: ComparisonTable;
  interactiveCheck: InteractiveCheck;
  keyTakeaways: string[];
  nextRecommendedLessonId: string;
}

export interface TopicModule {
  id: TopicId;
  code: string;
  title: string;
  subtitle: string;
  subtopics: string[];
}

export interface QuizQuestion {
  id: string;
  topicId: TopicId;
  level: DifficultyLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  recommendedLessonId: string;
}

export interface ScenarioChoice {
  id: string;
  label: string;
  outcomeTitle: string;
  financialImpact: string;
  isOptimal: boolean;
  finBuddyCoaching: string;
}

export interface ScenarioSimulation {
  id: string;
  title: string;
  persona: string;
  level: DifficultyLevel;
  monthlyIncomeINR: string;
  situation: string;
  question: string;
  choices: ScenarioChoice[];
  keyLessonTakeaway: string;
  relatedLessonId: string;
}

export interface GlossaryItem {
  term: string;
  category: string;
  simpleDefinition: string;
  indianExample: string;
}

export interface DailyLesson {
  id: string;
  dayLabel: string;
  title: string;
  category: string;
  readTime: string;
  hook: string;
  coreConcept: string;
  actionStep: string;
  quickQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const QUICK_START_CHOICES = [
  {
    id: 'qs-1',
    number: '01',
    title: 'Learn the basics of money',
    description: 'Needs vs. wants, inflation, simple & compound interest, and time value of money.',
    targetTab: 'learn' as const,
    targetTopic: 'money-fundamentals' as TopicId,
    targetLessonId: 'lesson-needs-wants',
  },
  {
    id: 'qs-2',
    number: '02',
    title: 'Create a budget and start saving',
    description: 'Master the 50/30/20 rule, emergency funds, and 30-day expense tracking on any salary.',
    targetTab: 'learn' as const,
    targetTopic: 'budgeting-saving' as TopicId,
    targetLessonId: 'lesson-budget-50-30-20',
  },
  {
    id: 'qs-3',
    number: '03',
    title: 'Explore investing fundamentals',
    description: 'Saving vs. investing, mutual funds, index funds, SIP compounding, and asset allocation.',
    targetTab: 'learn' as const,
    targetTopic: 'investing-fundamentals' as TopicId,
    targetLessonId: 'lesson-saving-vs-investing',
  },
  {
    id: 'qs-4',
    number: '04',
    title: 'Plan goals and eliminate debt',
    description: 'Short-, medium-, and long-term goals, Debt Avalanche vs. Snowball, and scam awareness.',
    targetTab: 'learn' as const,
    targetTopic: 'financial-planning' as TopicId,
    targetLessonId: 'lesson-goals-debt-scams',
  },
  {
    id: 'qs-5',
    number: '05',
    title: 'Test your skills with quizzes & scenarios',
    description: 'Practice real-world financial decisions and interactive multiple-choice quizzes.',
    targetTab: 'quizzes' as const,
    targetTopic: 'money-fundamentals' as TopicId,
    targetLessonId: 'lesson-needs-wants',
  },
  {
    id: 'qs-6',
    number: '06',
    title: 'Ask me any financial question',
    description: 'Chat with FinBuddy in simple, everyday language and get step-by-step guidance.',
    targetTab: 'ask' as const,
    targetTopic: 'budgeting-saving' as TopicId,
    targetLessonId: 'lesson-budget-50-30-20',
  },
];

export const TOPIC_MODULES: TopicModule[] = [
  {
    id: 'money-fundamentals',
    code: 'Module A',
    title: 'Money Fundamentals',
    subtitle: 'How money works, inflation, purchasing power, and the magic of compounding.',
    subtopics: [
      'What money is & how it works',
      'Needs versus wants',
      'Income, expenses, assets & liabilities',
      'Inflation & purchasing power',
      'Simple vs. compound interest',
      'The time value of money',
    ],
  },
  {
    id: 'budgeting-saving',
    code: 'Module B',
    title: 'Budgeting and Saving',
    subtitle: 'Practical monthly routines to control expenses and build an unshakeable safety net.',
    subtopics: [
      'Creating a monthly budget',
      '50/30/20 rule & its limitations',
      'Building a 3–6 month emergency fund',
      'Saving goals & 30-day expense tracking',
      'Managing lifestyle inflation',
      'Building consistent saving habits',
    ],
  },
  {
    id: 'investing-fundamentals',
    code: 'Module C',
    title: 'Investing Fundamentals',
    subtitle: 'Grow long-term wealth responsibly while understanding risk, fees, and diversification.',
    subtopics: [
      'Difference between saving & investing',
      'Risk and return trade-off',
      'Stocks, bonds, mutual funds, ETFs & index funds',
      'SIPs & the power of compounding',
      'Diversification & asset allocation',
      'Liquidity, fees, taxes & retirement basics',
    ],
  },
  {
    id: 'financial-planning',
    code: 'Module D',
    title: 'Financial Planning and Wealth Habits',
    subtitle: 'Goal-based planning, debt freedom, scam awareness, and lifelong money discipline.',
    subtopics: [
      'Short-, medium- & long-term financial goals',
      'Managing & eliminating high-interest debt',
      'Planning for education, housing & retirement',
      'Avoiding impulsive spending',
      'Recognizing financial scams & unrealistic return promises',
    ],
  },
];

export const LESSONS: Lesson[] = [
  // MODULE A: MONEY FUNDAMENTALS
  {
    id: 'lesson-needs-wants',
    topicId: 'money-fundamentals',
    topicTitle: 'Money Fundamentals',
    title: 'Needs vs. Wants & Assets vs. Liabilities',
    level: 'Beginner',
    durationMinutes: 5,
    summary: 'Learn how to distinguish essential expenses from lifestyle upgrades, and why assets put money in your pocket while liabilities take it out.',
    plainExplanation: [
      'Money is a medium of exchange and a store of value. Every rupee that enters your account gives you a choice: spend it today on essentials, spend it on lifestyle desires, or build assets that protect your future.',
      'A "Need" is something essential for survival, health, and earning a living—such as house rent, basic groceries, electricity, school/college fees, commuting, and basic health protection. A "Want" is something that improves comfort or entertainment—such as weekend dining out, OTT subscriptions, or upgrading a working smartphone.',
      'Similarly, an "Asset" is something you own that holds value or generates future income (like an emergency savings deposit, retirement fund, or equity index fund). A "Liability" is a financial obligation you owe to others (like an unpaid credit balance, personal loan, or buy-now-pay-later EMI).',
    ],
    indianExample: {
      title: 'Aarav’s First Month in Pune (Salary: ₹28,000)',
      scenario: 'Aarav earns ₹28,000/month. His PG rent + mess food is ₹10,000, bus/metro pass is ₹1,200, and mobile recharge is ₹300. He is tempted to buy a ₹45,000 gaming phone on a 12-month EMI of ₹4,100/month.',
      calculationOrOutcome: 'Aarav’s core Needs total ₹11,500. The gaming phone is a Want financed through a Liability (EMI) that would lock up 15% of his take-home pay for a whole year. Instead, saving ₹4,000/month for 4 months lets him buy a reliable ₹16,000 phone debt-free!',
    },
    comparisonTable: {
      caption: 'Comparing Financial Building Blocks',
      headers: ['Category', 'Plain Meaning', 'Everyday Examples'],
      rows: [
        ['Need', 'Essential for living & working safely', 'Rent, dal-rice/vegetables, electricity bill, essential commute'],
        ['Want', 'Nice-to-have lifestyle comfort', 'Food delivery orders, branded sneakers, multiplex movie tickets'],
        ['Asset', 'Puts money in your pocket / grows value', 'Emergency savings deposit, Nifty 50 Index Fund, skill certifications'],
        ['Liability', 'Takes money out of your pocket via interest', 'High-interest debt (36%–42% p.a.), personal loan EMI, BNPL dues'],
      ],
    },
    interactiveCheck: {
      question: 'Priya uses a working 2-year-old laptop for her job, but takes a 16% personal loan to buy an ₹85,000 luxury smartwatch. How should FinBuddy classify this purchase?',
      options: [
        'A Need and an Asset',
        'A Want financed by a Liability',
        'A Need financed by an Asset',
        'A long-term wealth investment',
      ],
      correctIndex: 1,
      correctFeedback: 'Spot on! A luxury smartwatch is a lifestyle Want, and borrowing at 16% interest creates a Liability that drains future monthly income.',
      incorrectFeedback: 'Not quite! Because Priya already has working tools for her job, a luxury smartwatch is a discretionary "Want", and taking a loan for it creates a "Liability".',
      alternateExplanation: 'Think of it this way: if an item is not required for survival or earning your livelihood, it is a Want. And whenever you owe EMI + interest on something that loses value the day you open the box, it acts as a Liability.',
    },
    keyTakeaways: [
      'Needs are mandatory for health, shelter, and work; Wants are optional comforts.',
      'Assets build your net worth over time; Liabilities require you to pay interest out of future income.',
      'Wait 72 hours before buying an expensive Want—often the urge passes.',
      'Never use high-interest Liabilities to pay for short-lived Wants.',
    ],
    nextRecommendedLessonId: 'lesson-inflation-compounding',
  },
  {
    id: 'lesson-inflation-compounding',
    topicId: 'money-fundamentals',
    topicTitle: 'Money Fundamentals',
    title: 'Inflation, Purchasing Power & Compound Interest',
    level: 'Beginner',
    durationMinutes: 6,
    summary: 'Understand why ₹100 buys less over time due to inflation, and how compound interest helps your savings outpace rising prices.',
    plainExplanation: [
      'Inflation is the gradual rise in the prices of everyday goods and services over time. As prices rise, the "purchasing power" of each rupee falls—meaning ₹1,000 stored in a cupboard today will buy fewer groceries 10 years from now.',
      'Simple Interest pays interest only on your original principal amount: Simple Interest = (Principal × Rate × Time) / 100. Compound Interest, by contrast, pays "interest on your interest"—every year, the interest you earned is added back to your principal, so next year you earn returns on a bigger base.',
      'This is also the heart of the Time Value of Money: ₹10,000 available today is worth more than ₹10,000 five years from now because today’s ₹10,000 can be invested immediately to earn compound returns.',
    ],
    indianExample: {
      title: 'The Thali Test + ₹1,00,000 Over 15 Years',
      scenario: 'Ten years ago, a restaurant meal that cost ₹60 now costs around ₹110–₹120 (roughly 6%–7% annual inflation). Now compare investing ₹1,00,000 at 10% per year for 15 years under Simple vs. Compound Interest.',
      calculationOrOutcome: 'With Simple Interest at 10%, ₹1,00,000 grows by ₹10,000/year to ₹2,50,000 in 15 years. With annual Compound Interest at 10%, it grows to ₹4,17,725—an extra ₹1,67,725 purely from interest earning interest!',
    },
    comparisonTable: {
      caption: '₹1,00,000 Invested at 10% p.a. — Simple vs. Compound Interest',
      headers: ['Time Horizon', 'Simple Interest Value', 'Compound Interest Value', 'Compounding Bonus'],
      rows: [
        ['5 Years', '₹1,50,000', '₹1,61,051', '+₹11,051'],
        ['10 Years', '₹2,00,000', '₹2,59,374', '+₹59,374'],
        ['15 Years', '₹2,50,000', '₹4,17,725', '+₹1,67,725'],
        ['20 Years', '₹3,00,000', '₹6,72,750', '+₹3,72,750'],
      ],
    },
    interactiveCheck: {
      question: 'If inflation averages 6% per year and you keep ₹50,000 idle in a zero-interest cash box for 10 years, what happens to your money?',
      options: [
        'Its purchasing power stays exactly ₹50,000',
        'Its nominal note count is still ₹50,000, but it buys only ~₹27,920 worth of today’s goods',
        'It automatically doubles in purchasing power',
        'Inflation only affects luxury goods',
      ],
      correctIndex: 1,
      correctFeedback: 'Exactly right! The paper notes still say ₹50,000, but because prices rose at 6% a year, those notes can buy only about ₹27,920 worth of today’s goods.',
      incorrectFeedback: 'Remember: physical cash earns 0% return while prices around you increase every year.',
      alternateExplanation: 'Imagine a bag of groceries costs ₹1,000 today. Today ₹50,000 buys 50 bags. After 10 years of 6% inflation, each bag costs ₹1,791—so your ₹50,000 cash now buys only 27.9 bags!',
    },
    keyTakeaways: [
      'Inflation silently reduces what your cash can buy; keeping all savings idle in cash loses purchasing power.',
      'Simple interest grows linearly, while compound interest grows exponentially over long periods.',
      'In compounding, time in the market matters even more than starting with a huge amount.',
      'To build real wealth, your long-term return should exceed the rate of inflation.',
    ],
    nextRecommendedLessonId: 'lesson-budget-50-30-20',
  },

  // MODULE B: BUDGETING AND SAVING
  {
    id: 'lesson-budget-50-30-20',
    topicId: 'budgeting-saving',
    topicTitle: 'Budgeting and Saving',
    title: 'The 50/30/20 Budget Rule & Emergency Funds',
    level: 'Beginner',
    durationMinutes: 6,
    summary: 'Build a realistic monthly budget on a ₹30,000+ income, understand when to adapt the 50/30/20 rule, and set up your emergency fund.',
    plainExplanation: [
      'A budget is not a punishment—it is a spending plan that gives every rupee a clear job before the month begins. The classic 50/30/20 rule divides your monthly take-home income into three buckets: 50% for Needs, 30% for Wants, and 20% for Savings & Financial Goals.',
      'Limitations of 50/30/20: If you live in a high-rent city or support family members on a starting salary, your Needs might take 60%–65% of your income. That is completely normal! Adjust your ratio to 60/20/20 or 65/15/20 so your 20% savings habit remains protected.',
      'Your very first savings goal should always be an Emergency Fund equal to 3 to 6 months of essential living expenses, kept in a safe, easily accessible liquid account.',
    ],
    indianExample: {
      title: 'Rohan’s ₹30,000 Monthly Salary Plan',
      scenario: 'Rohan earns ₹30,000 per month. Using an adapted 60/20/20 starter budget, he allocates ₹18,000 to essential expenses (rent, groceries, commute, parents’ support), ₹6,000 to personal lifestyle spending, and transfers ₹6,000 on salary day to savings.',
      calculationOrOutcome: 'Because Rohan’s essential monthly needs are ₹18,000, his 3-month Emergency Fund target is ₹54,000 (and 6-month target is ₹1,08,000). By saving ₹6,000/month, he builds a 3-month safety shield in just 9 months!',
    },
    comparisonTable: {
      caption: 'Adapting Your Monthly Budget to Real Life (₹30,000 Salary Example)',
      headers: ['Bucket', 'Standard 50/30/20', 'High-Rent Metro (60/20/20)', 'Aggressive Saver (50/20/30)'],
      rows: [
        ['Needs (Rent, Food, Bills)', '₹15,000 (50%)', '₹18,000 (60%)', '₹15,000 (50%)'],
        ['Wants (Dining, Shopping)', '₹9,000 (30%)', '₹6,000 (20%)', '₹6,000 (20%)'],
        ['Savings & Goals', '₹6,000 (20%)', '₹6,000 (20%)', '₹9,000 (30%)'],
      ],
    },
    interactiveCheck: {
      question: 'Sneha’s essential monthly expenses (rent, groceries, bills) are ₹20,000. Where should she keep her ₹60,000–₹1,20,000 Emergency Fund?',
      options: [
        'In small-cap stocks or crypto for maximum returns',
        'In a safe, liquid savings or sweep-in deposit account that can be accessed anytime without penalty',
        'Locked in a 15-year real estate plot',
        'Spent on annual shopping sales',
      ],
      correctIndex: 1,
      correctFeedback: 'Well done! An emergency fund is for protection, not high risk. It must be 100% safe and immediately withdrawable during a medical crisis or job loss.',
      incorrectFeedback: 'Careful! An emergency can happen when stock markets are down or when property cannot be sold quickly.',
      alternateExplanation: 'Think of an emergency fund like a fire extinguisher in your kitchen—you don’t lock a fire extinguisher in a vault or bet it on the stock market; you keep it right where you can grab it in seconds.',
    },
    keyTakeaways: [
      'Follow "Income − Savings = Expenses" (Pay Yourself First on salary day) instead of saving whatever is left over at month-end.',
      'Track every expense for 30 days—small ₹150 daily leaks often add up to ₹4,500/month.',
      'Build 3 to 6 months of essential expenses in a safe, liquid emergency fund before taking investment risk.',
      'Watch out for Lifestyle Inflation: when your salary rises by ₹10,000, save at least half of the raise.',
    ],
    nextRecommendedLessonId: 'lesson-saving-habits-lifestyle',
  },
  {
    id: 'lesson-saving-habits-lifestyle',
    topicId: 'budgeting-saving',
    topicTitle: 'Budgeting and Saving',
    title: 'Expense Tracking, Saving Goals & Beating Lifestyle Inflation',
    level: 'Beginner',
    durationMinutes: 5,
    summary: 'Learn how 30-day expense tracking uncovers hidden money leaks and how to prevent lifestyle creep when your income grows.',
    plainExplanation: [
      'Lifestyle Inflation (or "lifestyle creep") happens when your spending automatically rises every time your salary increases. Someone earning ₹60,000/month who spends ₹59,500 is financially more vulnerable than someone earning ₹30,000/month who saves ₹6,000 consistently.',
      'The 30-Day Expense Tracking Habit: For one month, write down or log every single rupee you spend under three columns: Essential Need, Planned Want, or Impulse Leak. Most learners discover 10% to 15% of their salary disappears into unnoticed micro-spends.',
      'To build effortless consistency, use the "50% Raise Rule": whenever you receive a salary increment or bonus, allow yourself to enjoy 50% of the increase on better lifestyle comforts, and lock the other 50% immediately into your monthly savings goal.',
    ],
    indianExample: {
      title: 'Kunal’s Salary Jump from ₹35,000 to ₹50,000',
      scenario: 'Kunal gets a ₹15,000 monthly raise. Instead of immediately moving into a luxury flat that costs ₹15,000 more, he upgrades his lifestyle by ₹6,000/month and increases his monthly automated savings by ₹9,000/month.',
      calculationOrOutcome: 'Kunal enjoys a better lifestyle today while boosting his annual savings by ₹1,08,000/year—reaching his financial goals years ahead of schedule!',
    },
    comparisonTable: {
      caption: 'Lifestyle Inflation Trap vs. The 50% Raise Rule',
      headers: ['Metric', 'Before Raise', 'Lifestyle Creep Trap', 'Smart 50%+ Raise Rule'],
      rows: [
        ['Monthly Take-Home Pay', '₹35,000', '₹50,000', '₹50,000'],
        ['Monthly Spending (Needs + Wants)', '₹28,000', '₹43,000 (+₹15,000)', '₹34,000 (+₹6,000)'],
        ['Monthly Savings', '₹7,000 (20%)', '₹7,000 (Drops to 14%)', '₹16,000 (Jumps to 32%!)'],
      ],
    },
    interactiveCheck: {
      question: 'You receive a ₹10,000/month salary increment at work. How can you enjoy your hard work while avoiding the Lifestyle Inflation trap?',
      options: [
        'Take a new ₹12,000/month luxury EMI immediately',
        'Increase your automated monthly savings by at least ₹5,000 (50% of the raise) and use the rest for lifestyle upgrades',
        'Stop tracking expenses because your salary is higher now',
        'Cancel your emergency fund',
      ],
      correctIndex: 1,
      correctFeedback: 'Spot on! Saving at least half of every salary raise lets you enjoy a better lifestyle today while accelerating your future wealth.',
      incorrectFeedback: 'Watch out! If your expenses grow as fast as (or faster than) your salary, you stay stuck living paycheck to paycheck regardless of how much you earn.',
      alternateExplanation: 'Think of a bucket under a tap: turning the tap higher (earning more) only fills the bucket if you don’t punch bigger holes in the bottom at the exact same time.',
    },
    keyTakeaways: [
      'Track every rupee spent for 30 days to spot silent impulse leaks.',
      'Separate your savings into a dedicated goal account on salary day.',
      'Apply the 50% Raise Rule: save at least half of every salary hike or bonus.',
      'True wealth is measured not by how much you spend, but by how many months of freedom your savings buy.',
    ],
    nextRecommendedLessonId: 'lesson-saving-vs-investing',
  },

  // MODULE C: INVESTING FUNDAMENTALS
  {
    id: 'lesson-saving-vs-investing',
    topicId: 'investing-fundamentals',
    topicTitle: 'Investing Fundamentals',
    title: 'Saving vs. Investing, Mutual Funds, Index Funds & SIPs',
    level: 'Intermediate',
    durationMinutes: 8,
    summary: 'Understand risk vs. return, how Mutual Funds, ETFs, and Index Funds work, and how a monthly SIP harnesses compounding.',
    plainExplanation: [
      'Saving is setting money aside safely for short-term needs and emergencies. Investing is putting money to work in productive assets (like equities/stocks, bonds, or mutual funds) to grow wealth faster than inflation over 5, 10, or 20+ years.',
      'Every investment has a Risk-Return Trade-Off: higher potential returns come with higher short-term ups and downs (volatility). Returns in market-linked investments are NEVER guaranteed.',
      'A Mutual Fund pools money from thousands of investors to buy a diversified basket of stocks or bonds. An Index Fund (like a Nifty 50 Index Fund) simply mirrors the top 50 companies at a very low annual fee (Expense Ratio). Through a Systematic Investment Plan (SIP), you can invest as little as ₹500/month automatically.',
    ],
    indianExample: {
      title: 'Divya’s ₹5,000 Monthly SIP Over 15 Years',
      scenario: 'Divya invests ₹5,000 every month via SIP in a diversified equity index fund for 15 years. Over 15 years, she contributes ₹9,00,000 out of pocket.',
      calculationOrOutcome: 'At an illustrative long-term market return of 12% p.a. (not guaranteed, as markets fluctuate), her ₹9,00,000 investment can grow to approximately ₹25.22 Lakh—meaning over ₹16.22 Lakh comes from long-term compounding!',
    },
    comparisonTable: {
      caption: 'Comparing Major Saving & Investment Options',
      headers: ['Instrument', 'Risk Level', 'Typical Time Horizon', 'Liquidity & Purpose'],
      rows: [
        ['Savings / Fixed Deposit', 'Very Low', '0 to 3 Years', 'High liquidity; ideal for Emergency Fund & short-term goals'],
        ['Debt / Government Bonds', 'Low to Moderate', '1 to 5 Years', 'Steady income; lower volatility than stocks'],
        ['Nifty 50 Index Fund / Equity MF', 'Moderate to High (short-term ups & downs)', '5 to 15+ Years', 'Long-term wealth creation to beat inflation'],
        ['Direct Individual Stocks', 'High (company-specific risk)', '5+ Years', 'Requires deep research into company financial statements'],
      ],
    },
    interactiveCheck: {
      question: 'Why do financial educators recommend diversified Index Funds or Mutual Funds via SIP for beginners instead of putting all money into a single stock?',
      options: [
        'Because Mutual Funds legally guarantee 25% fixed monthly returns',
        'Because diversification spreads risk across many companies and SIP averages out purchase costs over market ups and downs',
        'Because Mutual Funds have zero risk even over 1 week',
        'Because individual stocks never fluctuate',
      ],
      correctIndex: 1,
      correctFeedback: 'Spot on! Diversification protects you if one company performs poorly, and a monthly SIP buys more units when markets dip and fewer when markets peak (Rupee Cost Averaging).',
      incorrectFeedback: 'Remember: no equity mutual fund guarantees fixed returns, and short-term market risk always exists.',
      alternateExplanation: 'Never put all your eggs in one basket. An index fund holds 50 leading companies across multiple industries—so your savings aren’t tied to the fate of a single company.',
    },
    keyTakeaways: [
      'Save for short-term safety (1–3 years); invest for long-term goals (5+ years) to beat inflation.',
      'Market-linked investments (stocks, mutual funds, ETFs) do NOT guarantee returns and fluctuate in the short term.',
      'A monthly SIP builds discipline and uses Rupee Cost Averaging so you don’t need to time the market.',
      'Check the "Expense Ratio" (annual fee) and exit load before choosing any mutual fund.',
    ],
    nextRecommendedLessonId: 'lesson-goals-debt-scams',
  },

  // MODULE D: FINANCIAL PLANNING AND WEALTH HABITS
  {
    id: 'lesson-goals-debt-scams',
    topicId: 'financial-planning',
    topicTitle: 'Financial Planning and Wealth Habits',
    title: 'Goal-Based Planning, Debt Freedom & Spotting Financial Scams',
    level: 'Advanced',
    durationMinutes: 7,
    summary: 'Map out short-, medium-, and long-term goals, compare Debt Avalanche vs. Debt Snowball, and protect your wealth from Ponzi schemes.',
    plainExplanation: [
      'Every rupee you save works harder when attached to a time-bound goal: Short-Term Goals (0–3 years, like an emergency fund or buying a laptop) belong in safe liquid accounts; Medium-Term Goals (3–7 years, like higher education or a home down payment) suit hybrid or conservative instruments; Long-Term Goals (7–25+ years, like retirement or children’s college) can harness equity index funds and retirement accounts.',
      'If you have multiple loans, use one of two proven payoff frameworks: the Debt Avalanche method pays minimums on all debts and throws every extra rupee at the loan with the HIGHEST interest rate (saving the maximum money), while the Debt Snowball method attacks the SMALLEST balance first for quick psychological wins.',
      'Finally, protect your hard-earned savings from scams: if any app, chat group, or "trading guru" promises "Guaranteed 5% weekly returns" or "Double your money in 90 days", it is a fraudulent Ponzi scheme. Legitimate investments never promise guaranteed high stock returns.',
    ],
    indianExample: {
      title: 'Eliminating Two Loans & Rejecting a "Double Money" Scheme',
      scenario: 'Vikram has a ₹35,000 Credit Balance at 36% p.a. and a ₹1,20,000 Personal Loan at 14% p.a. A friend tells him to invest ₹30,000 in an unregistered app promising "guaranteed 15% monthly return" to clear his loans faster.',
      calculationOrOutcome: 'Vikram recognizes that 15% per month (>180% a year!) is a classic Ponzi trap. Instead, he uses the Debt Avalanche strategy—directing all surplus savings to clear the 36% balance first, earning an instant, risk-free 36% savings on interest!',
    },
    comparisonTable: {
      caption: 'Matching Financial Goals to Time Horizon & Instruments',
      headers: ['Goal Horizon', 'Example Financial Goal', 'Suitable Approach'],
      rows: [
        ['Short-Term (0–3 Years)', 'Emergency fund, buying a two-wheeler, family trip', 'High-yield Savings Account, Recurring Deposit, Fixed Deposit, Liquid Fund'],
        ['Medium-Term (3–7 Years)', 'Home down payment, master’s degree tuition', 'Mix of Debt Funds, Fixed Deposits, and balanced hybrid allocation'],
        ['Long-Term (7+ Years)', 'Retirement corpus, child’s higher education', 'Diversified Equity Mutual Funds / Index SIP, long-term retirement funds'],
      ],
    },
    interactiveCheck: {
      question: 'You have two debts: a high-interest balance of ₹40,000 charging 38% annual interest, and a Car Loan of ₹2,00,000 charging 9.5% annual interest. Which debt does the "Debt Avalanche" method pay off first with extra money?',
      options: [
        'The Car Loan because ₹2,00,000 is a bigger number',
        'The 38% balance because 38% is the highest interest rate—saving the most total interest',
        'Neither; invest in speculative penny stocks instead',
        'Skip minimum payments on both loans',
      ],
      correctIndex: 1,
      correctFeedback: 'Spot on! Paying off a 38% interest debt is equivalent to earning a guaranteed, tax-free 38% return on your money.',
      incorrectFeedback: 'Always look at the annual interest rate (APR): 38% drains your wealth four times faster per rupee than a 9.5% loan.',
      alternateExplanation: 'In the Debt Avalanche method, you still pay the mandatory minimum on every loan on time, and direct 100% of your extra budget toward the loan with the highest interest rate.',
    },
    keyTakeaways: [
      'Match your investment product to your goal timeline—never put 1-year goal money into volatile stocks.',
      'Debt Avalanche (highest interest rate first) mathematically saves the most money and time.',
      'High return with "zero risk" does not exist—unrealistic return promises are the #1 red flag of a financial scam.',
      'Consistency beats perfection: a modest ₹3,000/month SIP started early beats waiting 10 years for the "perfect" salary.',
    ],
    nextRecommendedLessonId: 'lesson-needs-wants',
  },
];

export const DAILY_LESSONS: DailyLesson[] = [
  {
    id: 'daily-1',
    dayLabel: 'Today’s 2-Minute Money Lesson',
    title: 'The "Pay Yourself First" Salary Day Rule',
    category: 'Budgeting & Habits',
    readTime: '2 min read',
    hook: 'Most people spend all month and try to save whatever is left on the 30th. Usually, ₹0 is left!',
    coreConcept:
      'Flip the formula from "Income − Expenses = Savings" to "Income − Savings = Expenses". Automate a recurring transfer or SIP for the 2nd or 3rd of every month—right after your salary arrives—so saving happens automatically before lifestyle spending begins.',
    actionStep: 'Even if you earn ₹20,000 or ₹30,000, set up an automatic transfer of 10%–20% into a separate savings account on salary day.',
    quickQuestion: {
      prompt: 'When is the best day of the month to transfer money toward your savings or SIP?',
      options: [
        'On the last day of the month if anything is left',
        'Within 1–2 days of receiving your monthly salary (Pay Yourself First)',
        'Only during festival bonus months',
      ],
      correctIndex: 1,
      explanation: 'Automating your savings right after salary credit removes willpower from the equation and builds wealth effortlessly.',
    },
  },
  {
    id: 'daily-2',
    dayLabel: 'Daily Lesson #2',
    title: 'The Rule of 72: How Fast Will Your Money Double?',
    category: 'Money Fundamentals',
    readTime: '2 min read',
    hook: 'Want a mental shortcut to calculate compound interest without a spreadsheet?',
    coreConcept:
      'Divide the number 72 by your annual rate of return to estimate how many years it takes for your money to double. At 6% interest, 72 ÷ 6 = ~12 years to double. At 12% long-term equity return, 72 ÷ 12 = ~6 years to double! You can also divide 72 by the inflation rate (72 ÷ 6% = 12 years) to see how fast prices double.',
    actionStep: 'Compare any investment offer using the Rule of 72: if someone claims your money will double in 6 months, 72 ÷ 0.5 = 144% annual return—an obvious scam alert!',
    quickQuestion: {
      prompt: 'Using the Rule of 72, roughly how many years will it take ₹50,000 to double to ₹1,00,000 at an 8% annual return?',
      options: ['4 years', '9 years (72 ÷ 8)', '15 years'],
      correctIndex: 1,
      explanation: '72 ÷ 8 = 9 years! It is one of the handiest mental math tools in personal finance.',
    },
  },
  {
    id: 'daily-3',
    dayLabel: 'Daily Lesson #3',
    title: 'Why Protection Comes Before Stock Investing',
    category: 'Financial Planning & Habits',
    readTime: '2 min read',
    hook: 'One unexpected hospital bill can cost ₹1.5 Lakh to ₹4 Lakh and derail years of saving.',
    coreConcept:
      'Many young professionals start stock SIPs without basic health insurance or an emergency fund. If a medical emergency strikes, they are forced to sell their investments at a loss or take a high-interest personal loan. A comprehensive health insurance policy and emergency fund protect years of hard-earned savings.',
    actionStep: 'Verify whether you and your family have adequate independent health insurance cover in addition to any employer group policy.',
    quickQuestion: {
      prompt: 'Why shouldn’t you rely solely on your employer’s corporate health insurance?',
      options: [
        'Corporate cover stops the day you switch jobs, take a study break, or retire',
        'Employer policies never cover hospital stays',
        'Hospitals do not accept health insurance',
      ],
      correctIndex: 0,
      explanation: 'Having an independent base health insurance policy ensures continuous protection even when you change companies or start your own venture.',
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    topicId: 'money-fundamentals',
    level: 'Beginner',
    question: 'You have ₹10,000 in a savings box earning 0% while annual inflation is 6%. After 1 year, what is true about your money?',
    options: [
      'You can buy 6% more goods than last year',
      'The ₹10,000 notes remain the same, but your real purchasing power has dropped because items now cost ~6% more',
      'The bank automatically adds 6% to your cash box',
      'Inflation only affects foreign currency',
    ],
    correctIndex: 1,
    explanation: 'Inflation raises prices of goods and services over time. If your money earns 0%, its real purchasing power declines by the rate of inflation.',
    recommendedLessonId: 'lesson-inflation-compounding',
  },
  {
    id: 'q-2',
    topicId: 'budgeting-saving',
    level: 'Beginner',
    question: 'In the 50/30/20 budgeting framework, how should a monthly salary of ₹30,000 be divided?',
    options: [
      '₹15,000 Needs (50%), ₹9,000 Wants (30%), ₹6,000 Savings (20%)',
      '₹25,000 Wants, ₹5,000 Needs, ₹0 Savings',
      '₹30,000 in high-risk stock trading',
      '₹15,000 EMIs, ₹15,000 Dining Out',
    ],
    correctIndex: 0,
    explanation: '50% of ₹30,000 is ₹15,000 for Needs, 30% is ₹9,000 for Wants, and 20% is ₹6,000 for Savings & Financial Goals. (If rent is higher, adapt to 60/20/20!)',
    recommendedLessonId: 'lesson-budget-50-30-20',
  },
  {
    id: 'q-3',
    topicId: 'budgeting-saving',
    level: 'Beginner',
    question: 'How big should a standard Emergency Fund be, and where should it be kept?',
    options: [
      '1 week of expenses kept in cryptocurrency',
      '3 to 6 months of essential living expenses kept in a liquid, safe account',
      '10 years of salary locked in real estate',
      'No emergency fund is needed if you have a loan facility',
    ],
    correctIndex: 1,
    explanation: 'An emergency fund covers 3 to 6 months of essential expenses (rent, groceries, bills, EMIs) and must be accessible immediately without market risk.',
    recommendedLessonId: 'lesson-budget-50-30-20',
  },
  {
    id: 'q-4',
    topicId: 'budgeting-saving',
    level: 'Intermediate',
    question: 'What is "Lifestyle Inflation" (lifestyle creep), and how can you prevent it?',
    options: [
      'When your spending rises just as fast as every salary raise; prevent it by saving at least 50% of every increment',
      'When grocery prices fall during festival sales',
      'When compound interest doubles your money',
      'When you track your expenses for 30 days',
    ],
    correctIndex: 0,
    explanation: 'Lifestyle inflation happens when higher income immediately turns into higher spending with zero extra savings. Saving 50%+ of every raise builds lasting wealth.',
    recommendedLessonId: 'lesson-saving-habits-lifestyle',
  },
  {
    id: 'q-5',
    topicId: 'investing-fundamentals',
    level: 'Intermediate',
    question: 'What is the main advantage of investing in an Equity Mutual Fund via a monthly SIP (Systematic Investment Plan)?',
    options: [
      'It guarantees 30% fixed annual returns with zero risk',
      'It builds regular investing discipline and averages your purchase cost across market highs and lows (Rupee Cost Averaging)',
      'It eliminates all market fluctuations overnight',
      'It requires a minimum of ₹5 Lakh per month',
    ],
    correctIndex: 1,
    explanation: 'SIP automates monthly investing, harnesses long-term compounding, and uses Rupee Cost Averaging (buying more units when prices dip and fewer when prices rise).',
    recommendedLessonId: 'lesson-saving-vs-investing',
  },
  {
    id: 'q-6',
    topicId: 'investing-fundamentals',
    level: 'Intermediate',
    question: 'What is Diversification in investing?',
    options: [
      'Putting 100% of your life savings into a single trending stock',
      'Spreading your investments across different asset classes (equity, debt, gold, deposits) and sectors to reduce risk',
      'Switching mutual funds every 2 days',
      'Borrowing money to trade options',
    ],
    correctIndex: 1,
    explanation: 'Diversification ("not putting all your eggs in one basket") ensures that a downturn in one company or asset class does not wipe out your entire portfolio.',
    recommendedLessonId: 'lesson-saving-vs-investing',
  },
  {
    id: 'q-7',
    topicId: 'financial-planning',
    level: 'Advanced',
    question: 'How does the "Debt Avalanche" payoff strategy work when you have multiple loans?',
    options: [
      'Pay minimums on all debts, and direct all extra money toward the debt with the HIGHEST interest rate first',
      'Stop paying all loans and wait for them to expire',
      'Pay off the loan with the lowest interest rate first',
      'Take a new high-interest loan to spend on holidays',
    ],
    correctIndex: 0,
    explanation: 'Debt Avalanche targets the loan with the highest annual interest rate first while paying minimums on the rest—mathematically saving the maximum total interest.',
    recommendedLessonId: 'lesson-goals-debt-scams',
  },
  {
    id: 'q-8',
    topicId: 'financial-planning',
    level: 'Advanced',
    question: 'A messaging group claims to be a "VIP institutional account" offering a guaranteed 4% weekly return with zero risk if you transfer ₹50,000. What is the safest response?',
    options: [
      'Borrow money and invest immediately',
      'Test it with ₹20,000 first because scammers sometimes pay early withdrawals to lure larger deposits',
      'Reject and report it—4% weekly is over 200% a year, a classic hallmark of an illegal Ponzi scam',
      'Share your private banking credentials with the group admin',
    ],
    correctIndex: 2,
    explanation: 'Fraudsters often pay small initial "profits" to trick victims into depositing their life savings. No legitimate regulated investment guarantees 4% weekly returns.',
    recommendedLessonId: 'lesson-goals-debt-scams',
  },
];

export const SCENARIO_SIMULATIONS: ScenarioSimulation[] = [
  {
    id: 'scen-first-salary',
    title: 'Scenario 1: The First Salary Dilemma (₹30,000/month)',
    persona: 'Aarav, 22 · Fresh Graduate in Bengaluru',
    level: 'Beginner',
    monthlyIncomeINR: '₹30,000 take-home',
    situation:
      'Aarav just received his very first salary of ₹30,000! His PG rent, food, and bus commute cost ₹18,000. He has ₹0 in emergency savings. His friends invite him to buy a ₹36,000 flagship phone on EMI and spend ₹8,000 this weekend celebrating.',
    question: 'What is the smartest financial move for Aarav with the ₹12,000 remaining after his ₹18,000 essential expenses?',
    choices: [
      {
        id: 'c1',
        label: 'Transfer ₹6,000 immediately to start an Emergency Fund, keep ₹6,000 for modest celebration & personal expenses, and skip the phone EMI.',
        outcomeTitle: 'Strong Financial Foundation Built!',
        financialImpact: '+₹6,000 saved in Month 1 · ₹0 Debt · On track for a ₹54,000 Emergency Fund',
        isOptimal: true,
        finBuddyCoaching:
          'Outstanding choice! Aarav still enjoys his first salary responsibly with ₹6,000 for personal wants while paying himself ₹6,000 (20%) first to build his emergency safety shield.',
      },
      {
        id: 'c2',
        label: 'Spend ₹8,000 celebrating and sign up for a ₹3,500/month EMI for the flagship phone.',
        outcomeTitle: 'Paycheck-to-Paycheck Stress',
        financialImpact: '₹500 left · Locked into 12-month EMI · ₹0 Emergency Buffer',
        isOptimal: false,
        finBuddyCoaching:
          'That leaves almost zero margin for error! If Aarav faces a ₹3,000 medical or travel expense next month, he will be forced into high-interest debt.',
      },
      {
        id: 'c3',
        label: 'Put all ₹12,000 into volatile small-cap stocks hoping to double it next month.',
        outcomeTitle: 'Liquidity Risk Without a Safety Net',
        financialImpact: '₹0 liquid emergency cash · High short-term market risk',
        isOptimal: false,
        finBuddyCoaching:
          'Investing is great for 5+ year goals, but before investing in stocks, you always need a liquid Emergency Fund so you aren’t forced to sell during a market dip.',
      },
    ],
    keyLessonTakeaway: 'On your first salary, establish the 20% savings habit on Day 1 and build 3–6 months of emergency expenses before taking on lifestyle EMIs.',
    relatedLessonId: 'lesson-budget-50-30-20',
  },
  {
    id: 'scen-credit-trap',
    title: 'Scenario 2: High-Interest Debt vs. Idle Savings',
    persona: 'Neha, 26 · Marketing Executive in Mumbai',
    level: 'Intermediate',
    monthlyIncomeINR: '₹45,000 take-home',
    situation:
      'Due to an unexpected dental root canal and family travel, Neha has a ₹30,000 high-interest bill due tomorrow (which charges 38% annual interest if left unpaid, with a ₹1,500 minimum payment option). She has ₹40,000 sitting in her Emergency Savings Account.',
    question: 'How should Neha handle this ₹30,000 bill before tomorrow’s due date?',
    choices: [
      {
        id: 'c1',
        label: 'Pay only the ₹1,500 Minimum Due so her ₹40,000 savings account looks untouched.',
        outcomeTitle: 'Caught in the 38% Revolving Interest Trap!',
        financialImpact: '-₹1,100+ lost to interest in 1 month · Debt compounds rapidly',
        isOptimal: false,
        finBuddyCoaching:
          'Keeping money in a 3.5% p.a. savings account while owing 38% p.a. on debt costs you a massive net loss! Emergency funds exist for moments like this.',
      },
      {
        id: 'c2',
        label: 'Use ₹30,000 from her Emergency Fund to pay the FULL ₹30,000 Total Due, then rebuild the Emergency Fund over the next 3 months.',
        outcomeTitle: 'Zero Interest Wasted & Debt Avoided!',
        financialImpact: '₹0 interest wasted · ₹10,000 buffer still remaining',
        isOptimal: true,
        finBuddyCoaching:
          'Brilliant decision! Paying the full ₹30,000 saves over ₹1,100/month in punitive interest. Neha can replenish her emergency fund at ₹10,000/month over the next 3 months.',
      },
      {
        id: 'c3',
        label: 'Borrow ₹30,000 from an instant loan app at 36% interest to pay the bill.',
        outcomeTitle: 'Double Debt Spiral!',
        financialImpact: '-₹900 processing fee + 36% p.a. interest from Day 1',
        isOptimal: false,
        finBuddyCoaching:
          'Replacing one high-interest debt with another expensive loan only adds processing fees without reducing your liability.',
      },
    ],
    keyLessonTakeaway: 'Never carry a high-interest balance at 36%–42% interest when you have low-yield savings available to clear the full amount.',
    relatedLessonId: 'lesson-goals-debt-scams',
  },
  {
    id: 'scen-scam-alert',
    title: 'Scenario 3: The "Guaranteed 30% Monthly Return" Investment Group',
    persona: 'Rajesh, 34 · School Teacher in Jaipur',
    level: 'Intermediate',
    monthlyIncomeINR: '₹52,000 take-home',
    situation:
      'Rajesh is added to a chat group claiming to offer "Assured 30% Monthly Institutional Stock Deals". Today, an admin sends him a link to download an unknown `.apk` app and asks Rajesh to transfer ₹50,000 to "activate VIP withdrawal".',
    question: 'What should Rajesh do right now?',
    choices: [
      {
        id: 'c1',
        label: 'Transfer ₹50,000 to claim the bonus and activate VIP trading.',
        outcomeTitle: '₹50,000 Lost to a Ponzi Scam!',
        financialImpact: '-₹50,000 lost · Device compromised by APK malware',
        isOptimal: false,
        finBuddyCoaching:
          'Wait! No legitimate investment guarantees 30% monthly returns (>360% a year!), and installing unknown `.apk` files compromises your device security.',
      },
      {
        id: 'c2',
        label: 'Refuse the transfer, never install unknown `.apk` trading apps, exit the group, and stick to regulated Mutual Fund / Index SIPs.',
        outcomeTitle: 'Hard-Earned Savings 100% Protected!',
        financialImpact: '₹50,000 saved · Zero data breach · Long-term investing intact',
        isOptimal: true,
        finBuddyCoaching:
          'Spot on, Rajesh! Legitimate investments never operate via "VIP guaranteed profit" chat groups or ask you to pay an activation fee to withdraw your own money.',
      },
    ],
    keyLessonTakeaway: 'Unrealistic guaranteed returns + unknown APK apps + upfront withdrawal fees = 100% financial fraud.',
    relatedLessonId: 'lesson-goals-debt-scams',
  },
];

export const GLOSSARY_TERMS: GlossaryItem[] = [
  {
    term: 'Inflation',
    category: 'Money Fundamentals',
    simpleDefinition: 'The steady rise in the prices of everyday goods and services over time, which reduces how much a single rupee can buy.',
    indianExample: 'If inflation is 6% per year, groceries that cost ₹5,000 today will cost ₹5,300 next year.',
  },
  {
    term: 'Compound Interest',
    category: 'Money Fundamentals',
    simpleDefinition: 'Earning interest not just on your original savings, but also on the interest accumulated in previous periods ("interest on interest").',
    indianExample: '₹1,00,000 invested at 10% compounded annually becomes ₹1,10,000 in Year 1 and ₹1,21,000 in Year 2 (earning ₹1,000 extra on Year 1’s interest).',
  },
  {
    term: 'Time Value of Money',
    category: 'Money Fundamentals',
    simpleDefinition: 'The principle that a sum of money available today is worth more than the exact same amount in the future because today’s money can earn compound returns.',
    indianExample: 'Receiving ₹10,000 today and earning 8% p.a. turns it into ₹10,800 next year, beating ₹10,000 received a year later.',
  },
  {
    term: 'Asset vs. Liability',
    category: 'Money Fundamentals',
    simpleDefinition: 'An Asset is anything you own that grows in value or generates income; a Liability is a debt or obligation that drains money via interest.',
    indianExample: 'An Index Fund SIP is an asset; a 36% APR consumer loan is a liability.',
  },
  {
    term: 'Emergency Fund',
    category: 'Budgeting & Saving',
    simpleDefinition: 'A dedicated safety buffer of 3 to 6 months of essential living expenses kept in a safe, instantly accessible account for unexpected crises.',
    indianExample: 'If your rent, food, and bills are ₹20,000/month, keeping ₹60,000–₹1,20,000 in a liquid savings or deposit account.',
  },
  {
    term: '50/30/20 Rule',
    category: 'Budgeting & Saving',
    simpleDefinition: 'A simple monthly budgeting guideline allocating 50% of take-home pay to Needs, 30% to Wants, and 20% to Savings and Financial Goals.',
    indianExample: 'On a ₹30,000 salary: ₹15,000 for Needs, ₹9,000 for Wants, and ₹6,000 for Savings.',
  },
  {
    term: 'Lifestyle Inflation',
    category: 'Budgeting & Saving',
    simpleDefinition: 'The habit of increasing your spending every time your income rises, leaving your actual savings stagnant.',
    indianExample: 'Getting a ₹10,000 salary raise and immediately spending all ₹10,000 on costlier dining and gadgets instead of boosting your SIP.',
  },
  {
    term: 'SIP (Systematic Investment Plan)',
    category: 'Investing Fundamentals',
    simpleDefinition: 'A disciplined method of investing a fixed amount (such as ₹500 or ₹5,000) every month into a mutual fund automatically.',
    indianExample: 'Auto-investing ₹3,000 on the 5th of every month into a Nifty 50 Index Fund for a 10-year goal.',
  },
  {
    term: 'Index Fund',
    category: 'Investing Fundamentals',
    simpleDefinition: 'A low-cost mutual fund or ETF that passively tracks a benchmark market index like the Nifty 50 or Sensex instead of trying to pick individual stocks.',
    indianExample: 'A Nifty 50 Index Fund invests across India’s top 50 listed companies with a low annual expense ratio.',
  },
  {
    term: 'Diversification',
    category: 'Investing Fundamentals',
    simpleDefinition: 'Spreading your investments across different asset classes (equity, debt, gold, deposits) and sectors so poor performance in one area does not wipe out your portfolio.',
    indianExample: 'Keeping emergency cash in a safe deposit, long-term retirement money in Equity Index Funds, and 5%–10% in Gold.',
  },
  {
    term: 'Debt Avalanche vs. Snowball',
    category: 'Financial Planning',
    simpleDefinition: 'Two proven debt payoff methods: Avalanche attacks the loan with the highest interest rate first (saving the most money); Snowball attacks the smallest balance first (for quick psychological wins).',
    indianExample: 'Paying off a 36% APR balance before a 10% APR car loan using the Debt Avalanche strategy.',
  },
];
