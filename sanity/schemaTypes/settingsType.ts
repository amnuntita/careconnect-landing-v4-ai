import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

// Singleton: lets editors tweak the /blog index copy without touching code.
export const settingsType = defineType({
  name: "settings",
  title: "ตั้งค่าบล็อก",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "blogTitle",
      title: "หัวข้อหน้าบล็อก",
      type: "string",
      initialValue: "บทความและความรู้",
    }),
    defineField({
      name: "blogDescription",
      title: "คำอธิบายหน้าบล็อก",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "ogImage",
      title: "ภาพแชร์โซเชียลเริ่มต้น (OG image)",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "ตั้งค่าบล็อก" }),
  },
});
