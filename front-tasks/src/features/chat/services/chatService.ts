import Fetch from "../../../utils/api";
import type { CreateMessageInterface } from "../schemas/messageSchema";

export async function GetMessages(projectId: number) {
  const res = await Fetch({ path: `chat/${projectId}`, method: "GET" });
  if (!res.ok)
    throw new Error(`Error al obtener los mensajes del proyecto ${projectId}`);
  return await res.json();
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
  if (!res.ok)
    throw new Error(
      `Error al crear el nuevo mensaje en el proyecto ${projectId}`,
    );
  return await res.json();
}
