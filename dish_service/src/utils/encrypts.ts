const bcrypt = require("bcryptjs");
const saltRounds = 5;

export async function hashText(text: string): Promise<string | null> {
  try {
    const hash = await bcrypt.hash(text, saltRounds);
    return hash;
  } catch (err: any) {
    // console.error("Error hashing text:", err.message);
    return null;
  }
}

export async function verifyHashText(
  text: string,
  hashedText: string
): Promise<boolean> {
  try {
    const result = await bcrypt.compare(text, hashedText);
    return result;
  } catch (err: any) {
    // console.error("Error comparing text:", err.message);
    return false;
  }
}
