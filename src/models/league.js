import { Schema, Types, model } from 'mongoose';

const leagueSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true 
  },
  code: { 
    type: String, 
    required: true,
    unique: true
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date 
  }
});

const League = model('League', leagueSchema);

export default League;