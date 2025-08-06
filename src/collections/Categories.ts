import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "category",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
