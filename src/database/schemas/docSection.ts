import { Schema, Types, model } from "mongoose";
import { DocSection } from "../../types/DocSection";

const DocSectionSchema = new Schema<DocSection>({
  path: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  pages: Array<{ id: Types.ObjectId; children: [] }>,
});

export const DocSectionModel = model<DocSection>('docSection', DocSectionSchema);
