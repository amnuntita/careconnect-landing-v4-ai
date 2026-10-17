"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

import { fillPrices, PROCESS } from "@/lib/homepage-content";
import { PROCESS_STEP_SUMMARIES } from "@/lib/process-steps";

import type { ComponentType, SVGProps } from "react";

import {
  ArrowIcon,
  CheckIcon,
  ClipboardPlanIcon,
  HandIcon,
  HomeIcon,
  PersonIcon,
  RefreshIcon,
  UsersIcon,
  VideoIcon,
} from "./Icons";

// §4 care process as a one-colour step slider: a simple line illustration per
// step, a numbered stepper, and a short caption per step. Every caption is
// rendered as HTML (only the active one is shown), so all steps stay
// crawlable. The doctor's photo appears on the two doctor video calls (steps
// 1 and 5) and a real home-visit photo fills the house (step 2); everything
// else is drawn with icons.

const DOCTOR = "/images/staff/DR_Jiraporn.jpg";

type Item =
  | { photo: string }
  | { Icon: ComponentType<SVGProps<SVGSVGElement>> };

type Art = {
  // Line drawing behind the items: a phone for the video call, a house for
  // the home visit; none where no setting fits.
  frame?: "phone" | "house";
  // Photo shown inside the frame's outline (house only).
  fill?: string;
  items: Item[];
  // Index into `items` that is shown larger and solid white.
  focus?: number;
  // "xl": the focus item is shown extra large (a single-icon step).
  size?: "xl";
  badge?: "check" | "refresh";
  chip?: { icon: "video" | "home"; text: string };
};

const ART: Art[] = [
  {
    frame: "phone",
    items: [{ photo: DOCTOR }],
    focus: 0,
    chip: { icon: "video", text: "วิดีโอคอลกับแพทย์" },
  },
  {
    frame: "house",
    fill: "/images/process/home-visit.png",
    items: [],
    chip: { icon: "home", text: "นักกายภาพมาที่บ้าน" },
  },
  { items: [{ Icon: ClipboardPlanIcon }], focus: 0, size: "xl", badge: "refresh" },
  {
    items: [{ Icon: HandIcon }, { Icon: PersonIcon }, { Icon: UsersIcon }],
    focus: 1,
    badge: "check",
  },
  { items: [{ photo: DOCTOR }], focus: 0, badge: "check" },
];

function Frame({ kind, fill }: { kind: "phone" | "house"; fill?: string }) {
  if (kind === "phone") return <div className="process-frame process-phone" />;
  return (
    <div className="process-frame process-house">
      {/* Clipped to the inside of the house outline drawn on top. */}
      {fill ? <Image src={fill} alt="" width={274} height={301} /> : null}
      <svg viewBox="0 0 220 230" fill="none">
        <path d="M18 230V100L110 22l92 78v130" />
        <path d="M156 61V30h22v50" />
      </svg>
    </div>
  );
}

function StepArt({ art }: { art: Art }) {
  return (
    <div className="process-art" aria-hidden="true">
      {art.frame ? <Frame kind={art.frame} fill={art.fill} /> : null}
      {art.items.length ? (
        <div className="process-people">
        {art.items.map((item, i) => (
          <span
            key={i}
            className={`process-avatar${"Icon" in item ? " is-icon" : ""}${
              art.focus === i ? " is-focus" : ""
            }${art.focus === i && art.size === "xl" ? " is-xl" : ""}`}
          >
            {"photo" in item ? (
              <Image src={item.photo} alt="" width={160} height={160} />
            ) : (
              <item.Icon />
            )}
            {/* Corner badge on the focus item; a refresh badge between two
                items is drawn after the row instead. */}
            {art.badge && art.focus === i && (art.badge === "check" || art.items.length === 1) ? (
              <span className="process-badge">
                {art.badge === "check" ? <CheckIcon /> : <RefreshIcon />}
              </span>
            ) : null}
          </span>
        ))}
        {art.badge === "refresh" && art.items.length > 1 ? (
          <span className="process-badge process-badge--between">
            <RefreshIcon />
          </span>
        ) : null}
        </div>
      ) : null}
      {art.chip ? (
        <span className="process-chip">
          {art.chip.icon === "video" ? <VideoIcon /> : <HomeIcon />}
          {art.chip.text}
        </span>
      ) : null}
    </div>
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = useState(0);
  const last = PROCESS_STEP_SUMMARIES.length - 1;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id={id} className="process-section">
      <div className="wrap">
        <header className="process-head">
          <h2 className="h2">{heading}</h2>
          <p className="process-sub">{PROCESS.subtitle}</p>
        </header>

        <div className="process-viewport" ref={emblaRef}>
          <ol className="process-track">
            {PROCESS_STEP_SUMMARIES.map((step, i) => (
              <li className="process-slide" key={step.title}>
                <StepArt art={ART[i]} />
              </li>
            ))}
          </ol>
        </div>

        <div className="process-stepper">
          <button
            type="button"
            className="process-arrow process-arrow--prev"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={selected === 0}
            aria-label="ขั้นก่อนหน้า"
          >
            <ArrowIcon />
          </button>
          {PROCESS_STEP_SUMMARIES.map((step, i) => (
            <button
              type="button"
              key={step.title}
              className="process-num"
              aria-current={i === selected ? "step" : undefined}
              aria-label={`ขั้นที่ ${i + 1}: ${step.title}`}
              onClick={() => emblaApi?.scrollTo(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            className="process-arrow"
            onClick={() => emblaApi?.scrollNext()}
            disabled={selected === last}
            aria-label="ขั้นถัดไป"
          >
            <ArrowIcon />
          </button>
        </div>

        <ol className="process-captions" aria-live="polite">
          {PROCESS_STEP_SUMMARIES.map((step, i) => (
            <li
              key={step.title}
              className={`process-caption${i === selected ? " is-active" : ""}`}
              aria-hidden={i !== selected}
            >
              <h3 className="process-step-title">{step.title}</h3>
              <p className="process-step-sub">{fillPrices(step.subtitle)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
