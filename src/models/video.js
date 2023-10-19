import { Schema, Types, model } from "mongoose";

const videoSchema = new Schema({
  players: {
    type: [Schema.Types.ObjectId],
    ref: "Player",
    required: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  type: {
    type: String,
  },
  tags: {
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

const Video = model("Video", videoSchema);

export default Video;
