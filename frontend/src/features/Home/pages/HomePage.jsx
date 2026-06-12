import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  DatabaseZap,
  FileCheck2,
  Fingerprint,
  Gauge,
  Layers3,
  LineChart,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Play,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UsersRound,
  WalletCards,
  WandSparkles,
  Workflow,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "AI Suite", href: "#ai-suite" },
  { label: "Workflows", href: "#workflows" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
];

const signals = [
  { label: "Attendance verified", value: "98.4%", accent: "cyan" },
  { label: "Payroll ready", value: "14 min", accent: "lime" },
  { label: "Open requests", value: "23", accent: "coral" },
];

const platformCards = [
  {
    icon: UsersRound,
    title: "Employee Core",
    copy: "Centralized employee profiles, reporting lines, joining details, assets, documents, and lifecycle events.",
  },
  {
    icon: Clock3,
    title: "Attendance & Leave",
    copy: "Shifts, holidays, leave balances, approvals, late marks, and attendance corrections with policy controls.",
  },
  {
    icon: WalletCards,
    title: "Payroll Operations",
    copy: "Payroll inputs, reimbursements, tax declarations, payslips, revisions, and approval-ready registers.",
  },
  {
    icon: BarChart3,
    title: "People Analytics",
    copy: "Headcount, cost, attrition, attendance trends, leave pressure, and department-level HR insights.",
  },
];

const workflows = [
  ["Hire", "Offer, collect documents, trigger onboarding tasks, assign assets, and create workspace access."],
  ["Operate", "Track attendance, leaves, claims, support tickets, documents, and manager approvals daily."],
  ["Pay", "Validate attendance, salary inputs, deductions, reimbursements, taxes, payslips, and payout readiness."],
  ["Improve", "Review performance, compensation, exits, audit logs, and workforce analytics from one timeline."],
];

const roleViews = [
  {
    title: "For founders",
    copy: "Know what changed today, who needs attention, and what payroll will cost before month end.",
    icon: Building2,
  },
  {
    title: "For HR teams",
    copy: "Move every request through a visible queue with owners, due dates, documents, and approval history.",
    icon: Layers3,
  },
  {
    title: "For employees",
    copy: "Give people one simple place for payslips, leaves, policies, support, documents, and updates.",
    icon: MessageSquareText,
  },
];

const plans = [
  {
    name: "Start",
    price: "Free",
    note: "For small teams setting up their first HR system.",
    features: ["People directory", "Leave tracking", "Document vault", "Employee self-service"],
  },
  {
    name: "Operate",
    price: "Custom",
    note: "For growing companies that need payroll and approvals.",
    featured: true,
    features: ["Attendance rules", "Payroll workflows", "Claims and reimbursements", "Analytics dashboard"],
  },
  {
    name: "Scale",
    price: "Custom",
    note: "For multi-location teams with deeper controls.",
    features: ["Role permissions", "Audit logs", "Custom policies", "Priority implementation"],
  },
];

const aiCards = [
  {
    icon: BrainCircuit,
    title: "HR Copilot",
    copy: "Ask leave, payroll, and document questions.",
  },
  {
    icon: ScanSearch,
    title: "Doc AI",
    copy: "Find missing files and expiring IDs.",
  },
  {
    icon: WandSparkles,
    title: "Smart Alerts",
    copy: "Spot delays, exceptions, and risks.",
  },
];

const liveAiItems = [
  ["AI checked payroll", "2 attendance gaps found"],
  ["Policy answer ready", "Leave rule matched"],
  ["Risk alert", "3 docs expire soon"],
  ["Task created", "Finance review queued"],
];

const dashboardTabs = [
  {
    key: "overview",
    label: "Overview",
    metric: "98.4%",
    note: "Attendance health",
    chips: ["116 present", "8 on leave", "2 late"],
  },
  {
    key: "payroll",
    label: "Payroll",
    metric: "14 min",
    note: "Payroll lock ready",
    chips: ["TDS checked", "Claims synced", "Payslips queued"],
  },
  {
    key: "ai",
    label: "AI Assist",
    metric: "3",
    note: "Smart actions",
    chips: ["Missing docs", "Policy match", "Task created"],
  },
];

const automationCards = [
  [UserCheck, "Self-service requests", "Employees raise leave, claim, document, tax, and support requests without HR follow-ups."],
  [Workflow, "Approval routing", "Configure manager, HR, finance, and admin approvals with clear ownership and status."],
  [DatabaseZap, "Clean HR records", "Keep people data, documents, attendance, payroll, and activity history connected."],
  [Gauge, "Operational dashboards", "Give leaders live visibility into workforce cost, compliance, and team activity."],
];

function MetricPill({ children }) {
  return (
    <span className="home-pill">
      <Sparkles size={14} />
      {children}
    </span>
  );
}

function ProductVisual() {
  return (
    <div className="device-showcase" aria-label="CrewSync HRMS dashboard preview">
      <div className="device-glow" />
      <div className="laptop-device">
        <div className="laptop-top">
          <span />
        </div>
        <div className="laptop-screen">
          <aside className="screen-sidebar">
            <img src="/crewsync-mark.svg" alt="" />
            {[UsersRound, CalendarCheck, WalletCards, LineChart].map((Icon, index) => (
              <span className={index === 1 ? "active" : ""} key={index}>
                <Icon size={14} />
              </span>
            ))}
          </aside>
          <main className="screen-main">
            <div className="screen-head">
              <div>
                <small>Today</small>
                <strong>HRMS dashboard</strong>
              </div>
              <em>AI live</em>
            </div>
            <div className="screen-stats">
              {signals.map((signal) => (
                <div key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </div>
              ))}
            </div>
            <div className="screen-grid">
              <section>
                <div className="panel-title">
                  <strong>People</strong>
                  <span>Live</span>
                </div>
                {["Anika Rao", "Dev Malik"].map((name, index) => (
                  <div className="mini-person" key={name}>
                    <span>{name.slice(0, 2)}</span>
                    <div>
                      <strong>{name}</strong>
                      <small>{index ? "Docs verified" : "Leave approved"}</small>
                    </div>
                  </div>
                ))}
              </section>
              <section>
                <div className="panel-title">
                  <strong>Attendance</strong>
                  <span>Week</span>
                </div>
                <div className="screen-bars">
                  {[70, 86, 62, 90, 84, 55].map((height, index) => (
                    <span style={{ height: `${height}%` }} className={index === 4 ? "hot" : ""} key={index} />
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
        <div className="laptop-base" />
      </div>

      <div className="phone-device">
        <div className="phone-notch" />
        <div className="phone-card active">
          <Bot size={14} />
          <span>AI payroll check</span>
        </div>
        <div className="phone-card">
          <CalendarCheck size={14} />
          <span>8 leaves today</span>
        </div>
        <div className="phone-card">
          <FileCheck2 size={14} />
          <span>3 docs pending</span>
        </div>
      </div>

      <div className="floating-ai-card">
        <Sparkles size={15} />
        <span>AI found 2 attendance gaps</span>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="home-root">
      <style>{styles}</style>

      <header className="home-nav">
        <Link to="/" className="brand-link" aria-label="CrewSync home">
          <img src="/crewsync-logo.svg" alt="CrewSync" />
        </Link>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.label}>{item.label}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <Link to="/login" className="ghost-btn">Sign in</Link>
          <Link to="/demo" className="solid-btn">
            Book demo
            <ArrowRight size={17} />
          </Link>
          <button className="menu-btn" type="button" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy reveal">
            <MetricPill>AI-powered HRMS for workforce operations</MetricPill>
            <h1>India's modern HRMS for startups & teams.</h1>
            <p className="hero-lede">
              Manage people, attendance, payroll, documents, and AI alerts in one clean dashboard.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="primary-cta">
                Start free trial
                <ArrowRight size={19} />
              </Link>
              <Link to="/features" className="secondary-cta">
                View modules
                <ChevronRight size={18} />
              </Link>
            </div>
            <div className="hero-proof" aria-label="CrewSync highlights">
              <span><Check size={15} /> Visual HR dashboards</span>
              <span><Check size={15} /> AI task alerts</span>
              <span><Check size={15} /> Payroll-ready data</span>
            </div>
          </div>
          <ProductVisual />
        </section>

        <section className="trust-strip" aria-label="Product outcomes">
          {[
            ["40%", "less manual HR follow-up"],
            ["360°", "employee lifecycle view"],
            ["24/7", "employee self-service desk"],
            ["100%", "traceable approvals and logs"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="section-block reveal" id="platform">
          <div className="section-head">
            <span className="eyebrow">Platform</span>
            <h2>A complete HRMS foundation for fast-moving teams.</h2>
            <p>
              Replace disconnected spreadsheets and one-off tools with modules that share
              the same employee record, approval history, and access controls.
            </p>
          </div>
          <div className="platform-grid">
            {platformCards.map(({ icon: Icon, title, copy }) => (
              <article className="platform-card" key={title}>
                <span><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="automation-section reveal">
          <div className="section-head">
            <span className="eyebrow">HRMS Modules</span>
            <h2>Built for everyday HR operations, not just record keeping.</h2>
            <p>
              CrewSync keeps every employee interaction connected from request to approval,
              payroll input, document trail, and reporting.
            </p>
          </div>
          <div className="automation-grid">
            {automationCards.map(([Icon, title, copy]) => (
              <article className="automation-card" key={title}>
                <Icon size={22} />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ai-section reveal" id="ai-suite">
          <div className="ai-copy">
            <span className="eyebrow">AI Suite</span>
            <h2>AI that keeps HR moving.</h2>
            <p>Answers, alerts, and payroll checks without screen-hopping.</p>
            <div className="ai-prompt">
              <Bot size={20} />
              <span>Ask: Missing documents before payroll?</span>
            </div>
          </div>
          <div className="ai-tabs" aria-label="AI tools">
            <span className="active">Copilot</span>
            <span>Documents</span>
            <span>Alerts</span>
          </div>
          <div className="ai-grid">
            {aiCards.map(({ icon: Icon, title, copy }) => (
              <article className="ai-card" key={title}>
                <span><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="ai-live-strip" aria-label="Live AI activity">
            {liveAiItems.map(([title, copy], index) => (
              <span style={{ "--i": index }} key={`${title}-${copy}`}>
                <Sparkles size={14} />
                <strong>{title}</strong>
                {copy}
              </span>
            ))}
          </div>
        </section>

        <section className="workflow-band reveal" id="workflows">
          <div className="workflow-copy">
            <span className="eyebrow">Workflows</span>
            <h2>From joining to exit, every step has an owner.</h2>
            <p>
              Replace scattered chats and follow-up sheets with visible queues, approval paths,
              policy checks, and records that stay attached to the employee timeline.
            </p>
            <Link to="/features/onboarding" className="text-link">
              See onboarding tools
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="workflow-steps">
            {workflows.map(([title, copy], index) => (
              <div className="workflow-step" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="role-section reveal">
          <div className="section-head compact">
            <span className="eyebrow">Teams</span>
            <h2>Different roles, the right view for each one.</h2>
          </div>
          <div className="role-grid">
            {roleViews.map(({ icon: Icon, title, copy }) => (
              <article className="role-card" key={title}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="security-section reveal" id="security">
          <div>
            <span className="eyebrow">Security</span>
            <h2>Control without slowing everyone down.</h2>
            <p>
              Keep sensitive HR and finance work protected with permissioned modules,
              activity trails, document controls, and clean separation between employee,
              admin, super admin, and global admin workspaces.
            </p>
          </div>
          <div className="security-list">
            {[
              [Fingerprint, "Role-aware modules"],
              [LockKeyhole, "Sensitive data controls"],
              [ShieldCheck, "Audit-ready activity logs"],
            ].map(([Icon, label]) => (
              <span key={label}>
                <Icon size={18} />
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="pricing-section reveal" id="pricing">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2>Pick the workspace that matches your stage.</h2>
            <p>Start simple, then add payroll, attendance, analytics, and controls when your team is ready.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
                <div className="plan-head">
                  <span>{plan.name}</span>
                  {plan.featured && <em>Popular</em>}
                </div>
                <strong>{plan.price}</strong>
                <p>{plan.note}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={plan.featured ? "/demo" : "/signup"}>
                  {plan.featured ? "Book a demo" : "Get started"}
                  <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta reveal">
          <div>
            <span className="eyebrow">CrewSync</span>
            <h2>Give your HR team a sharper operating system.</h2>
            <p>Launch a cleaner home for attendance, payroll, documents, approvals, and employee support.</p>
          </div>
          <div className="cta-actions">
            <Link to="/demo" className="primary-cta">
              Schedule demo
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-dark">Sign in</Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <img src="/crewsync-logo.svg" alt="CrewSync" />
          <p>People operations, payroll clarity, and employee self-service for growing teams.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/features">Features</Link>
          <Link to="/demo">Demo</Link>
          <Link to="/docs">Docs</Link>
          <Link to="/help-center">Help</Link>
        </nav>
      </footer>
    </div>
  );
}

export default HomePage;

const styles = `
.home-root {
  --ink: #101522;
  --muted: #5f6b7a;
  --line: #dfe6ee;
  --paper: #ffffff;
  --mist: #f5f7fb;
  --cyan: #0891b2;
  --lime: #8db600;
  --coral: #e05f3e;
  --plum: #623a8f;
  min-height: 100vh;
  background:
    radial-gradient(circle at 86% 8%, rgba(8, 145, 178, 0.12), transparent 25%),
    radial-gradient(circle at 8% 18%, rgba(141, 182, 0, 0.11), transparent 24%),
    linear-gradient(180deg, #ffffff 0%, #f7f9fc 42%, #eef3f7 100%);
  color: var(--ink);
  font-family: "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

.home-root * {
  box-sizing: border-box;
}

.home-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 8px clamp(18px, 4vw, 54px);
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(16, 21, 34, 0.08);
  backdrop-filter: blur(18px);
}

.brand-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.brand-link img {
  height: 38px;
  width: 152px;
  object-fit: contain;
  object-position: left center;
}

.home-nav nav,
.home-footer nav {
  display: flex;
  align-items: center;
  gap: 22px;
}

.home-nav nav a,
.home-footer nav a {
  color: #344054;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
}

.home-nav nav a:hover,
.home-footer nav a:hover {
  color: var(--cyan);
}

.nav-actions,
.hero-actions,
.cta-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ghost-btn,
.solid-btn,
.primary-cta,
.secondary-cta,
.secondary-dark,
.pricing-card a,
.text-link {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
}

.ghost-btn {
  color: var(--ink);
  border: 1px solid var(--line);
  background: #fff;
}

.solid-btn,
.primary-cta {
  color: #fff;
  background: linear-gradient(135deg, #101522, #155e75 58%, #8db600);
  box-shadow: 0 18px 38px -24px rgba(8, 145, 178, 0.95);
}

.menu-btn {
  display: none;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
}

.hero-section {
  min-height: calc(100svh - 62px);
  display: grid;
  grid-template-columns: minmax(330px, 0.78fr) minmax(500px, 1.22fr);
  align-items: start;
  gap: clamp(22px, 3vw, 46px);
  padding: clamp(20px, 2.4vw, 30px) clamp(18px, 5vw, 72px) clamp(18px, 2vw, 26px);
  position: relative;
  overflow: hidden;
}

.hero-section::after {
  content: "";
  position: absolute;
  left: clamp(18px, 5vw, 72px);
  right: clamp(18px, 5vw, 72px);
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(16, 21, 34, 0.13), transparent);
}

.hero-copy {
  max-width: 560px;
  padding-top: clamp(18px, 4vh, 54px);
}

.home-pill,
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #075985;
  background: #e8f7fb;
  border: 1px solid #c4e8f1;
  border-radius: 999px;
  padding: 6px 11px;
  font-size: 12px;
  font-weight: 900;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero-copy h1 {
  margin: 14px 0 12px;
  font-size: clamp(38px, 4.2vw, 60px);
  line-height: 1;
  letter-spacing: -0.03em;
  font-weight: 900;
}

.hero-lede {
  max-width: 520px;
  margin: 0;
  color: var(--muted);
  font-size: clamp(15px, 1vw, 17px);
  line-height: 1.5;
  font-weight: 600;
}

.hero-actions {
  margin-top: 20px;
}

.secondary-cta {
  color: var(--ink);
  background: #fff;
  border: 1px solid var(--line);
}

.hero-proof {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
  color: #475467;
  font-size: 13px;
  font-weight: 800;
}

.hero-proof span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.hero-proof svg {
  color: var(--lime);
}

.device-showcase {
  position: relative;
  width: min(100%, 780px);
  min-height: 470px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.device-glow {
  position: absolute;
  width: 620px;
  height: 420px;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(16, 21, 34, 0.08), transparent 64%),
    linear-gradient(135deg, rgba(196, 240, 0, 0.08), rgba(8, 145, 178, 0.09));
  transform: rotate(-10deg);
}

.laptop-device {
  position: relative;
  z-index: 1;
  width: min(92%, 650px);
  border-radius: 18px 18px 10px 10px;
  filter: drop-shadow(0 34px 46px rgba(16, 21, 34, 0.22));
}

.laptop-top {
  height: 18px;
  border-radius: 18px 18px 0 0;
  background: #101522;
  display: grid;
  place-items: center;
}

.laptop-top span {
  width: 56px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.laptop-screen {
  display: grid;
  grid-template-columns: 58px 1fr;
  height: 330px;
  overflow: hidden;
  border: 12px solid #101522;
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: #f8fafc;
}

.screen-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px;
  background: #111827;
}

.screen-sidebar img {
  width: 30px;
  height: 30px;
  margin-bottom: 6px;
}

.screen-sidebar span {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #b8c2d0;
}

.screen-sidebar span.active {
  color: #101522;
  background: #c4f000;
}

.screen-main {
  padding: 18px;
}

.screen-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.screen-head small,
.screen-head strong {
  display: block;
}

.screen-head small {
  color: #64748b;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.screen-head strong {
  margin-top: 3px;
  color: #101522;
  font-size: 22px;
  font-weight: 900;
}

.screen-head em {
  border-radius: 999px;
  padding: 6px 10px;
  color: #101522;
  background: #c4f000;
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
  animation: livePulse 2.6s ease-in-out infinite;
}

.screen-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-bottom: 12px;
}

.screen-stats div,
.screen-grid section {
  border: 1px solid #dfe6ee;
  border-radius: 8px;
  background: #fff;
}

.screen-stats div {
  padding: 10px;
  border-top: 4px solid #0891b2;
}

.screen-stats div:nth-child(2) {
  border-top-color: #8db600;
}

.screen-stats div:nth-child(3) {
  border-top-color: #e05f3e;
}

.screen-stats span,
.screen-stats strong {
  display: block;
}

.screen-stats span {
  color: #64748b;
  font-size: 10px;
  font-weight: 900;
}

.screen-stats strong {
  margin-top: 6px;
  color: #101522;
  font-size: 19px;
  font-weight: 900;
}

.screen-grid {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 10px;
}

.screen-grid section {
  padding: 12px;
  min-height: 128px;
}

.mini-person {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #eef2f7;
}

.mini-person > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  background: #623a8f;
  font-size: 11px;
  font-weight: 900;
}

.mini-person strong,
.mini-person small {
  display: block;
}

.mini-person strong {
  font-size: 12px;
}

.mini-person small {
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
}

.screen-bars {
  display: flex;
  align-items: end;
  gap: 7px;
  height: 82px;
  padding-top: 16px;
}

.screen-bars span {
  flex: 1;
  min-width: 8px;
  border-radius: 7px 7px 2px 2px;
  background: #9cc8d6;
}

.screen-bars span.hot {
  background: #e05f3e;
}

.laptop-base {
  width: 106%;
  height: 18px;
  margin-left: -3%;
  border-radius: 0 0 26px 26px;
  background: linear-gradient(180deg, #d8dde5, #8c96a4);
  box-shadow: inset 0 3px 4px rgba(255, 255, 255, 0.5);
}

.phone-device {
  position: absolute;
  z-index: 3;
  right: 6px;
  bottom: 36px;
  width: 128px;
  min-height: 232px;
  padding: 24px 10px 12px;
  border: 9px solid #101522;
  border-radius: 28px;
  background: #f8fafc;
  box-shadow: 0 24px 42px -28px rgba(16, 21, 34, 0.8);
  animation: phoneFloat 4s ease-in-out infinite;
}

.phone-notch {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 42px;
  height: 8px;
  border-radius: 999px;
  background: #101522;
  transform: translateX(-50%);
}

.phone-card {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 42px;
  margin-top: 8px;
  padding: 8px;
  border-radius: 10px;
  color: #334155;
  background: #fff;
  border: 1px solid #e5edf5;
  font-size: 10px;
  font-weight: 900;
}

.phone-card.active {
  color: #101522;
  background: #eaff8f;
}

.floating-ai-card {
  position: absolute;
  z-index: 4;
  top: 42px;
  left: 56px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  color: #101522;
  background: #c4f000;
  box-shadow: 0 20px 36px -26px rgba(16, 21, 34, 0.8);
  font-size: 12px;
  font-weight: 900;
  animation: aiFloatBadge 3.4s ease-in-out infinite;
}

@keyframes phoneFloat {
  0%, 100% {
    transform: translateY(0) rotate(1deg);
  }
  50% {
    transform: translateY(-7px) rotate(-1deg);
  }
}

.product-visual {
  width: min(100%, 760px);
  max-width: 760px;
  margin-left: auto;
  background: #101522;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  box-shadow: 0 34px 90px -44px rgba(16, 21, 34, 0.95);
  overflow: hidden;
  transform: none;
}

.visual-topbar {
  min-height: 34px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: #151c2d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.window-dots {
  display: flex;
  gap: 6px;
}

.window-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e05f3e;
}

.window-dots span:nth-child(2) { background: #eab308; }
.window-dots span:nth-child(3) { background: #8db600; }

.visual-search {
  flex: 1;
  border-radius: 6px;
  color: #9aa6b7;
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 11px;
  font-size: 12px;
  font-weight: 800;
}

.visual-app {
  display: grid;
  grid-template-columns: 56px 1fr;
  min-height: 350px;
  background:
    linear-gradient(90deg, rgba(141, 182, 0, 0.09), transparent 24%),
    #f8fafc;
}

.visual-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px;
  background: #101522;
}

.visual-sidebar img {
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
}

.visual-sidebar span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #b8c2d0;
  border-radius: 8px;
}

.visual-sidebar span.active {
  color: #101522;
  background: #c4f000;
}

.visual-main {
  padding: 18px;
  position: relative;
}

.visual-heading,
.panel-title,
.plan-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.visual-heading span {
  display: block;
  color: #667085;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.visual-heading strong {
  display: block;
  margin-top: 3px;
  font-size: 22px;
  font-weight: 900;
}

.visual-heading button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 8px;
  padding: 8px 11px;
  color: #fff;
  background: #101522;
  font-weight: 900;
}

.visual-flow,
.modern-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 12px 0 10px;
}

.visual-flow div,
.modern-tabs button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  border: 1px solid #dfe6ee;
  border-radius: 8px;
  color: #526173;
  background: #fff;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.visual-flow div.active,
.modern-tabs button.active {
  color: #101522;
  border-color: rgba(196, 240, 0, 0.55);
  background: linear-gradient(135deg, #c4f000, #e7f8fb);
  box-shadow: 0 12px 24px -20px rgba(16, 21, 34, 0.45);
}

.visual-flow svg {
  color: #0891b2;
}

.dashboard-tab-panel {
  display: grid;
  grid-template-columns: 0.55fr 1fr;
  gap: 12px;
  align-items: center;
  min-height: 86px;
  margin-bottom: 10px;
  padding: 12px;
  border: 1px solid #dfe6ee;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(196, 240, 0, 0.14), transparent 42%),
    #fff;
  animation: tabPanelIn 0.45s ease both;
}

.dashboard-tab-panel > div:first-child span,
.dashboard-tab-panel > div:first-child strong {
  display: block;
}

.dashboard-tab-panel > div:first-child span {
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
}

.dashboard-tab-panel > div:first-child strong {
  margin-top: 5px;
  color: #101522;
  font-size: 26px;
  line-height: 1;
  font-weight: 900;
}

.tab-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.tab-chip-row span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 6px 9px;
  color: #155e75;
  background: #e8f7fb;
  font-size: 11px;
  font-weight: 900;
}

@keyframes tabPanelIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-orbit {
  position: absolute;
  top: 14px;
  right: 18px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 9px;
  border-radius: 999px;
  color: #101522;
  background: #c4f000;
  box-shadow: 0 16px 34px -22px rgba(16, 21, 34, 0.7);
  font-size: 11px;
  font-weight: 900;
  animation: aiFloatBadge 3s ease-in-out infinite;
}

.ai-orbit span {
  display: grid;
  place-items: center;
}

.ai-orbit em {
  font-style: normal;
}

@keyframes aiFloatBadge {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.signal-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 0 0 10px;
}

.signal-card,
.queue-panel,
.chart-panel,
.platform-card,
.role-card,
.pricing-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
}

.signal-card {
  padding: 10px;
  min-height: 70px;
}

.signal-card span {
  display: block;
  color: #667085;
  font-size: 11px;
  font-weight: 850;
}

.signal-card strong {
  display: block;
  margin-top: 6px;
  font-size: 20px;
  font-weight: 900;
}

.signal-card.cyan { border-top: 4px solid var(--cyan); }
.signal-card.lime { border-top: 4px solid var(--lime); }
.signal-card.coral { border-top: 4px solid var(--coral); }

.visual-grid {
  display: grid;
  grid-template-columns: 1fr 0.9fr 0.92fr;
  gap: 10px;
}

.queue-panel,
.chart-panel,
.ai-mini-panel {
  padding: 12px;
}

.panel-title strong {
  font-size: 14px;
  font-weight: 900;
}

.panel-title span {
  color: var(--cyan);
  font-size: 11px;
  font-weight: 900;
}

.queue-row {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-top: 1px solid #edf1f5;
}

.queue-row:first-of-type {
  margin-top: 8px;
}

.queue-row > span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  background: var(--plum);
  font-size: 12px;
  font-weight: 900;
}

.queue-row strong,
.queue-row small {
  display: block;
}

.queue-row strong {
  font-size: 12px;
}

.queue-row small,
.queue-row em {
  color: #667085;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.bars {
  display: flex;
  align-items: end;
  gap: 7px;
  height: 76px;
  padding-top: 14px;
}

.bars span {
  flex: 1;
  min-width: 10px;
  border-radius: 6px 6px 2px 2px;
  background: #9cc8d6;
}

.bars span.hot {
  background: var(--coral);
}

.chart-panel p {
  margin: 9px 0 0;
  color: #667085;
  font-size: 11px;
  line-height: 1.5;
  font-weight: 750;
}

.ai-mini-panel {
  border: 1px solid rgba(16, 21, 34, 0.08);
  border-radius: 8px;
  background:
    linear-gradient(145deg, #101522, #153949 70%, #4b6108);
  color: #fff;
}

.ai-mini-panel > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-mini-panel > div svg {
  color: #c4f000;
}

.ai-mini-panel strong {
  font-size: 14px;
  font-weight: 900;
}

.ai-rotator {
  position: relative;
  min-height: 72px;
  margin: 10px 0 10px;
  overflow: hidden;
}

.ai-rotator p {
  position: absolute;
  inset: 0;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 1.5;
  font-weight: 750;
  opacity: 0;
  transform: translateY(12px);
  animation: aiRotate 12s ease-in-out infinite;
  animation-delay: calc(var(--i) * 3s);
}

.ai-rotator p strong {
  display: block;
  margin-bottom: 3px;
  color: #fff;
  font-size: 13px;
}

.ai-mini-panel span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  padding: 6px 9px;
  color: #101522;
  background: #c4f000;
  font-size: 11px;
  font-weight: 900;
}

@keyframes aiRotate {
  0%, 22% {
    opacity: 1;
    transform: translateY(0);
  }
  28%, 100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.trust-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  margin: 0 clamp(18px, 5vw, 72px);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--line);
}

.trust-strip div {
  padding: 22px;
  background: #fff;
}

.trust-strip strong,
.trust-strip span {
  display: block;
}

.trust-strip strong {
  font-size: 30px;
  font-weight: 900;
}

.trust-strip span {
  margin-top: 5px;
  color: #667085;
  font-size: 13px;
  font-weight: 800;
}

.section-block,
.automation-section,
.role-section,
.pricing-section {
  padding: 64px clamp(18px, 4vw, 56px);
}

.section-head {
  max-width: 780px;
  margin: 0 auto 26px;
  text-align: center;
}

.section-head.compact {
  margin-bottom: 28px;
}

.section-head h2,
.ai-copy h2,
.workflow-copy h2,
.security-section h2,
.final-cta h2 {
  margin: 10px 0 8px;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  letter-spacing: -0.018em;
  font-weight: 900;
}

.section-head p,
.ai-copy p,
.workflow-copy p,
.security-section p,
.final-cta p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.5;
  font-weight: 650;
}

.platform-grid,
.automation-grid,
.ai-grid,
.role-grid,
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.platform-card,
.automation-card,
.ai-card,
.role-card,
.pricing-card {
  padding: 18px;
}

.platform-card span {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: #fff;
  border-radius: 8px;
  background: #101522;
}

.platform-card h3,
.automation-card h3,
.ai-card h3,
.role-card h3,
.workflow-step h3 {
  margin: 18px 0 8px;
  font-size: 17px;
  font-weight: 900;
}

.platform-card p,
.automation-card p,
.ai-card p,
.role-card p,
.workflow-step p,
.pricing-card p {
  margin: 0;
  color: #667085;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 650;
}

.automation-section {
  padding-top: 0;
}

.automation-grid {
  grid-template-columns: repeat(2, 1fr);
  max-width: 1160px;
  margin: 0 auto;
}

.automation-card {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 16px;
  align-items: start;
  border: 1px solid var(--line);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(249, 251, 253, 0.94));
  box-shadow: 0 18px 44px -34px rgba(16, 21, 34, 0.5);
}

.automation-card svg {
  width: 48px;
  height: 48px;
  padding: 12px;
  color: #101522;
  border-radius: 8px;
  background: #eaf7fb;
}

.automation-card h3 {
  margin-top: 0;
}

.ai-section {
  display: grid;
  grid-template-columns: 0.8fr 0.45fr 1.2fr;
  gap: 18px;
  align-items: center;
  margin: 0 clamp(18px, 4vw, 56px) 64px;
  padding: 28px;
  border-radius: 8px;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(196, 240, 0, 0.12), transparent 32%),
    linear-gradient(145deg, #0c1220 0%, #15213a 48%, #173b45 100%);
  box-shadow: 0 34px 80px -52px rgba(16, 21, 34, 0.95);
  position: relative;
  overflow: hidden;
}

.ai-section::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  pointer-events: none;
}

.ai-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.ai-copy p {
  color: rgba(255, 255, 255, 0.74);
}

.ai-section .eyebrow {
  color: #101522;
  background: #c4f000;
  border-color: #c4f000;
}

.ai-prompt {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 16px;
  padding: 11px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 800;
}

.ai-prompt svg {
  flex: 0 0 auto;
  color: #c4f000;
}

.ai-tabs {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 8px;
}

.ai-tabs span {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-weight: 900;
}

.ai-tabs span.active {
  color: #101522;
  background: #c4f000;
  border-color: #c4f000;
}

.ai-grid {
  position: relative;
  z-index: 1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.ai-card {
  min-height: 154px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.075);
  backdrop-filter: blur(14px);
}

.ai-card span {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #101522;
  border-radius: 8px;
  background: #c4f000;
}

.ai-card h3 {
  color: #fff;
  margin: 14px 0 7px;
  font-size: 16px;
}

.ai-card p {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.ai-live-strip {
  grid-column: 1 / -1;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 4px;
}

.ai-live-strip span {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 8px 10px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  font-size: 11px;
  font-weight: 800;
  opacity: 0.55;
  animation: livePulse 8s ease-in-out infinite;
  animation-delay: calc(var(--i) * 1.15s);
}

.ai-live-strip span svg {
  flex: 0 0 auto;
  color: #c4f000;
}

.ai-live-strip span strong {
  color: #fff;
  white-space: nowrap;
}

@keyframes livePulse {
  0%, 100% {
    opacity: 0.55;
    transform: translateY(0);
  }
  35% {
    opacity: 1;
    transform: translateY(-3px);
    border-color: rgba(196, 240, 0, 0.45);
  }
}

.workflow-band {
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 34px;
  align-items: start;
  margin: 0 clamp(18px, 5vw, 72px);
  padding: 42px;
  border-radius: 8px;
  color: #fff;
  background:
    linear-gradient(135deg, #101522 0%, #142633 48%, #26321a 100%);
}

.workflow-copy p {
  color: rgba(255, 255, 255, 0.72);
}

.workflow-band .eyebrow {
  color: #101522;
  background: #c4f000;
  border-color: #c4f000;
}

.text-link {
  margin-top: 24px;
  padding-left: 0;
  padding-right: 0;
  color: #c4f000;
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.workflow-step {
  min-height: 172px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.075);
}

.workflow-step span {
  color: #c4f000;
  font-size: 13px;
  font-weight: 900;
}

.workflow-step p {
  color: rgba(255, 255, 255, 0.7);
}

.role-grid {
  grid-template-columns: repeat(3, 1fr);
}

.role-card svg {
  color: var(--cyan);
}

.security-section,
.final-cta {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 28px;
  align-items: center;
  margin: 0 clamp(18px, 5vw, 72px);
  padding: 42px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

.reveal {
  animation: homeReveal 0.72s ease-out both;
  animation-timeline: view();
  animation-range: entry 8% cover 28%;
}

@keyframes homeReveal {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@supports not (animation-timeline: view()) {
  .reveal {
    animation: none;
  }
}

.security-section > div:first-child {
  max-width: 720px;
}

.security-list {
  display: grid;
  gap: 10px;
  min-width: 280px;
}

.security-list span {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-radius: 8px;
  color: #344054;
  background: #f6f8fb;
  font-size: 14px;
  font-weight: 900;
}

.security-list svg {
  color: var(--lime);
}

.pricing-grid {
  grid-template-columns: repeat(3, 1fr);
  max-width: 1140px;
  margin: 0 auto;
}

.pricing-card {
  display: flex;
  flex-direction: column;
  min-height: 430px;
}

.pricing-card.featured {
  color: #fff;
  border-color: #101522;
  background: #101522;
  box-shadow: 0 30px 60px -42px rgba(16, 21, 34, 0.95);
}

.plan-head span {
  color: var(--cyan);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.plan-head em {
  border-radius: 999px;
  padding: 5px 9px;
  color: #101522;
  background: #c4f000;
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}

.pricing-card > strong {
  display: block;
  margin-top: 18px;
  font-size: 42px;
  font-weight: 900;
}

.pricing-card.featured p,
.pricing-card.featured li {
  color: rgba(255, 255, 255, 0.78);
}

.pricing-card ul {
  display: grid;
  gap: 12px;
  margin: 24px 0;
  padding: 0;
  list-style: none;
}

.pricing-card li {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #475467;
  font-size: 14px;
  font-weight: 800;
}

.pricing-card li svg {
  color: var(--lime);
  flex: 0 0 auto;
}

.pricing-card a {
  margin-top: auto;
  color: #fff;
  background: var(--cyan);
}

.pricing-card.featured a {
  color: #101522;
  background: #c4f000;
}

.final-cta {
  margin-bottom: 72px;
  color: #fff;
  background:
    linear-gradient(135deg, #101522 0%, #12313d 55%, #3a3f16 100%);
  border: 0;
}

.final-cta p {
  color: rgba(255, 255, 255, 0.74);
}

.secondary-dark {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
}

.home-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px clamp(18px, 5vw, 72px);
  border-top: 1px solid var(--line);
  background: #fff;
}

.home-footer img {
  width: 154px;
  height: 44px;
  object-fit: contain;
  object-position: left center;
}

.home-footer p {
  max-width: 430px;
  margin: 8px 0 0;
  color: #667085;
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 1100px) {
  .home-nav nav {
    display: none;
  }

  .hero-section,
  .ai-section,
  .workflow-band,
  .security-section,
  .final-cta {
    grid-template-columns: 1fr;
  }

  .product-visual {
    margin: 0;
  }

  .device-showcase {
    margin: 0;
    min-height: 430px;
  }

  .platform-grid,
  .automation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .security-list {
    min-width: 0;
  }
}

@media (max-width: 820px) {
  .ghost-btn,
  .solid-btn {
    display: none;
  }

  .menu-btn {
    display: grid;
    place-items: center;
  }

  .hero-section {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .device-showcase {
    min-height: 360px;
  }

  .laptop-device {
    width: 100%;
  }

  .laptop-screen {
    height: 285px;
    grid-template-columns: 46px 1fr;
    border-width: 9px;
    border-top: 0;
  }

  .screen-main {
    padding: 12px;
  }

  .screen-stats div:nth-child(3),
  .floating-ai-card {
    display: none;
  }

  .screen-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .phone-device {
    right: -4px;
    bottom: 20px;
    width: 104px;
    min-height: 190px;
  }

  .visual-app {
    grid-template-columns: 1fr;
  }

  .visual-sidebar {
    flex-direction: row;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .visual-grid,
  .signal-row,
  .trust-strip,
  .platform-grid,
  .automation-grid,
  .workflow-steps,
  .role-grid,
  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .ai-section,
  .workflow-band,
  .security-section,
  .final-cta {
    padding: 28px;
  }

  .ai-section {
    margin-bottom: 64px;
  }

  .home-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .brand-link img {
    width: 140px;
  }

  .hero-actions,
  .cta-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-cta,
  .secondary-cta,
  .secondary-dark {
    width: 100%;
  }

  .visual-heading,
  .automation-card,
  .home-footer nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .automation-card {
    display: flex;
  }

  .home-footer nav {
    gap: 12px;
  }
}
`;
