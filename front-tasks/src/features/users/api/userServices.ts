import Fetch from "../../../utils/api.ts";

export async function fetchGetAllUsers() {
  const res = await Fetch({ path: "user", method: "GET" });
  return res;
}
