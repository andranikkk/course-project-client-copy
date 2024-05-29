import type { Comment } from "../types"
import { api } from "./api"

export const CommentApi = api.injectEndpoints({
  endpoints: builder => ({
    createComment: builder.mutation<Comment, Partial<Comment>>({
      query: commentData => ({
        url: "/comments",
        method: "POST",
        body: commentData,
      }),
    }),
    deleteComment: builder.mutation<void, string>({
      query: id => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation
} = CommentApi

export const {
  endpoints: { createComment, deleteComment },
} = CommentApi
