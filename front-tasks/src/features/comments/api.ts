import Fetch from "../../utils/api.ts";
import type {
  CreateCommentInterface,
  UpdateCommentInterface,
} from "./schemas.ts";

export async function ReadCommentsInTask(taskId: number) {
  const res = await Fetch({ path: `task/${taskId}/comments`, method: "GET" });
  return res;
}

export async function CreateCommentsInTask(
  taskId: number,
  payload: CreateCommentInterface,
) {
  const res = await Fetch({
    path: `task/${taskId}/comments`,
    method: "POST",
    body: payload,
  });
  return await res;
}

export async function UpdateCommentsInTask(
  taskId: number,
  commentId: number,
  payload: UpdateCommentInterface,
) {
  const res = await Fetch({
    path: `task/${taskId}/comments/${commentId}`,
    method: "PATCH",
    body: payload,
  });
  return await res;
}
