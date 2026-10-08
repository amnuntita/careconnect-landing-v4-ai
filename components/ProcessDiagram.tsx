import { fillPrices, PROCESS } from "@/lib/homepage-content";
import { PROCESS_STEPS, type ProcessStep } from "@/lib/process-steps";

import {
  HandIcon,
  HomeIcon,
  RefreshIcon,
  StethoscopeIcon,
  VideoIcon,
  WalkerIcon,
} from "./Icons";

// §4 care process. Pure HTML/CSS (no image/canvas) so every label is
// crawlable text. Desktop: one row of 5 steps with arrows, a yellow bracket
// over steps 1–2 and a decision marker after step 2. Mobile: a vertical
// timeline in the same order. Colours by role: physician blue, therapist green.

const LEGEND = [
  { key: "doctor", label: "แพทย์", Icon: StethoscopeIcon },
  { key: "therapist", label: "นักกายภาพ", Icon: WalkerIcon },
  { key: "therapist", label: "นักกิจกรรมบำบัด", Icon: HandIcon },
] as const;

function RoleIcons({ step }: { step: ProcessStep }) {
  if (step.role === "doctor") return <StethoscopeIcon />;
  // "นักกายภาพ/นักกิจกรรมบำบัด" shows both therapist icons.
  return (
    <>
      <WalkerIcon />
      {step.roleLabel.includes("นักกิจกรรมบำบัด") ? <HandIcon /> : null}
    </>
  );
}

// `heading` overrides the homepage §4 heading (service pages use their own H2).
export function ProcessDiagram({
  id = "process",
  heading = PROCESS.heading,
}: {
  id?: string;
  heading?: string;
}) {
  return (
    <section id={id} className="process-section">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">{heading}</h2>
        </div>

        <ul className="process-legend" aria-label="สีตามผู้ให้บริการ">
          {LEGEND.map(({ key, label, Icon }) => (
            <li key={label} className={`legend-item role-${key}`}>
              <span className="legend-swatch" aria-hidden="true">
                <Icon />
              </span>
              {label}
            </li>
          ))}
        </ul>

        <div className="process-grid">
          <p className="process-bracket">{fillPrices(PROCESS.bracket)}</p>
          <ol className="process-steps">
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step.label}
                className={`process-step role-${step.role}${i < 2 ? " in-bracket" : ""}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="step-top">
                  <span className="step-num">{step.label}</span>
                  <span className="step-role">
                    <span className="step-role-icons" aria-hidden="true">
                      <RoleIcons step={step} />
                    </span>
                    {step.roleLabel}
                  </span>
                </div>
                {step.location ? (
                  <span className="step-location">
                    {step.location.includes("telemedicine") ? <VideoIcon /> : <HomeIcon />}
                    {step.location}
                  </span>
                ) : null}
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
                {step.loop ? (
                  <span className="step-loop">
                    <RefreshIcon />
                    แพทย์ปรับแผนได้
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="process-decision">{PROCESS.decision}</p>
        </div>
      </div>
    </section>
  );
}
