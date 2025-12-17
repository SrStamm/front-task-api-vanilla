import Fetch from "../../../utils/api.ts";

export async function fetchGetAllUsers() {
  const res = await Fetch({ path: "user", method: "GET" });
  if (!res.ok) throw new Error(`Failed to fetch users`);
  return res.json();
}
