import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateCommentsInTask,
  ReadCommentsInTask,
  UpdateCommentsInTask,
} from "./api";
import type {
  CreateCommentInterface,
  ReadCommentInterface,
  UpdateCommentInterface,
} from "./schemas";

export function useComment(taskId: number) {
  const queryClient = useQueryClient();

  // --- GET ---
  const {
    data: commentInTask = [],
    isLoading,
    error,
    refetch: loadCommentFromTask,
  } = useQuery({
    queryKey: ["comment", taskId],
    queryFn: () => ReadCommentsInTask(taskId),
    enabled: !!taskId,
    staleTime: 6000,
    gcTime: 5 * 60 * 1000,
    select: (data) => data.items,
  });

  // --- POST ---
  const create = useMutation({
    mutationFn: (payload: CreateCommentInterface) =>
      CreateCommentsInTask(taskId, payload),
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        ["comment", taskId],
        (oldComments: ReadCommentInterface[] = []) => [
          ...oldComments,
          newComment,
        ],
      );
    },
  });

  // --- PATCH ---
  const update = useMutation({
    mutationFn: (commentId: number, payload: UpdateCommentInterface) =>
      UpdateCommentsInTask(taskId, commentId, payload),
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(
        ["comment", taskId],
        (oldComments: ReadCommentInterface[] = []) =>
          oldComments.map((comment) =>
            comment.comment_id === updatedComment.comment_id
              ? updatedComment
              : comment,
          ),
      );
    },
  });

  return {
    commentInTask,
    isLoading,
    error,
    loadCommentFromTask,

    create,
    update,
  };
}
