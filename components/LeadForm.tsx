"use client";

import { useId, useState, useSyncExternalStore } from "react";

import {
  CONDITION_OPTIONS,
  CONTACT_OPTIONS,
  formatThaiFullDate,
  isIsoDate,
  isValidThaiPhone,
  minFirstSessionDate,
  MOBILITY_OPTIONS,
  ONSET_OPTIONS,
  OTHER_PROVINCE,
  PROVINCE_OPTIONS,
  TIME_OPTIONS,
} from "@/lib/lead-options";
import { DEPOSIT, formatPrice } from "@/lib/packages";

import { AlertIcon, ArrowIcon, CheckIcon, LineIcon } from "./Icons";

type FieldErrors = Partial<
  Record<
    | "condition"
    | "province"
    | "district"
    | "firstSessionDate"
    | "firstSessionTime"
    | "name"
    | "tel",
    string
  >
>;

export type LeadValues = {
  condition: string;
  mobility: string;
  onset: string;
  province: string;
  district: string;
  firstSessionDate: string;
  firstSessionTime: string;
  name: string;
  tel: string;
  contactPref: string;
  note: string;
};

function validate(values: LeadValues, minDate: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.condition) errors.condition = "กรุณาเลือกอาการหรือภาวะของคนไข้";
  if (!values.province) errors.province = "กรุณาเลือกจังหวัด";
  if (!values.district.trim()) errors.district = "กรุณากรอกเขต / อำเภอ";
  if (!values.firstSessionDate) {
    errors.firstSessionDate = "กรุณาเลือกวันที่ต้องการฝึกครั้งแรก";
  } else if (
    !isIsoDate(values.firstSessionDate) ||
    values.firstSessionDate < minDate
  ) {
    errors.firstSessionDate = `กรุณาเลือกวันที่ตั้งแต่${formatThaiFullDate(minDate)}เป็นต้นไป`;
  }
  if (!values.firstSessionTime) errors.firstSessionTime = "กรุณาเลือกช่วงเวลา";
  if (!values.name.trim()) errors.name = "กรุณากรอกชื่อผู้ติดต่อ";

  const tel = values.tel.trim();
  if (!tel) {
    errors.tel = "กรุณากรอกเบอร์โทรศัพท์";
  } else if (!isValidThaiPhone(tel)) {
    errors.tel = "เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 08X-XXX-XXXX)";
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field-error" id={id}>
      <AlertIcon className="field-error-icon" />
      {message}
    </p>
  );
}

// Single-select chips: real radio inputs in a fieldset, so Tab enters the group
// once, arrow keys move the selection and Space selects (native behaviour).
function ChipGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  errorId,
  required,
  describedBy,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  errorId?: string;
  required?: boolean;
  describedBy?: string;
}) {
  return (
    <fieldset
      role="radiogroup"
      className={`field chip-field${error ? " has-error" : ""}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={[error ? errorId : null, describedBy].filter(Boolean).join(" ") || undefined}
    >
      <legend className="field-legend">{legend}</legend>
      <div className="chips">
        {options.map((option) => (
          <label className="chip" key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              {...(onChange
                ? { checked: value === option, onChange: () => onChange(option) }
                : {})}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {errorId ? <FieldError id={errorId} message={error} /> : null}
    </fieldset>
  );
}

const noopSubscribe = () => () => {};

// "สรุปคำขอจอง": shown above the submit button once date + time are chosen
// (updates live), and repeated on the success screen.
function BookingSummary({
  date,
  time,
  district,
  province,
  live,
}: {
  date: string;
  time: string;
  district: string;
  province: string;
  live?: boolean;
}) {
  return (
    <div className="booking-summary" aria-live={live ? "polite" : undefined}>
      <p className="booking-summary-title">สรุปคำขอจอง</p>
      <p>
        ฝึกครั้งแรก: {formatThaiFullDate(date)} ช่วง{time}
      </p>
      {district && province ? (
        <p>
          สถานที่: {district}, {province}
        </p>
      ) : null}
    </div>
  );
}

export function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [condition, setCondition] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [firstSessionDate, setFirstSessionDate] = useState("");
  const [firstSessionTime, setFirstSessionTime] = useState("");
  // Earliest bookable date (Bangkok today + 2). Read on the client only: the
  // page is statically rendered, so a build-time value would go stale. The
  // server snapshot is "" (no min) to keep hydration consistent.
  const minDate = useSyncExternalStore(
    noopSubscribe,
    minFirstSessionDate,
    () => "",
  );

  const clearFieldError = (key: keyof FieldErrors) =>
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const condId = useId();
  const provId = useId();
  const distId = useId();
  const dateId = useId();
  const timeErrId = useId();
  const scheduleHelpId = useId();
  const nameId = useId();
  const telId = useId();
  const noteId = useId();

  return (
    <section className="form-section" id="form">
      <div className="wrap">
        <div className="form-shell">
          <div className="form-head">
            <span className="eyebrow">เริ่มต้นฟื้นฟูตั้งแต่วันนี้</span>
            <h2 className="h2">ทดลองทำกายภาพ</h2>
            <p className="lede form-lede">
              ทีมงานจะโทรกลับเพื่อยืนยันวันและเวลานัดหมายอีกครั้ง
              เริ่มต้นด้วยการประเมินโดยแพทย์และการฝึกที่บ้านครั้งแรก{" "}
              {formatPrice(DEPOSIT)} บาท
            </p>
            <p className="form-desc">
             ปรึกษาแพทย์เพื่อวางแผน และทดลองทำกายภาพบำบัดครั้งแรก
            </p>
          </div>

          {!submitted ? (
            <form
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                if (submitting) return;

                const form = e.currentTarget;
                const data = new FormData(form);
                const get = (k: string) => String(data.get(k) ?? "");
                const payload: LeadValues = {
                  condition: get("condition"),
                  mobility: get("mobility"),
                  onset: get("onset"),
                  province: get("province"),
                  district: get("district").trim(),
                  firstSessionDate: get("firstSessionDate"),
                  firstSessionTime: get("firstSessionTime"),
                  name: get("name").trim(),
                  tel: get("tel").trim(),
                  contactPref: get("contactPref"),
                  note: get("note").trim(),
                };

                const errors = validate(payload, minDate || minFirstSessionDate());
                if (Object.keys(errors).length > 0) {
                  setFieldErrors(errors);
                  setError("กรุณาตรวจสอบข้อมูลที่กรอกให้ครบถ้วนและถูกต้อง");
                  // First invalid control; for a chip group, its first radio.
                  const first = form.querySelector<HTMLElement>(
                    "[aria-invalid='true']",
                  );
                  (first?.tagName === "FIELDSET"
                    ? first.querySelector<HTMLElement>("input")
                    : first
                  )?.focus();
                  return;
                }

                setFieldErrors({});
                setError("");
                setSubmitting(true);

                try {
                  const res = await fetch("/api/lead", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error("Request failed");
                  setSubmitted(true);
                } catch {
                  setError(
                    "ระบบขัดข้องชั่วคราว กรุณาติดต่อ 02-114-7168 หรือ LINE: @careconnect",
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {/* Step 1 */}
              <fieldset className="form-step">
                <legend className="form-step-title">1. ข้อมูลคนไข้</legend>

                <div className="field">
                  <label htmlFor={condId}>คนไข้มีอาการหรือภาวะใด</label>
                  <select
                    id={condId}
                    name="condition"
                    className={`ctrl${fieldErrors.condition ? " invalid" : ""}`}
                    value={condition}
                    onChange={(e) => {
                      setCondition(e.target.value);
                      clearFieldError("condition");
                    }}
                    aria-invalid={fieldErrors.condition ? true : undefined}
                    aria-describedby={fieldErrors.condition ? `${condId}-err` : undefined}
                    required
                  >
                    <option value="">— เลือก —</option>
                    {CONDITION_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <FieldError id={`${condId}-err`} message={fieldErrors.condition} />
                </div>

                <ChipGroup
                  name="mobility"
                  legend="ตอนนี้คนไข้เคลื่อนไหวได้แค่ไหน (ไม่บังคับ)"
                  options={MOBILITY_OPTIONS}
                />
                <ChipGroup
                  name="onset"
                  legend="เป็นมานานเท่าไร (ไม่บังคับ)"
                  options={ONSET_OPTIONS}
                />
              </fieldset>

              {/* Step 2 */}
              <fieldset className="form-step">
                <legend className="form-step-title">
                  2. สถานที่และวันนัดฝึกครั้งแรก
                </legend>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor={provId}>จังหวัด</label>
                    <select
                      id={provId}
                      name="province"
                      className={`ctrl${fieldErrors.province ? " invalid" : ""}`}
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        clearFieldError("province");
                      }}
                      aria-invalid={fieldErrors.province ? true : undefined}
                      aria-describedby={
                        [
                          fieldErrors.province ? `${provId}-err` : null,
                          province === OTHER_PROVINCE ? `${provId}-help` : null,
                        ]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                      required
                    >
                      <option value="">— เลือกจังหวัด —</option>
                      {PROVINCE_OPTIONS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    {province === OTHER_PROVINCE ? (
                      <p className="form-help" id={`${provId}-help`}>
                        ทีมงานจะแจ้งให้ทราบว่าสามารถให้บริการในพื้นที่ของท่านได้หรือไม่
                      </p>
                    ) : null}
                    <FieldError id={`${provId}-err`} message={fieldErrors.province} />
                  </div>
                  <div className="field">
                    <label htmlFor={distId}>เขต / อำเภอ</label>
                    <input
                      id={distId}
                      name="district"
                      type="text"
                      className={`ctrl${fieldErrors.district ? " invalid" : ""}`}
                      placeholder="เช่น บางนา"
                      autoComplete="address-level2"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        clearFieldError("district");
                      }}
                      aria-invalid={fieldErrors.district ? true : undefined}
                      aria-describedby={fieldErrors.district ? `${distId}-err` : undefined}
                      required
                    />
                    <FieldError id={`${distId}-err`} message={fieldErrors.district} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor={dateId}>วันที่ต้องการฝึกครั้งแรก</label>
                  <input
                    id={dateId}
                    name="firstSessionDate"
                    type="date"
                    className={`ctrl${fieldErrors.firstSessionDate ? " invalid" : ""}`}
                    min={minDate || undefined}
                    value={firstSessionDate}
                    onChange={(e) => {
                      setFirstSessionDate(e.target.value);
                      clearFieldError("firstSessionDate");
                    }}
                    aria-invalid={fieldErrors.firstSessionDate ? true : undefined}
                    aria-describedby={
                      [fieldErrors.firstSessionDate ? `${dateId}-err` : null, scheduleHelpId]
                        .filter(Boolean)
                        .join(" ")
                    }
                    required
                  />
                  <FieldError id={`${dateId}-err`} message={fieldErrors.firstSessionDate} />
                </div>

                <ChipGroup
                  name="firstSessionTime"
                  legend="ช่วงเวลา"
                  options={TIME_OPTIONS}
                  value={firstSessionTime}
                  onChange={(v) => {
                    setFirstSessionTime(v);
                    clearFieldError("firstSessionTime");
                  }}
                  error={fieldErrors.firstSessionTime}
                  errorId={timeErrId}
                  describedBy={scheduleHelpId}
                  required
                />
                <p className="form-help" id={scheduleHelpId}>
                  ทีมงานจะติดต่อเพื่อชำระเงิน ยืนยันวันนัด
                  และนัดเวลาประเมินกับแพทย์เวชศาสตร์ฟื้นฟูก่อนวันฝึกครั้งแรก
                </p>
              </fieldset>

              {/* Step 3 */}
              <fieldset className="form-step">
                <legend className="form-step-title">3. ข้อมูลผู้ติดต่อ</legend>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor={nameId}>ชื่อผู้ติดต่อ</label>
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      className={`ctrl${fieldErrors.name ? " invalid" : ""}`}
                      placeholder="เช่น คุณสมศรี"
                      autoComplete="name"
                      onChange={() => clearFieldError("name")}
                      aria-invalid={fieldErrors.name ? true : undefined}
                      aria-describedby={fieldErrors.name ? `${nameId}-err` : undefined}
                      required
                    />
                    <FieldError id={`${nameId}-err`} message={fieldErrors.name} />
                  </div>
                  <div className="field">
                    <label htmlFor={telId}>เบอร์โทรศัพท์</label>
                    <input
                      id={telId}
                      name="tel"
                      type="tel"
                      className={`ctrl${fieldErrors.tel ? " invalid" : ""}`}
                      placeholder="08X-XXX-XXXX"
                      autoComplete="tel"
                      inputMode="tel"
                      onChange={() => clearFieldError("tel")}
                      aria-invalid={fieldErrors.tel ? true : undefined}
                      aria-describedby={fieldErrors.tel ? `${telId}-err` : undefined}
                      required
                    />
                    <FieldError id={`${telId}-err`} message={fieldErrors.tel} />
                  </div>
                </div>

                <ChipGroup
                  name="contactPref"
                  legend="สะดวกให้ติดต่อกลับทาง (ไม่บังคับ)"
                  options={CONTACT_OPTIONS}
                />

                <div className="field">
                  <label htmlFor={noteId}>เล่าอาการเพิ่มเติม (ไม่บังคับ)</label>
                  <textarea
                    id={noteId}
                    name="note"
                    className="ctrl"
                    placeholder="เช่น อ่อนแรงครึ่งซีกหลัง stroke 3 เดือน ฝึกเดินด้วย walker"
                  />
                </div>
              </fieldset>

              {/* TODO: PDPA consent checkbox — handled separately */}

              {firstSessionDate && firstSessionTime && isIsoDate(firstSessionDate) ? (
                <BookingSummary
                  date={firstSessionDate}
                  time={firstSessionTime}
                  district={district.trim()}
                  province={province}
                  live
                />
              ) : null}

              {error && (
                <p className="form-error" role="alert">
                  <AlertIcon className="form-error-icon" />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="submit"
                className="btn lg form-full-btn"
                style={{ marginTop: 8 }}
                disabled={submitting}
              >
                {submitting ? (
                  "กำลังส่ง…"
                ) : (
                  <>
                    จองวันนัดฝึกครั้งแรก <ArrowIcon />
                  </>
                )}
              </button>
              <p className="form-submit-note">
                ยังไม่ต้องชำระเงินตอนนี้ ทีมงานจะติดต่อภายใน 24 ชั่วโมงเพื่อแจ้งช่องทางชำระเงิน
                การจองจะยืนยันเมื่อชำระเงินเรียบร้อย
              </p>
            </form>
          ) : (
            <div className="form-success">
              <span className="success-mark" aria-hidden="true">
                <CheckIcon />
              </span>
              <h3 className="h2 success-title">ได้รับข้อมูลของคุณแล้ว</h3>
              <p className="lede" style={{ margin: "0 auto 28px" }}>
                เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุดภายใน 24 ชั่วโมง
              </p>
              <a
                href="https://line.me/R/ti/p/@careconnect"
                className="btn lg line form-full-btn"
              >
                <LineIcon /> แอด LINE OA เพื่อติดตามสถานะ
              </a>
              <button
                type="button"
                className="btn ghost form-back-btn"
                onClick={() => setSubmitted(false)}
              >
                กรอกใหม่อีกครั้ง
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
