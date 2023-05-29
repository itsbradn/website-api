import { Schema, Types, model } from "mongoose";
import { DocSection } from "../../types/docSection";

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
  pages: Array<{ id: Types.ObjectId; label?: string; children?: [] }>,
});

export const DocSectionModel = model<DocSection>(
  "docSection",
  DocSectionSchema
);
