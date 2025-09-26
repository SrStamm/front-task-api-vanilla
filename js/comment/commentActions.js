import { createComment } from "../api.js";

export async function createCommentAction(taskId, content) {
  try {
    const data = { content: content };
    const response = await createComment(taskId, data);

    if (response.detail === "New comment created") {
      return { success: true, detail: "Commment created successfully" };
    }
  } catch (error) {
    return { success: false, detail: error.message };
  }
}
