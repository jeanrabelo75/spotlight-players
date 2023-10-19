import { Schema, model } from "mongoose";

const rolesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  permissions: {
    type: Object,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

const Roles = model("Roles", rolesSchema);

export default Roles;