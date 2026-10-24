import Fetch from "../../../utils/api";
import type { CreateMessageInterface } from "../schemas/messageSchema";

export async function GetMessages(
  projectId: number,
  params?: { limit?: number; skip?: number },
) {
  const query = new URLSearchParams();
  if (params?.limit !== undefined && params?.limit !== null) {
    query.set("limit", String(params.limit));
  }
  if (params?.skip !== undefined && params?.skip !== null) {
    query.set("skip", String(params.skip));
  }
  const queryString = query.toString();
  const path = queryString ? `chat/${projectId}?${queryString}` : `chat/${projectId}`;
  const res = await Fetch({ path, method: "GET" });
  return res;
}

export async function CreateMessages(
  projectId: number,
  payload: CreateMessageInterface,
) {
  const res = await Fetch({
    path: `/chat/${projectId}`,
    method: "POST",
    body: payload,
  });
  return res;
}
