"use client";

import { useId, useState } from "react";
import { AlertIcon, ArrowIcon, CheckIcon, LineIcon } from "./Icons";

const CONDITION_OPTIONS = [
  "Stroke (อัมพฤกษ์ อัมพาต)",
  "ฝึกกลืน / ปัญหาการสำลัก",
  "ผ่าตัดเข่า / สะโพก",
  "อุบัติเหตุ / บาดเจ็บ",
  "ปวดเรื้อรัง",
  "ภาวะอ่อนแรงในผู้สูงอายุ",
  "อื่นๆ",
];

type FieldErrors = {
  condition?: string;
  province?: string;
  district?: string;
  name?: string;
  tel?: string;
};

type LeadValues = {
  condition: string;
  province: string;
  district: string;
  name: string;
  tel: string;
  preferredTime: string;
  symptoms: string;
  duration: string;
};

const TIME_SLOT_OPTIONS = [
  "เช้า (9:00–12:00)",
  "บ่าย (13:00–16:00)",
  "เย็น (16:00–19:00)",
];

// Thai mobile/landline numbers are 9–10 digits; allow spaces, dashes and a
// leading +66 country code while validating the underlying digit count.
function validate(values: LeadValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.condition) errors.condition = "กรุณาเลือกกลุ่มอาการ";
  if (!values.province.trim()) errors.province = "กรุณากรอกจังหวัด";
  if (!values.district.trim()) errors.district = "กรุณากรอกเขต / อำเภอ";
  if (!values.name.trim()) errors.name = "กรุณากรอกชื่อผู้ติดต่อ";

  const tel = values.tel.trim();
  if (!tel) {
    errors.tel = "กรุณากรอกเบอร์โทรศัพท์";
  } else {
    const digits = tel.replace(/[\s-]/g, "").replace(/^\+66/, "0");
    if (!/^0\d{8,9}$/.test(digits)) {
      errors.tel = "เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 08X-XXX-XXXX)";
    }
  }

  return errors;
}

export function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [condition, setCondition] = useState("");

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
  const nameId = useId();
  const telId = useId();
  const timeId = useId();
  const symId = useId();
  const durId = useId();

  return (
    <section className="form-section" id="form">
      <div className="wrap">
        <div className="form-shell">
          <div className="form-head">
            <span className="eyebrow">เริ่มต้นฟื้นฟูตั้งแต่วันนี้</span>
            <h2 className="h2">ทดลองทำกายภาพ</h2>
            <p className="lede form-lede">
              ทีมงานจะโทรกลับเพื่อยืนยันวันและเวลานัดหมายอีกครั้ง ราคาพิเศษ 1,290 บาทสำหรับลูกค้าใหม่
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
                const payload: LeadValues = {
                  condition: String(data.get("condition") ?? ""),
                  province: String(data.get("province") ?? ""),
                  district: String(data.get("district") ?? ""),
                  name: String(data.get("name") ?? ""),
                  tel: String(data.get("tel") ?? ""),
                  preferredTime: String(data.get("preferredTime") ?? ""),
                  symptoms: String(data.get("symptoms") ?? ""),
                  duration: String(data.get("duration") ?? ""),
                };

                const errors = validate(payload);
                if (Object.keys(errors).length > 0) {
                  setFieldErrors(errors);
                  setError("กรุณาตรวจสอบข้อมูลที่กรอกให้ครบถ้วนและถูกต้อง");
                  form
                    .querySelector<HTMLElement>("[aria-invalid='true']")
                    ?.focus();
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
              <div className="field">
                <label htmlFor={condId}>กลุ่มอาการของคนไข้</label>
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
                  aria-describedby={
                    fieldErrors.condition ? `${condId}-err` : undefined
                  }
                  required
                >
                  <option value="">— เลือกกลุ่มอาการ —</option>
                  {CONDITION_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                {fieldErrors.condition && (
                  <p className="field-error" id={`${condId}-err`}>
                    <AlertIcon className="field-error-icon" />
                    {fieldErrors.condition}
                  </p>
                )}
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor={provId}>จังหวัด</label>
                  <input
                    id={provId}
                    name="province"
                    type="text"
                    className={`ctrl${fieldErrors.province ? " invalid" : ""}`}
                    placeholder="เช่น กรุงเทพมหานคร"
                    autoComplete="address-level1"
                    onChange={() => clearFieldError("province")}
                    aria-invalid={fieldErrors.province ? true : undefined}
                    aria-describedby={
                      fieldErrors.province ? `${provId}-err` : undefined
                    }
                    required
                  />
                  {fieldErrors.province && (
                    <p className="field-error" id={`${provId}-err`}>
                      <AlertIcon className="field-error-icon" />
                      {fieldErrors.province}
                    </p>
                  )}
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
                    onChange={() => clearFieldError("district")}
                    aria-invalid={fieldErrors.district ? true : undefined}
                    aria-describedby={
                      fieldErrors.district ? `${distId}-err` : undefined
                    }
                    required
                  />
                  {fieldErrors.district && (
                    <p className="field-error" id={`${distId}-err`}>
                      <AlertIcon className="field-error-icon" />
                      {fieldErrors.district}
                    </p>
                  )}
                </div>
              </div>

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
                    aria-describedby={
                      fieldErrors.name ? `${nameId}-err` : undefined
                    }
                    required
                  />
                  {fieldErrors.name && (
                    <p className="field-error" id={`${nameId}-err`}>
                      <AlertIcon className="field-error-icon" />
                      {fieldErrors.name}
                    </p>
                  )}
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
                    aria-describedby={
                      fieldErrors.tel ? `${telId}-err` : undefined
                    }
                    required
                  />
                  {fieldErrors.tel && (
                    <p className="field-error" id={`${telId}-err`}>
                      <AlertIcon className="field-error-icon" />
                      {fieldErrors.tel}
                    </p>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor={timeId}>เวลาที่ต้องการปรึกษาคุณหมอ</label>
                <select id={timeId} name="preferredTime" className="ctrl">
                  <option value="">— เลือกช่วงเวลา —</option>
                  {TIME_SLOT_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor={symId}>อาการเบื้องต้นของคนไข้</label>
                <textarea
                  id={symId}
                  name="symptoms"
                  className="ctrl"
                  placeholder="เช่น อ่อนแรงครึ่งซีกหลัง stroke 3 เดือน ฝึกเดินด้วย walker"
                />
              </div>

              <div className="field">
                <label htmlFor={durId}>ระยะเวลาที่เป็น</label>
                <input
                  id={durId}
                  name="duration"
                  type="text"
                  className="ctrl"
                  placeholder="เช่น 3 เดือน, 2 ปี"
                />
              </div>

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
                    ส่งข้อมูล <ArrowIcon />
                  </>
                )}
              </button>
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
