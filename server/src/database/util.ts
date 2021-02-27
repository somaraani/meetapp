import { SchemaOptions, Schema, SchemaDefinition, DocumentDefinition } from "mongoose"

export const CreateSchema = (options: any) : Schema => {
    const schema = new Schema(options);
    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id;
            return ret;
        }
    });
    return schema;
}