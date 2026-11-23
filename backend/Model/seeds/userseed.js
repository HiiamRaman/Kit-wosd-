import User from "../user.js";
import bcrypt from "bcryptjs";
export default async function UserSeed() {
  try {
    const users = [
      {
        username: "admin",
        email: "admin@test.com",
        password: await bcrypt.hash("passcode", 10),
        role: "admin",
        balance: 10000,
      },
      {
        username: "carlos1",
        email: "carlosmontoya@gmail.com",
        password: await bcrypt.hash("passcode", 10),
        role: "user",
        balance: 1000,
      },
    ];
    const admin = await User.findOne({ email: users[0].email, role: "admin" });
    const dummyUser = await User.findOne({ email: users[1].email });

    if (admin && dummyUser) return;
    await User.insertMany(users);
    console.log("Users seeded");
  } catch (e) {
    console.error(e);
  }
}
