import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // ✅ no required here
  resume: { type: String, default: '' },
  image: { type: String, default: '' },
});

// optional: re-create clean index
userSchema.index({ email: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema);

export default User;
