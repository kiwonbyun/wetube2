import mongoose from "mongoose";
import bcrypy from "bcrypt";
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypy.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
