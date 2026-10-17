import { useEffect } from "react";
import { toast } from "sonner";
import { useChatSocket } from "../../../features/chat/hooks/useChatSocket";

interface NotificationPayload {
  message?: string;
  notification_type?: string;
}

function NotificationToasts() {
  const { onMessage } = useChatSocket();

  useEffect(() => {
    const off = onMessage((data) => {
      if (data.type !== "notification") return;
      const p = data.payload as NotificationPayload;
      if (p?.message) toast.info(p.message);
    });
    return off;
  }, [onMessage]);

  return null;
}
export default NotificationToasts;
