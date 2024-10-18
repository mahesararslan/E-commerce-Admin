import { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
});

export const Category = models.Category || model("Category", CategorySchema);