/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ██████╗ ██╗████████╗ ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ███╗███████╗
 *  ██╔══██╗██║╚══██╔══╝██╔════╝██║  ██║██╔══██╗██╔═══██╗████╗ ████║██╔════╝
 *  ██████╔╝██║   ██║   ██║     ███████║██████╔╝██║   ██║██╔████╔██║█████╗
 *  ██╔══██╗██║   ██║   ██║     ██╔══██║██╔══██╗██║   ██║██║╚██╔╝██║██╔══╝
 *  ██████╔╝██║   ██║   ╚██████╗██║  ██║██████╔╝╚██████╔╝██║ ╚═╝ ██║███████╗
 *  ╚═════╝ ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚══════╝
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  THIS IS THE ONLY FILE YOU NEED TO EDIT.
 *  Every word on the website comes from here. Open this file, change the
 *  values marked  👈 EDIT  below, save, and the whole site updates.
 *
 *  ─────────────────────────  QUICK START  ─────────────────────────
 *  The 8 things most people change (all in this file):
 *
 *    1.  name                        → your name (Hero + About screens)
 *    2.  title                       → your role line
 *    3.  hero.lines                  → the typed lines on the home screen
 *    4.  about.bio                   → your about-me paragraphs
 *    5.  skills.skills               → your skills + proficiency %
 *    6.  projects.items              → your projects
 *    7.  timeline.entries            → your career milestones
 *    8.  contact.connections +
 *        googleCalendarBookingUrl    → email, github, linkedin, booking link
 *
 *  See SETUP.md in the project root for the full step-by-step guide.
 * ════════════════════════════════════════════════════════════════════════════
 */

export type Skill = { name: string; level: number /* 0..100 */; note?: string };
export type Project = {
  id: string;
  index: string; // "01"
  codename: string;
  title: string;
  status: "COMPLETE" | "ACTIVE" | "CLASSIFIED" | "ARCHIVED";
  classification: string; // "LV.3 CLEARANCE"
  description: string;
  technologies: string[];
  year: string;
  link?: string;
  intercept?: string[]; // optional dossier "intercept" log lines
};
export type TimelineEntry = { year: string; event: string; detail: string };
export type Social = {
  label: string;
  value: string;
  href: string;
  kind: "EMAIL" | "GITHUB" | "LINKEDIN" | "CALENDAR" | "OTHER";
};

export const siteConfig = {
  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  1. IDENTITY  — who you are                                       │
  //  └──────────────────────────────────────────────────────────────────┘
  // ═══════════════════════════════════════════════════════════════════════
  name: "MANJUNATHA P", // 👈 EDIT — your name (shown on Hero + About)
  handle: "ROOT@FEDORA", // optional — the terminal prompt label
  title: "ETHICAL HACKER · PROGRAMMER · SECURITY RESEARCHER", // 👈 EDIT — your role
  tagline: "BUILDING SYSTEMS / BREAKING SYSTEMS / UNDERSTANDING SYSTEMS", // 👈 EDIT

  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  2. HERO SCREEN  — the typed lines on channel 01                  │
  //  └──────────────────────────────────────────────────────────────────┘
  //  Each line types in one at a time. The line matching `name` above
  //  renders large. Keep lines short for impact.
  // ═══════════════════════════════════════════════════════════════════════
  hero: {
    lines: [
      "HELLO, I AM",
      "MANJUNATHA P", // 👈 EDIT — keep this identical to `name` for the large style
      "ETHICAL HACKER",
      "PROGRAMMER",
      "SECURITY RESEARCHER",
      "BUILDING SYSTEMS",
      "BREAKING SYSTEMS",
      "UNDERSTANDING SYSTEMS",
    ],
    subtitle: "YOU ARE BEING WATCHED. NOT BY ME. BY THE MACHINE.", // 👈 EDIT
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  3. ABOUT SCREEN  — channel 02, a diagnostic report               │
  //  └──────────────────────────────────────────────────────────────────┘
  //  `fields` = the key/value table. `bio` = typed paragraphs below it.
  // ═══════════════════════════════════════════════════════════════════════
  about: {
    subjectLabel: "SUBJECT IDENTIFIED",
    fields: [
      { k: "NAME", v: "MANJUNATHA P" }, // 👈 EDIT
      { k: "DESIGNATION", v: "CSE STUDENT" }, // 👈 EDIT
      { k: "STATUS", v: "ONLINE" },
      { k: "UPTIME", v: "∞ DAYS" },
      {
        k: "SPECIALIZATION",
        v: "OFFENSIVE SECURITY / SOFTWARE ENGINEERING / NETWORKING",
      }, // 👈 EDIT
      { k: "THREAT MODEL", v: "ADVERSARIAL · CURIOUS · PATIENT" }, // 👈 EDIT
      { k: "CURRENT OBJECTIVE", v: "BUILD THINGS THAT SHOULD EXIST." }, // 👈 EDIT
      { k: "CLEARANCE", v: "SELF-ISSUED" },
    ],
    bio: [
      // 👈 EDIT — your about-me paragraphs (one string per line)
      "I FIND BROKEN SYSTEMS MORE INTERESTING THAN WORKING ONES.",
      "EVERY MACHINE HAS A LANGUAGE IT WAS NEVER MEANT TO SPEAK.",
      "I LEARN THAT LANGUAGE. THEN I TEACH IT BACK SOMETHING BETTER.",
      "SOMEWHERE BETWEEN A RESEARCHER AND A GHOST IN THE WIRES.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  4. SKILLS  — channel 03, a fake "memory scan"                    │
  //  └──────────────────────────────────────────────────────────────────┘
  //  `level` is 0–100 (how full the bar gets). Add/remove freely.
  // ═══════════════════════════════════════════════════════════════════════
  skills: {
    header: "MEMORY SCAN",
    scanningLabel: "SCANNING...",
    skills: [
      { name: "GIT & GITHUB", level: 100 },
      { name: "LINUX", level: 95 },
      { name: "C++", level: 95 },
      { name: "JAVA", level: 95 },
      { name: "GOLANG", level: 65 },
      { name: "WEB SECURITY", level: 92 },
      { name: "PYTHON", level: 95 },
      { name: "NETWORKING", level: 90 },
      { name: "REACT / NEXT", level: 90 },
      { name: "DATABASES", level: 89 },
      { name: "DSA", level: 85 },
      { name: "C / ASM", level: 80 },
      { name: "JAVASCRIPT", level: 79 },
      { name: "CRYPTOGRAPHY", level: 70 },
    ] as Skill[],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  5. PROJECTS  — channel 04, "classified dossiers"                 │
  //  └──────────────────────────────────────────────────────────────────┘
  //  Each item = one dossier card. Click opens a modal. Set status to
  //  "CLASSIFIED" to show a sealed/redacted file (fun easter egg).
  //  `link` is optional (omit or "#" for none).
  // ═══════════════════════════════════════════════════════════════════════
  projects: {
    header: "ARCHIVE",
    accessingLabel: "ACCESSING ARCHIVE...",
    items: [
      {
        id: "secret-scanner",
        index: "01",
        codename: "SECRET SCANNER",
        title: "SECRET SCANNER — CREDENTIAL LEAK DETECTOR",
        status: "COMPLETE",
        classification: "LV.2 — SECURITY TOOL",
        year: "2024",
        description:
          "A LIGHTWEIGHT SECURITY SCANNER BUILT TO DETECT EXPOSED CREDENTIALS, API KEYS, TOKENS, AND OTHER SENSITIVE SECRETS ACROSS SOURCE CODE. FEATURES PATTERN-BASED DETECTION, RECURSIVE DIRECTORY ANALYSIS, AND FAST SCANNING TO HELP PREVENT ACCIDENTAL SECRET EXPOSURE BEFORE DEPLOYMENT.",
        technologies: [
          "PYTHON",
          "REGEX",
          "STATIC ANALYSIS",
          "CLI",
          "SECURITY AUTOMATION",
        ],
        intercept: [
          "> SCANNING SOURCE TREE",
          "> API TOKEN DETECTED",
          "> REPORT GENERATED",
        ],
        link: "https://github.com/namelessweakl1ng/secret-scanner",
      },
      {
        id: "lost",
        index: "02",
        codename: "LOST",
        title: "LOST — LOST & FOUND ITEM TRACKER",
        status: "COMPLETE",
        classification: "LV.2 — CAMPUS MANAGEMENT",
        year: "2024",
        description:
          "A FULL-STACK LOST & FOUND MANAGEMENT PLATFORM DESIGNED TO HELP STUDENTS REPORT, DISCOVER, AND RECLAIM MISPLACED BELONGINGS. FEATURES SECURE USER AUTHENTICATION, ITEM LISTINGS, SEARCH AND FILTER CAPABILITIES, IMAGE UPLOADS, AND STATUS TRACKING TO STREAMLINE THE RECOVERY PROCESS WITHIN A CAMPUS COMMUNITY.", // Based on common lost-and-found tracker functionality. :contentReference[oaicite:0]{index=0}
        technologies: ["REACT", "NODE.JS", "EXPRESS", "MONGODB", "JWT"],
        intercept: [
          "> LOST ITEM REPORTED",
          "> MATCH FOUND IN DATABASE",
          "> ITEM SUCCESSFULLY RECLAIMED",
        ],
        link: "https://github.com/namelessweakl1ng/mini-project-5thsem",
      },
      {
        id: "brain-tumor",
        index: "03",
        codename: "NEUROSCAN",
        title: "NEUROSCAN — BRAIN TUMOR DETECTION",
        status: "COMPLETE",
        classification: "LV.3 — AI/ML RESEARCH",
        year: "2024",
        description:
          "AN AI-POWERED MEDICAL IMAGING SYSTEM DESIGNED TO DETECT BRAIN TUMORS FROM MRI SCANS USING DEEP LEARNING. FEATURES IMAGE PREPROCESSING, AUTOMATED PREDICTIONS, AND A SIMPLE WEB INTERFACE TO DEMONSTRATE FAST AND ACCURATE TUMOR CLASSIFICATION FOR RESEARCH AND EDUCATIONAL PURPOSES.",
        technologies: ["PYTHON", "TENSORFLOW", "CNN", "OPENCV", "FLASK"],
        intercept: [
          "> MRI SCAN LOADED",
          "> TUMOR ANALYSIS COMPLETE",
          "> PREDICTION CONFIDENCE: 98.2%",
        ],
        link: "https://github.com/namelessweakl1ng/brain-tumor",
      },
      {
        id: "searchsmith",
        index: "04",
        codename: "SEARCHSMITH",
        title: "SEARCHSMITH — INTELLIGENT SEARCH ENGINE",
        status: "COMPLETE",
        classification: "LV.3 — AI SEARCH SYSTEM",
        year: "2024",
        description:
          "AN AI-POWERED SEARCH PLATFORM DESIGNED TO DELIVER FAST AND RELEVANT RESULTS ACROSS LARGE DATASETS. COMBINES SEMANTIC SEARCH, KEYWORD MATCHING, AND RANKING ALGORITHMS TO PROVIDE ACCURATE INFORMATION RETRIEVAL THROUGH A CLEAN AND RESPONSIVE INTERFACE.",
        technologies: ["PYTHON", "FASTAPI", "REACT", "VECTOR SEARCH", "LLMS"],
        intercept: [
          "> INDEXING DOCUMENTS",
          "> QUERY EMBEDDING GENERATED",
          "> TOP MATCHES RETURNED",
        ],
        link: "https://github.com/namelessweakl1ng/SearchSmith",
      },
      {
        id: "churn",
        index: "05",
        codename: "RETAIN",
        title: "RETAIN — CUSTOMER CHURN PREDICTION",
        status: "COMPLETE",
        classification: "LV.3 — MACHINE LEARNING",
        year: "2026",
        description:
          "AN END-TO-END MACHINE LEARNING PIPELINE BUILT TO PREDICT CUSTOMER CHURN USING BEHAVIORAL AND TRANSACTIONAL DATA. INCLUDES DATA PREPROCESSING, FEATURE ENGINEERING, MODEL TRAINING, AND EXPLAINABILITY TO IDENTIFY HIGH-RISK CUSTOMERS AND SUPPORT DATA-DRIVEN RETENTION STRATEGIES.",
        technologies: ["PYTHON", "PANDAS", "SCIKIT-LEARN", "XGBOOST", "SQL"],
        intercept: [
          "> DATASET INGESTED",
          "> CHURN PROBABILITY COMPUTED",
          "> RETENTION INSIGHTS GENERATED",
        ],
        link: "https://github.com/namelessweakl1ng/CUSTOMER-CHURN-PREDICTION",
      },
      {
        id: "sales-dashboard",
        index: "06",
        codename: "INSIGHT",
        title: "INSIGHT — SALES ANALYTICS DASHBOARD",
        status: "COMPLETE",
        classification: "LV.2 — BUSINESS INTELLIGENCE",
        year: "2026",
        description:
          "A BUSINESS INTELLIGENCE PLATFORM DESIGNED TO ANALYZE SALES PERFORMANCE, CUSTOMER BEHAVIOR, AND REGIONAL KPIS. COMBINES SQL, PYTHON, AND POWER BI TO AUTOMATE REPORTING, VISUALIZE KEY METRICS, AND UNCOVER ACTIONABLE BUSINESS INSIGHTS FROM LARGE-SCALE SALES DATA.",
        technologies: [
          "SQL",
          "POWER BI",
          "PYTHON",
          "EXCEL",
          "DATA VISUALIZATION",
        ],
        intercept: [
          "> SALES DATA INDEXED",
          "> KPI DASHBOARDS UPDATED",
          "> REPORT AUTOMATION COMPLETE",
        ],
        link: "https://github.com/namelessweakl1ng/SALES-ANALYTICS-DASHBOARD",
      },
      {
        id: "mlops",
        index: "07",
        codename: "PIPELINE",
        title: "PIPELINE — END-TO-END MLOPS PLATFORM",
        status: "COMPLETE",
        classification: "LV.4 — PRODUCTION ML",
        year: "2026",
        description:
          "A PRODUCTION-READY MLOPS PIPELINE FOR TRAINING, VERSIONING, DEPLOYING, AND SERVING MACHINE LEARNING MODELS. FEATURES CONTAINERIZED DEPLOYMENTS, EXPERIMENT TRACKING, CI/CD AUTOMATION, AND SCALABLE REST APIS FOR REAL-TIME MODEL INFERENCE.",
        technologies: ["FASTAPI", "DOCKER", "MLFLOW", "AWS", "GITHUB ACTIONS"],
        intercept: [
          "> MODEL REGISTERED",
          "> CI/CD PIPELINE PASSED",
          "> INFERENCE SERVICE ONLINE",
        ],
        link: "https://github.com/namelessweakl1ng/END-TO-END-MLOPS-PLATFORM",
      },
      {
        id: "data-classification",
        index: "01",
        codename: "SENTINEL",
        title: "SENTINEL — DATA CLASSIFICATION & ACCESS CONTROL",
        status: "COMPLETE",
        classification: "LV.4 — INFORMATION SECURITY",
        year: "2025",
        description:
          "A ROLE-BASED DATA CLASSIFICATION AND ACCESS CONTROL PLATFORM BUILT TO ENFORCE SECURE INFORMATION HANDLING. FEATURES USER AUTHENTICATION, CLASSIFICATION-LEVEL PERMISSIONS, DYNAMIC ACCESS POLICIES, AND AUDITABLE RECORD MANAGEMENT TO ENSURE AUTHORIZED DATA ACCESS ACROSS THE SYSTEM.",
        technologies: ["DJANGO", "REACT", "POSTGRESQL", "RBAC", "REST API"],
        intercept: [
          "> USER AUTHENTICATED",
          "> ACCESS POLICY VERIFIED",
          "> CLASSIFIED DATA RELEASED",
        ],
        link: "https://github.com/namelessweakl1ng/HACK-THE-HACKERS",
      },
      {
        id: "qr-guardian",
        index: "08",
        codename: "QR-GUARDIAN",
        title: "QR-GUARDIAN — QR THREAT ANALYZER",
        status: "COMPLETE",
        classification: "LV.4 — CYBERSECURITY",
        year: "2025",
        description:
          "A SERVERLESS QR CODE SECURITY PLATFORM THAT ANALYZES QR CODES AND EMBEDDED URLS FOR POTENTIAL THREATS USING THE VIRUSTOTAL API. BUILT WITH A STATIC WEB FRONTEND AND NETLIFY FUNCTIONS, THE APPLICATION PERFORMS REAL-TIME URL INSPECTION, FILE ANALYSIS, HEALTH MONITORING, AND SECURE API PROXYING WHILE KEEPING SENSITIVE API KEYS PROTECTED IN SERVER-SIDE ENVIRONMENT VARIABLES.",

        technologies: [
          "HTML",
          "CSS",
          "JAVASCRIPT",
          "NETLIFY FUNCTIONS",
          "VIRUSTOTAL API",
        ],

        intercept: [
          "> QR PAYLOAD EXTRACTED",
          "> VIRUSTOTAL ANALYSIS COMPLETE",
          "> THREAT SCORE: CLEAN",
        ],

        link: "https://github.com/namelessweakl1ng/QR-GUARDIAN",
      },
      {
        id: "password-analyzer",
        index: "09",
        codename: "FORTIFY",
        title: "FORTIFY — PASSWORD SECURITY ANALYZER",
        status: "COMPLETE",
        classification: "LV.3 — SECURITY ANALYSIS",
        year: "2025",
        description:
          "A PASSWORD SECURITY ANALYSIS TOOL DESIGNED TO EVALUATE PASSWORD STRENGTH, IDENTIFY COMMON WEAKNESSES, AND ENFORCE MODERN SECURITY BEST PRACTICES. FEATURES ENTROPY ESTIMATION, PATTERN DETECTION, BREACH-AWARE VALIDATION, AND ACTIONABLE FEEDBACK TO HELP USERS CREATE MORE RESILIENT CREDENTIALS.",
        technologies: [
          "PYTHON",
          "REGEX",
          "ENTROPY ANALYSIS",
          "SECURITY",
          "CLI",
        ],
        intercept: [
          "> PASSWORD RECEIVED",
          "> STRENGTH ANALYSIS COMPLETE",
          "> SECURITY SCORE GENERATED",
        ],
        link: "https://github.com/namelessweakl1ng/password-analyzer",
      },
      {
        id: "money-mess",
        index: "10",
        codename: "LEDGER",
        title: "LEDGER — EXPENSE SPLITTER",
        status: "COMPLETE",
        classification: "LV.2 — FINANCIAL MANAGEMENT",
        year: "2025",
        description:
          "A FULL-STACK EXPENSE SPLITTING APPLICATION BUILT WITH FLASK AND A LIGHTWEIGHT HTML/CSS/JAVASCRIPT FRONTEND. SUPPORTS MULTIPLE TRIPS, PARTICIPANT MANAGEMENT, EXPENSE TRACKING, AUTOMATIC SETTLEMENT CALCULATIONS, AND JSON-BASED DATA PERSISTENCE THROUGH A RESTFUL API.",
        technologies: ["PYTHON", "FLASK", "HTML", "CSS", "JAVASCRIPT"],
        intercept: [
          "> TRIP INITIALIZED",
          "> EXPENSES RECONCILED",
          "> SETTLEMENT PLAN GENERATED",
        ],
        link: "https://github.com/namelessweakl1ng/money-mess",
      },
      {
        id: "hollow",
        index: "12",
        codename: "HOLLOW",
        title: "HOLLOW — [CLASSIFIED]",
        status: "CLASSIFIED", // leave as CLASSIFIED for the sealed-file easter egg
        classification: "LV.6 — SEALED",
        year: "????",
        description:
          "// FILE INTEGRITY FLAG: CORRUPT // CONTENTS REDACTED BY FACILITY PROTOCOL // ACCESS REQUIRES ROOT CREDENTIALS NOT ISSUED TO THIS TERMINAL.",
        technologies: ["UNKNOWN", "UNKNOWN", "UNKNOWN"],
        intercept: [
          "> ACCESS DENIED",
          "> FILE SIGNATURE MISMATCH",
          "// TRY HARDER",
        ],
      },
    ] as Project[],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  6. TIMELINE  — channel 05, a "system boot log"                   │
  //  └──────────────────────────────────────────────────────────────────┘
  //  Most recent last. One entry per milestone.
  // ═══════════════════════════════════════════════════════════════════════
  timeline: {
    header: "SYSTEM LOG",
    entries: [
      {
        year: "2023",
        event: "FIRST PROGRAM",
        detail:
          "WROTE MY FIRST PYTHON SCRIPT. IT LIED ABOUT THE WEATHER, BUT IT FELT LIKE MAGIC.",
      },
      {
        year: "2023",
        event: "DISCOVERED LINUX",
        detail:
          "FOUND /ETC/SHADOW. CURIOSITY TOOK OVER, AND THERE WAS NO TURNING BACK.",
      },
      {
        year: "2023",
        event: "KALI LINUX WORKSHOP",
        detail:
          "ATTENDED MY FIRST CYBERSECURITY WORKSHOP AND DISCOVERED THE WORLD OF ETHICAL HACKING.",
      },
      {
        year: "2024",
        event: "LEARNED WEB SECURITY",
        detail:
          "THE OWASP TOP TEN BECAME A CHECKLIST, THEN A PLAYGROUND FOR LEARNING.",
      },
      {
        year: "2024",
        event: "HACK YUGMA",
        detail:
          "PARTICIPATED IN MY FIRST HACKATHON, TURNING IDEAS INTO A WORKING PROTOTYPE UNDER PRESSURE.",
      },
      {
        year: "2024",
        event: "WADHWANI ENTREPRENEURSHIP WORKSHOP",
        detail:
          "EXPLORED PRODUCT DEVELOPMENT, STARTUP THINKING, AND THE FUNDAMENTALS OF BUILDING A BUSINESS.",
      },
      {
        year: "2025",
        event: "HACKOTSAVA",
        detail:
          "COMPETED IN ANOTHER HACKATHON, REFINING TEAMWORK, RAPID DEVELOPMENT, AND PROBLEM-SOLVING SKILLS.",
      },
      {
        year: "2025",
        event: "GOOGLE CYBERSECURITY CERTIFICATE",
        detail:
          "COMPLETED THE PROFESSIONAL CERTIFICATION, STRENGTHENING FOUNDATIONS IN SECURITY OPERATIONS, NETWORK DEFENSE, AND RISK MANAGEMENT.",
      },
      {
        year: "2026",
        event: "GOOGLE CLOUD ENGINEER CERTIFICATE",
        detail:
          "EARNED THE GOOGLE CLOUD CERTIFICATION, GAINING HANDS-ON EXPERIENCE WITH MODERN CLOUD INFRASTRUCTURE AND DEPLOYMENT.",
      },
      {
        year: "2026",
        event: "IBM ETHICAL HACKING CERTIFICATE",
        detail:
          "COMPLETED SPECIALIZED TRAINING IN ETHICAL HACKING METHODOLOGIES, VULNERABILITY ASSESSMENT, AND PENETRATION TESTING.",
      },
      {
        year: "2026",
        event: "HACKBRICKS",
        detail:
          "PARTICIPATED IN ANOTHER HACKATHON, BUILDING PRACTICAL SOLUTIONS UNDER TIGHT DEADLINES.",
      },
      {
        year: "2026",
        event: "NPTEL MACHINE LEARNING CERTIFICATION",
        detail:
          "COMPLETED THE NPTEL MACHINE LEARNING COURSE WITH A SCORE OF 69%.",
      },
      {
        year: "2026",
        event: "200 LEETCODE PROBLEMS",
        detail:
          "REACHED THE MILESTONE OF SOLVING 200 DATA STRUCTURES AND ALGORITHMS PROBLEMS.",
      },
      {
        year: "2026",
        event: "ADVANCED PYTHON SCRIPTING FOR CYBERSECURITY",
        detail:
          "MASTERED PYTHON AUTOMATION FOR SECURITY WORKFLOWS, RECONNAISSANCE, AND DEFENSIVE TOOLING.",
      },
      {
        year: "2026",
        event: "CISCO ETHICAL HACKER CERTIFICATE",
        detail:
          "EARNED THE CISCO ETHICAL HACKER CERTIFICATION, EXPANDING KNOWLEDGE OF OFFENSIVE SECURITY TECHNIQUES AND INDUSTRY BEST PRACTICES.",
      },
    ] as TimelineEntry[],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  7. CONTACT  — channel 06, "open secure channel"                  │
  //  └──────────────────────────────────────────────────────────────────┘
  //  Your real links go here. The CALENDAR row opens the booking modal.
  // ═══════════════════════════════════════════════════════════════════════
  contact: {
    header: "OPEN SECURE CHANNEL",
    subheader: "AVAILABLE CONNECTIONS",
    statusLine: "CHANNEL READY · ENCRYPTION: AES-256 · TRUST: UNVERIFIED",
    connections: [
      {
        label: "EMAIL",
        value: "manjunathashivas0p@gmail.com",
        href: "mailto:manjunathashivas0p@gmail.com",
        kind: "EMAIL",
      }, // 👈 EDIT
      {
        label: "GITHUB",
        value: "github.com/namelessweakl1ng",
        href: "https://github.com/namelessweakl1ng/",
        kind: "GITHUB",
      }, // 👈 EDIT
      {
        label: "LINKEDIN",
        value: "linkedin.com/in/manjunatha67p",
        href: "https://www.linkedin.com/in/manjunatha67p/",
        kind: "LINKEDIN",
      }, // 👈 EDIT
      {
        label: "BOOK A MEETING",
        value: "GOOGLE APPOINTMENT SCHEDULE",
        href: "",
        kind: "CALENDAR",
      },
    ] as Social[],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  8. GOOGLE CALENDAR BOOKING URL
  //  ─────────────────────────────────────────────────────────────────────
  //  Replace with your public Google Appointment Schedule URL. Get yours:
  //    Google Calendar → Settings → Scheduling → Appointment schedules
  //    → create one → copy the public booking page URL.
  //  Leave the placeholder to use the new-tab fallback instead of embedding.
  //  Booked slots auto-create a Calendar event + Google Meet link (by Google).
  // ═══════════════════════════════════════════════════════════════════════
  googleCalendarBookingUrl: "https://calendar.app.google/RkFwAp5bpz7cjhEx7", // 👈 EDIT — your booking URL

  resumeUrl: "#", // 👈 EDIT — link to your resume PDF, or "#"

  // ═══════════════════════════════════════════════════════════════════════
  //  ┌──────────────────────────────────────────────────────────────────┐
  //  │  COSMETIC — optional. Tweak only if you want to.                  │
  //  └──────────────────────────────────────────────────────────────────┘
  //  Everything below is flavor / system text. Safe to leave as-is.
  // ═══════════════════════════════════════════════════════════════════════

  /** Boot screen copy (the power-on sequence). */
  boot: {
    terminalId: "RESEARCH TERMINAL 07",
    facility: "BLACKWOOD CYBERNETICS LAB — SUBLEVEL B",
    recovered: "RECOVERED UNIT — EST. 1983",
    promptQuestion: "CONNECTED.",
    promptEnter: "PRESS ENTER",
    memoryLines: [
      "CHECKING MEMORY BANKS...",
      "RAM...... 65536 KB .... OK",
      "ROM...... 8192 KB ..... OK",
      "NVRAM.... 512 KB ...... OK",
      "VRAM..... 1024 KB ..... OK",
    ],
    diagLines: [
      "POST ........................ PASS",
      "PHOSPHOR ARRAY ............. STABLE",
      "DEFLECTION YOKE ............ CALIBRATED",
      "SCAN RATE .... 15.750 KHZ .. LOCKED",
      "SIGNAL CARRIER ............ ACQUIRED",
      "SECURITY DAEMON ........... ENGAGED",
    ],
    beeps: 3,
  },

  /** Theme colors (CRT palette). Change green to retheme the whole site. */
  theme: {
    black: "#000000",
    green: "#00FF66",
    soft: "#7DFFB3",
    cyan: "#00E5FF",
    amber: "#FFB000",
  },

  /** Channel map (order = channel number). Rarely changed. */
  channels: [
    { id: "hero", label: "HELLO", no: "01" },
    { id: "about", label: "SUBJECT", no: "02" },
    { id: "skills", label: "SCAN", no: "03" },
    { id: "projects", label: "ARCHIVE", no: "04" },
    { id: "timeline", label: "LOG", no: "05" },
    { id: "contact", label: "CHANNEL", no: "06" },
  ] as { id: ChannelId; label: string; no: string }[],
} as const;

export type ChannelId =
  "hero" | "about" | "skills" | "projects" | "timeline" | "contact";

export default siteConfig;
