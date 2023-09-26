import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true 
  },
  league: { 
    type: Schema.Types.ObjectId, 
    ref: 'League', 
    required: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  founded: { 
    type: Number 
  },
  city: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date 
  }
});

const Team = model('Team', teamSchema);

export default Team;
