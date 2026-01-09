import Fetch from "../../../utils/api";
import type { CreateMessageInterface } from "../schemas/messageSchema";

export async function GetMessages(projectId: number) {
  const res = await Fetch({ path: `chat/${projectId}`, method: "GET" });
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
