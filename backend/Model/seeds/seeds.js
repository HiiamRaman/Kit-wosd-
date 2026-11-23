import UserSeed from "./userseed.js";

export default async function seed() {
  try {
    await UserSeed();
  } catch (e) {
    console.error(e);
  }
}
