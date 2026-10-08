import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

// A person who writes or medically reviews blog posts. Shown as the byline
// and the "ตรวจสอบเนื้อหาโดย" line, and used for Person JSON-LD.
export const authorType = defineType({
  name: "author",
  title: "ผู้เขียน / ผู้ตรวจสอบ",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "ชื่อ-นามสกุล",
      type: "string",
      description: "รวมคำนำหน้า เช่น พญ. / กภ.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "credentials",
      title: "ตำแหน่ง / วุฒิ",
      type: "string",
      description: "เช่น แพทย์เวชศาสตร์ฟื้นฟู, นักกายภาพบำบัด",
    }),
    defineField({
      name: "licenseNumber",
      title: "เลขที่ใบอนุญาตประกอบวิชาชีพ (ไม่บังคับ)",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "รูปภาพ (ไม่บังคับ)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "คำอธิบายภาพ (Alt text)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "ประวัติโดยย่อ",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "credentials", media: "photo" },
  },
});
