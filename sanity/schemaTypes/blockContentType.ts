import { defineArrayMember, defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

// Rich-text body for blog posts. Supports headings, lists, links, basic marks,
// and inline images with required alt text (accessibility + SEO).
export const blockContentType = defineType({
  name: "blockContent",
  title: "เนื้อหา",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "ย่อหน้า", value: "normal" },
        { title: "หัวข้อ H2", value: "h2" },
        { title: "หัวข้อ H3", value: "h3" },
        { title: "หัวข้อ H4", value: "h4" },
        { title: "คำพูด (Quote)", value: "blockquote" },
      ],
      lists: [
        { title: "รายการแบบจุด", value: "bullet" },
        { title: "รายการแบบตัวเลข", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "ตัวหนา", value: "strong" },
          { title: "ตัวเอียง", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "ลิงก์",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "คำอธิบายภาพ (Alt text)",
          description: "อธิบายภาพสำหรับ SEO และผู้ใช้ที่ใช้โปรแกรมอ่านหน้าจอ",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "คำบรรยายใต้ภาพ",
        }),
      ],
    }),
  ],
});
