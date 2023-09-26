import { Schema, Types, model } from 'mongoose';

const playerSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String 
  },
  team: { 
    type: Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  },
  birthday: { 
    type: Date, 
    required: true 
  },
  height: { 
    type: String 
  },
  weight: { 
    type: String 
  },
  position: { 
    type: Object, 
    required: true 
  },
  number: { 
    type: Number 
  },
  preferred_foot: { 
    type: String 
  },
  country: { 
    type: String, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date 
  }
});

const Player = model('Player', playerSchema);

export default Player;
