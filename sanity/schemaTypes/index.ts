import type { SchemaTypeDefinition } from "sanity";

import { authorType } from "./authorType";
import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { settingsType } from "./settingsType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, authorType, categoryType, blockContentType, settingsType],
};
