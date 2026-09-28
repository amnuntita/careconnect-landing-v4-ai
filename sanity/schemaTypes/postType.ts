import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const postType = defineType({
  name: "post",
  title: "บทความ",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "เนื้อหา", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "หัวข้อบทความ",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "content",
      description: "ใช้สร้างลิงก์ของบทความ เช่น /blog/your-slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "เกริ่นนำ / สรุปสั้น",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "ข้อความสั้นๆ แสดงบนการ์ดบทความ และใช้เป็นคำอธิบายเริ่มต้นสำหรับ SEO",
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "coverImage",
      title: "ภาพหน้าปก",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "คำอธิบายภาพ (Alt text)",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "วันที่เผยแพร่",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "หมวดหมู่",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "featured",
      title: "ปักหมุดขึ้นหน้าแรก",
      type: "boolean",
      group: "content",
      description: "เปิดเพื่อให้บทความนี้แสดงก่อนในส่วนบทความบนหน้าแรก",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "เนื้อหาบทความ",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO (ไม่บังคับ)",
      type: "object",
      group: "seo",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta title",
          type: "string",
          description: "ใช้แทนหัวข้อบทความบนผลการค้นหา (ถ้าเว้นว่างจะใช้หัวข้อบทความ)",
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta description",
          type: "text",
          rows: 2,
          description: "ถ้าเว้นว่างจะใช้ข้อความเกริ่นนำ",
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "ภาพแชร์โซเชียล (OG image)",
          type: "image",
          description: "ถ้าเว้นว่างจะใช้ภาพหน้าปก",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "coverImage",
    },
  },
});
