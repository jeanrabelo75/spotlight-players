import { genSalt, hash } from "bcrypt";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: Object,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  birthday: {
    type: Date,
    required: true,
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await genSalt(10);
      this.password = await hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const User = model("User", userSchema);

export default User;
