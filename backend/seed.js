// Seeds the MathReels DB with NSW ATAR questions.
// Run: npm run seed
// Inline LaTeX is wrapped in $...$ and rendered by KaTeX on the frontend.
import db from "./db.js";

// Each question = one "reel". `steps` is an ordered list the student walks through.
// step.kind: "mcq" (multiple choice) | "text" (free-text, checked vs `accepted`).
// `accepted` answers are matched after normalising (lowercase, whitespace/“ ”/“=”
// handling on the frontend+backend). `scratchpad: true` shows a rough-work canvas.
const questions = [
  // ---------------- STANDARD ----------------
  {
    course: "Standard", year: 11, topic: "Financial Mathematics", difficulty: 2,
    title: "Simple interest",
    keyConcept: "Simple interest: I = Prn",
    prompt: "Sam invests $\\$4000$ at $5\\%$ simple interest per year for $3$ years. How much interest is earned?",
    scratchpad: true,
    final_answer: "$\\$600$",
    explanation: "Simple interest $I = Prn = 4000 \\times 0.05 \\times 3 = 600$.",
    steps: [
      {
        kind: "mcq",
        prompt: "How much interest is earned?",
        options: ["$\\$600$", "$\\$200$", "$\\$60$", "$\\$4600$"],
        correctIndex: 0,
        hint: "Use $I = P\\times r\\times n$ with $r$ as a decimal.",
        explanation: "$I = 4000 \\times 0.05 \\times 3 = \\$600$."
      }
    ]
  },
  {
    course: "Standard", year: 11, topic: "Linear Relationships", difficulty: 2,
    title: "Gradient of a line",
    keyConcept: "Gradient = rise / run",
    prompt: "Find the gradient of the line passing through $(1, 2)$ and $(4, 11)$.",
    scratchpad: false,
    final_answer: "$3$",
    explanation: "$m = \\dfrac{11-2}{4-1} = \\dfrac{9}{3} = 3$.",
    steps: [
      {
        kind: "text",
        prompt: "Type the gradient.",
        accepted: ["3"],
        hint: "Gradient $= \\dfrac{\\text{rise}}{\\text{run}} = \\dfrac{y_2-y_1}{x_2-x_1}$.",
        explanation: "$m = \\dfrac{11-2}{4-1} = 3$."
      }
    ]
  },
  {
    course: "Standard", year: 12, topic: "Non-right-angled Trigonometry", difficulty: 3,
    title: "Which rule?",
    keyConcept: "The sine rule",
    prompt: "In $\\triangle ABC$, $\\angle A = 40^\\circ$, $\\angle B = 75^\\circ$ and side $a = 10$ cm. We want side $b$.",
    scratchpad: true,
    final_answer: "$b \\approx 15.0$ cm",
    explanation: "Two angles + the side opposite one of them → sine rule. $b = \\dfrac{a\\sin B}{\\sin A} = \\dfrac{10\\sin 75^\\circ}{\\sin 40^\\circ} \\approx 15.0$ cm.",
    steps: [
      {
        kind: "mcq",
        prompt: "Which rule should you use to find $b$?",
        options: ["Sine rule", "Cosine rule", "Pythagoras' theorem", "Area rule"],
        correctIndex: 0,
        hint: "You have an angle–side pair $(A, a)$ and want another side opposite a known angle.",
        explanation: "With an angle and its opposite side known, the sine rule links them to $b$ and $\\angle B$."
      },
      {
        kind: "text",
        prompt: "Now compute $b$ to 1 decimal place (cm).",
        accepted: ["15.0", "15", "15.0cm", "15cm"],
        hint: "$b = \\dfrac{a\\sin B}{\\sin A} = \\dfrac{10\\sin 75^\\circ}{\\sin 40^\\circ}$.",
        explanation: "$b = \\dfrac{10 \\times 0.9659}{0.6428} \\approx 15.0$ cm."
      }
    ]
  },

  // ---------------- ADVANCED ----------------
  {
    course: "Advanced", year: 11, topic: "Quadratics", difficulty: 2,
    title: "Solve by factorising",
    keyConcept: "Factorising quadratics",
    prompt: "Solve $x^2 - 5x + 6 = 0$.",
    scratchpad: true,
    final_answer: "$x = 2$ or $x = 3$",
    explanation: "Factorise: $(x-2)(x-3)=0$, so $x=2$ or $x=3$.",
    steps: [
      {
        kind: "text",
        prompt: "First step: factorise the left-hand side. Type it in the form (x-a)(x-b).",
        accepted: ["(x-2)(x-3)", "(x-3)(x-2)"],
        hint: "Find two numbers that multiply to $+6$ and add to $-5$.",
        explanation: "$-2$ and $-3$ multiply to $6$ and add to $-5$, giving $(x-2)(x-3)$."
      },
      {
        kind: "mcq",
        prompt: "What are the solutions?",
        options: ["$x = 2$ or $x = 3$", "$x = -2$ or $x = -3$", "$x = 5$ or $x = 6$", "$x = 1$ or $x = 6$"],
        correctIndex: 0,
        hint: "Set each factor to zero.",
        explanation: "$x-2=0$ or $x-3=0 \\Rightarrow x = 2, 3$."
      }
    ]
  },
  {
    course: "Advanced", year: 11, topic: "Functions", difficulty: 2,
    title: "Domain of a function",
    keyConcept: "Domain restrictions",
    prompt: "State the domain of $f(x) = \\dfrac{1}{x-4}$.",
    scratchpad: false,
    final_answer: "all real $x$, $x \\neq 4$",
    explanation: "The denominator cannot be zero, so $x \\neq 4$.",
    steps: [
      {
        kind: "mcq",
        prompt: "Which is the correct domain?",
        options: ["all real $x$, $x \\neq 4$", "$x > 4$", "all real $x$", "$x \\neq 0$"],
        correctIndex: 0,
        hint: "Where is the function undefined?",
        explanation: "Division by zero occurs at $x=4$, so it is excluded."
      }
    ]
  },
  {
    course: "Advanced", year: 12, topic: "Differentiation", difficulty: 3,
    title: "Gradient at a point",
    keyConcept: "The power rule",
    prompt: "Find the gradient of $y = x^3 - 6x^2 + 5$ at $x = 2$.",
    scratchpad: true,
    final_answer: "$-12$",
    explanation: "$\\dfrac{dy}{dx} = 3x^2 - 12x$; at $x=2$: $12 - 24 = -12$.",
    concept: {
      kind: "tangent",
      title: "The idea: gradient of a curve",
      captions: [
        "A curve's steepness changes at every point, so what is its gradient right here?",
        "Trick: pick a second point and join them. That straight line is a secant.",
        "Now slide the second point towards the first, and watch the line tilt.",
        "The secant becomes the tangent. Its slope is the gradient at that point.",
        "We get that slope with the power rule: bring the power down, drop it by one."
      ],
      takeaway: "Power rule: $\\dfrac{d}{dx}x^n = nx^{n-1}$. Differentiate, then substitute the $x$-value.",
      worked: {
        title: "Quick example first",
        problem: "Find the gradient of $y = x^4 - 2x^2$ at $x = 1$.",
        steps: [
          "Differentiate with the power rule: $\\dfrac{dy}{dx} = 4x^3 - 4x$.",
          "Substitute $x = 1$: $4(1)^3 - 4(1) = 4 - 4$.",
          "Gradient $= 0$. Now try the one below the same way."
        ]
      }
    },
    steps: [
      {
        kind: "mcq",
        prompt: "First step: differentiate. What is $\\dfrac{dy}{dx}$?",
        options: ["$3x^2 - 12x$", "$3x^2 - 6x$", "$3x^2 - 12x + 5$", "$x^4 - 2x^3$"],
        correctIndex: 0,
        hint: "Use the power rule term by term; the constant differentiates to $0$.",
        explanation: "$\\dfrac{d}{dx}(x^3) = 3x^2$, $\\dfrac{d}{dx}(-6x^2) = -12x$, $\\dfrac{d}{dx}(5)=0$."
      },
      {
        kind: "text",
        prompt: "Now substitute $x = 2$. Type the gradient.",
        accepted: ["-12"],
        hint: "Evaluate $3(2)^2 - 12(2)$.",
        explanation: "$3(4) - 12(2) = 12 - 24 = -12$."
      }
    ]
  },
  {
    course: "Advanced", year: 12, topic: "Integration", difficulty: 3,
    title: "Definite integral",
    keyConcept: "The fundamental theorem of calculus",
    prompt: "Evaluate $\\displaystyle\\int_0^3 (2x + 1)\\,dx$.",
    scratchpad: true,
    final_answer: "$12$",
    explanation: "$\\int (2x+1)\\,dx = x^2 + x$. Evaluate: $(9+3)-(0)=12$.",
    concept: {
      kind: "area",
      title: "The idea: area under a curve",
      captions: [
        "How much area sits under a curve between two points?",
        "Chop it into thin rectangles and add them up.",
        "Use more and more, ever-thinner rectangles to close the gaps.",
        "In the limit they fit perfectly, and that sum is the definite integral.",
        "We compute it by evaluating the antiderivative at the top and bottom limits."
      ],
      takeaway: "$\\displaystyle\\int_a^b f(x)\\,dx = F(b) - F(a)$, where $F$ is an antiderivative of $f$.",
      worked: {
        title: "Quick example first",
        problem: "Evaluate $\\displaystyle\\int_1^2 3x^2\\,dx$.",
        steps: [
          "Antiderivative of $3x^2$ is $x^3$.",
          "Evaluate at the limits: $[x^3]_1^2 = 2^3 - 1^3 = 8 - 1$.",
          "Answer $= 7$. The one below works the same way."
        ]
      }
    },
    steps: [
      {
        kind: "text",
        prompt: "Type the value of the integral.",
        accepted: ["12"],
        hint: "Antiderivative is $x^2 + x$; substitute the limits.",
        explanation: "$[x^2+x]_0^3 = (9+3) - 0 = 12$."
      }
    ]
  },
  {
    course: "Advanced", year: 12, topic: "Logarithms", difficulty: 2,
    title: "Solve an exponential",
    keyConcept: "Powers of a common base",
    prompt: "Solve $2^x = 16$.",
    scratchpad: true,
    final_answer: "$x = 4$",
    explanation: "$16 = 2^4$, so $2^x = 2^4$ and therefore $x = 4$.",
    concept: {
      kind: "exponential",
      title: "The idea: matching powers",
      captions: [
        "An exponential like 2^x doubles every time x rises by 1.",
        "So 2^1=2, 2^2=4, 2^3=8, 2^4=16. It climbs fast.",
        "To solve 2^x = 16, find where the curve reaches 16.",
        "16 is exactly 2^4, so the curve passes through (4, 16).",
        "Same base means equal exponents, so x = 4."
      ],
      takeaway: "If $a^x = a^k$ then $x = k$. Rewrite both sides as powers of the same base, then match the exponents.",
      worked: {
        title: "Quick example first",
        problem: "Solve $3^x = 81$.",
        steps: [
          "Write 81 as a power of 3: $81 = 3^4$.",
          "So $3^x = 3^4$. The bases match, so the exponents must match.",
          "$x = 4$. The one below works the same way."
        ]
      }
    },
    steps: [
      {
        kind: "mcq",
        prompt: "First step: rewrite $16$ as a power of $2$.",
        options: ["$2^4$", "$2^3$", "$2^8$", "$4^2$"],
        correctIndex: 0,
        hint: "Keep doubling: $2, 4, 8, 16$. How many doublings?",
        explanation: "$2 \\times 2 \\times 2 \\times 2 = 16$, so $16 = 2^4$."
      },
      {
        kind: "text",
        prompt: "Now $2^x = 2^4$. Match the exponents and type $x$.",
        accepted: ["4", "x=4"],
        hint: "Same base means the powers are equal.",
        explanation: "$2^x = 2^4 \\Rightarrow x = 4$."
      }
    ]
  },
  {
    course: "Advanced", year: 12, topic: "Differentiation", difficulty: 3,
    title: "Differentiate a product",
    keyConcept: "The product rule",
    prompt: "Differentiate $y = x^3 \\sin x$.",
    scratchpad: true,
    final_answer: "$3x^2\\sin x + x^3\\cos x$",
    explanation: "With $u = x^3$ and $v = \\sin x$: $u' = 3x^2$, $v' = \\cos x$, so $y' = u'v + uv' = 3x^2\\sin x + x^3\\cos x$.",
    concept: {
      kind: "product",
      title: "The idea: the product rule",
      captions: [
        "Picture a rectangle of width u and height v. Its area is u times v.",
        "Nudge x a little: the width grows by du and the height by dv.",
        "That adds two strips: v·du down the side and u·dv along the top.",
        "The tiny corner du·dv is negligible, so we drop it.",
        "So the rate of change of uv is u'v + uv'. That is the product rule."
      ],
      takeaway: "Product rule: if $y = uv$ then $\\dfrac{dy}{dx} = u'v + uv'$. Label the two factors, differentiate each, then combine.",
      worked: {
        title: "Watch it applied first",
        problem: "Differentiate $y = x^2 e^x$.",
        steps: [
          "Label the factors: $u = x^2$ and $v = e^x$.",
          "Differentiate each: $u' = 2x$ and $v' = e^x$.",
          "Combine with $u'v + uv'$: $2x\\,e^x + x^2 e^x$.",
          "Factor if you like: $xe^x(2 + x)$. Now apply the same pattern below."
        ]
      }
    },
    steps: [
      {
        kind: "mcq",
        prompt: "First step: label $u = x^3$, $v = \\sin x$. What are $u'$ and $v'$?",
        options: [
          "$u' = 3x^2,\\; v' = \\cos x$",
          "$u' = 3x^2,\\; v' = -\\cos x$",
          "$u' = x^4/4,\\; v' = \\cos x$",
          "$u' = 3x^2,\\; v' = \\sin x$"
        ],
        correctIndex: 0,
        hint: "Power rule for $x^3$; the derivative of $\\sin x$ is $\\cos x$.",
        explanation: "$\\dfrac{d}{dx}x^3 = 3x^2$ and $\\dfrac{d}{dx}\\sin x = \\cos x$."
      },
      {
        kind: "text",
        prompt: "Now combine with $u'v + uv'$. Type $\\dfrac{dy}{dx}$.",
        accepted: [
          "3x^2sinx+x^3cosx",
          "3x^2sin(x)+x^3cos(x)",
          "x^3cosx+3x^2sinx",
          "x^3cos(x)+3x^2sin(x)"
        ],
        hint: "$y' = u'v + uv' = (3x^2)(\\sin x) + (x^3)(\\cos x)$.",
        explanation: "$y' = 3x^2\\sin x + x^3\\cos x$."
      }
    ]
  },

  // ---------------- EXTENSION 1 ----------------
  {
    course: "Extension 1", year: 11, topic: "Polynomials", difficulty: 3,
    title: "Remainder theorem",
    keyConcept: "The remainder theorem",
    prompt: "Find the remainder when $P(x) = x^3 - 2x^2 + 4$ is divided by $(x - 2)$.",
    scratchpad: true,
    final_answer: "$4$",
    explanation: "By the remainder theorem the remainder is $P(2) = 8 - 8 + 4 = 4$.",
    steps: [
      {
        kind: "mcq",
        prompt: "First step: by the remainder theorem, what should you evaluate?",
        options: ["$P(2)$", "$P(-2)$", "$P(0)$", "$P'(2)$"],
        correctIndex: 0,
        hint: "Dividing by $(x-a)$ gives a remainder of $P(a)$.",
        explanation: "Here $a = 2$, so evaluate $P(2)$."
      },
      {
        kind: "text",
        prompt: "Now compute the remainder.",
        accepted: ["4"],
        hint: "Substitute $x = 2$ into $P(x)$.",
        explanation: "$P(2) = 8 - 8 + 4 = 4$."
      }
    ]
  },
  {
    course: "Extension 1", year: 11, topic: "Combinatorics", difficulty: 2,
    title: "Arrangements",
    keyConcept: "Factorials: n!",
    prompt: "How many distinct arrangements are there of the letters in the word $\\text{MATHS}$?",
    scratchpad: false,
    final_answer: "$120$",
    explanation: "$5$ distinct letters → $5! = 120$.",
    steps: [
      {
        kind: "mcq",
        prompt: "How many arrangements?",
        options: ["$120$", "$24$", "$60$", "$720$"],
        correctIndex: 0,
        hint: "All 5 letters are different.",
        explanation: "$5! = 5\\times4\\times3\\times2\\times1 = 120$."
      }
    ]
  },
  {
    course: "Extension 1", year: 12, topic: "Mathematical Induction", difficulty: 4,
    title: "First step of induction",
    keyConcept: "Proof by induction",
    prompt: "You are proving $\\displaystyle\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$ by mathematical induction.",
    scratchpad: false,
    final_answer: "Prove the base case $n = 1$.",
    explanation: "Induction starts by verifying the statement for the smallest value, $n=1$, then assuming $n=k$ and proving $n=k+1$.",
    steps: [
      {
        kind: "mcq",
        prompt: "What is the correct first step?",
        options: [
          "Prove the statement is true for $n = 1$",
          "Assume the statement is true for $n = k$",
          "Differentiate both sides",
          "Prove it for $n = k + 1$"
        ],
        correctIndex: 0,
        hint: "Induction always begins with a base case.",
        explanation: "First establish the base case $n=1$ before the inductive step."
      },
      {
        kind: "text",
        prompt: "Evaluate the right-hand side $\\frac{n(n+1)}{2}$ when $n = 1$.",
        accepted: ["1"],
        hint: "Substitute $n = 1$.",
        explanation: "$\\frac{1(1+1)}{2} = \\frac{2}{2} = 1$, matching the LHS sum $=1$."
      }
    ]
  },
  {
    course: "Extension 1", year: 12, topic: "Vectors", difficulty: 2,
    title: "Magnitude of a vector",
    keyConcept: "Vector magnitude",
    prompt: "Given $\\mathbf{a} = 3\\mathbf{i} + 4\\mathbf{j}$, find $|\\mathbf{a}|$.",
    scratchpad: false,
    final_answer: "$5$",
    explanation: "$|\\mathbf{a}| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.",
    steps: [
      {
        kind: "text",
        prompt: "Type the magnitude.",
        accepted: ["5"],
        hint: "$|\\mathbf{a}| = \\sqrt{x^2 + y^2}$.",
        explanation: "$\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$."
      }
    ]
  },

  // ---------------- EXTENSION 2 ----------------
  {
    course: "Extension 2", year: 12, topic: "Complex Numbers", difficulty: 4,
    title: "Modulus–argument form",
    keyConcept: "Modulus and argument",
    prompt: "Let $z = 1 + i$. Express $z$ in modulus–argument form.",
    scratchpad: true,
    final_answer: "$z = \\sqrt{2}\\,\\operatorname{cis}\\frac{\\pi}{4}$",
    explanation: "$|z| = \\sqrt{1^2+1^2} = \\sqrt{2}$ and $\\arg z = \\tan^{-1}(1) = \\frac{\\pi}{4}$.",
    steps: [
      {
        kind: "text",
        prompt: "First find the modulus $|z|$.",
        accepted: ["sqrt(2)", "sqrt2", "√2", "rt2", "1.41", "1.414"],
        hint: "$|z| = \\sqrt{a^2 + b^2}$ for $z = a + bi$.",
        explanation: "$|z| = \\sqrt{1 + 1} = \\sqrt{2}$."
      },
      {
        kind: "mcq",
        prompt: "What is $\\arg z$?",
        options: ["$\\frac{\\pi}{4}$", "$\\frac{\\pi}{2}$", "$\\frac{\\pi}{3}$", "$\\frac{3\\pi}{4}$"],
        correctIndex: 0,
        hint: "$z$ lies in the first quadrant; $\\arg z = \\tan^{-1}\\!\\frac{b}{a}$.",
        explanation: "$\\tan^{-1}\\!\\frac{1}{1} = \\frac{\\pi}{4}$."
      }
    ]
  },
  {
    course: "Extension 2", year: 12, topic: "Integration Techniques", difficulty: 4,
    title: "Choose a technique",
    keyConcept: "Integration by parts",
    prompt: "You need to evaluate $\\displaystyle\\int x e^{x}\\,dx$.",
    scratchpad: false,
    final_answer: "Integration by parts: $xe^x - e^x + C$",
    explanation: "A product of a polynomial and an exponential → integration by parts with $u = x$, $dv = e^x\\,dx$.",
    steps: [
      {
        kind: "mcq",
        prompt: "Which technique is most appropriate?",
        options: ["Integration by parts", "$u$-substitution", "Partial fractions", "Trigonometric substitution"],
        correctIndex: 0,
        hint: "The integrand is a product of two different kinds of functions.",
        explanation: "Integration by parts handles $\\int u\\,dv$ where $u=x$, $dv=e^x dx$."
      },
      {
        kind: "text",
        prompt: "Using $u = x$, $dv = e^x dx$, type the result (use C for the constant).",
        accepted: ["xe^x-e^x+c", "xe^x - e^x + c", "(x-1)e^x+c", "e^x(x-1)+c"],
        hint: "$\\int u\\,dv = uv - \\int v\\,du = xe^x - \\int e^x dx$.",
        explanation: "$xe^x - e^x + C = (x-1)e^x + C$."
      }
    ]
  }
];

// --- Insert ---------------------------------------------------------------
const reset = db.transaction(() => {
  db.exec("DELETE FROM attempts; DELETE FROM questions;");
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('questions','attempts');");
  const insert = db.prepare(`
    INSERT INTO questions
      (course, year, topic, difficulty, title, prompt, scratchpad, final_answer, explanation, key_concept, concept, steps)
    VALUES
      (@course, @year, @topic, @difficulty, @title, @prompt, @scratchpad, @final_answer, @explanation, @key_concept, @concept, @steps)
  `);
  for (const q of questions) {
    // Drop the camelCase `keyConcept` from the spread; the column is `key_concept`.
    const { keyConcept, ...rest } = q;
    insert.run({
      ...rest,
      scratchpad: q.scratchpad ? 1 : 0,
      key_concept: keyConcept ?? null,
      concept: q.concept ? JSON.stringify(q.concept) : null,
      steps: JSON.stringify(q.steps)
    });
  }
});

reset();
const count = db.prepare("SELECT COUNT(*) AS n FROM questions").get().n;
console.log(`✅ Seeded ${count} MathReels questions across NSW ATAR courses.`);
