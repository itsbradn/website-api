import { Schema, model } from "mongoose";
import { DocContent, DocPage } from "../../types/docPage";

const DocPageSchema = new Schema<DocPage>({
  path: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  content: Array<DocContent>,
});

export const DocPageModel = model<DocPage>('docPage', DocPageSchema);
