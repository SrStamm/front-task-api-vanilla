import Fetch from "../../utils/api.ts";
import type {
  CreateCommentInterface,
  UpdateCommentInterface,
} from "./schemas.ts";

export async function ReadCommentsInTask(taskId: number) {
  const res = await Fetch({ path: `task/${taskId}/comments`, method: "GET" });
  if (!res) throw new Error(`Failed to get Comments from Task ${taskId}`);
  return res.json();
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
  if (!res) throw new Error(`Failed to create a new comment to Task ${taskId}`);
  return await res.json();
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
  if (!res)
    throw new Error(
      `Failed to update a comment ${commentId} to Task ${taskId}`,
    );
  return await res.json();
}
