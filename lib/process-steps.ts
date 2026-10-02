// GENERATED from content-drafts/homepage-bofu-v4.txt §4 (verbatim). Data for
// components/ProcessDiagram.tsx.

export type StepRole = "doctor" | "therapist";

export type ProcessStep = {
  label: string; // ขั้นที่ N
  role: StepRole;
  roleLabel: string; // as written in the draft
  location: string | null; // null = the draft gives none (step 3)
  title: string;
  description: string;
  // Step 4: the plan can be adjusted by the physician during this step.
  loop?: boolean;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    "label": "ขั้นที่ 1",
    "role": "doctor",
    "roleLabel": "แพทย์",
    "location": "ทาง telemedicine",
    "title": "ประเมินและเลือกโปรแกรม",
    "description": "แพทย์เวชศาสตร์ฟื้นฟูซักประวัติ ทำความเข้าใจปัญหาในชีวิตประจำวัน ตั้งเป้าหมาย และเลือกโปรแกรมที่เหมาะสมร่วมกับครอบครัว"
  },
  {
    "label": "ขั้นที่ 2",
    "role": "therapist",
    "roleLabel": "นักกายภาพ",
    "location": "ที่บ้าน",
    "title": "ประเมินและฝึกครั้งแรก",
    "description": "นักกายภาพประเมินจากสภาพแวดล้อมจริง 10–15 นาที แล้วฝึกอีก 60 นาที ตามแผนของแพทย์"
  },
  {
    "label": "ขั้นที่ 3",
    "role": "doctor",
    "roleLabel": "แพทย์",
    "location": null,
    "title": "ทบทวนและปรับแผน",
    "description": "แพทย์ทบทวนบันทึกจากหน้างาน และปรับแผนถ้าสิ่งที่พบต่างจากที่ประเมินไว้"
  },
  {
    "label": "ขั้นที่ 4",
    "role": "therapist",
    "roleLabel": "นักกายภาพ/นักกิจกรรมบำบัด",
    "location": "ที่บ้าน",
    "title": "ฝึกต่อเนื่อง",
    "description": "ฝึกตามเป้าหมาย สอนครอบครัว และจัดโปรแกรมฝึกต่อเองที่บ้าน แพทย์ปรับแผนเมื่อความก้าวหน้าไม่เป็นไปตามที่คาดหรือมีปัญหาทางการแพทย์",
    "loop": true
  },
  {
    "label": "ขั้นที่ 5",
    "role": "doctor",
    "roleLabel": "แพทย์",
    "location": "ทาง telemedicine",
    "title": "ประเมินผลช่วงท้ายคอร์ส",
    "description": "แพทย์ประเมินว่าคนไข้ไปถึงเป้าหมายแค่ไหน และแนะนำขั้นต่อไป"
  }
];
