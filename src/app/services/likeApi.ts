import type { Like } from "../types"
import { api } from "./api"

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    likeItem: builder.mutation<Like, { itemId: string }>({
      query: body => ({
        url: "/likes",
        method: "POST",
        body,
      }),
    }),
    unlikeItem: builder.mutation<void, string>({
      query: itemParam => ({
        url: `/likes/${itemParam}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useLikeItemMutation, useUnlikeItemMutation } = likeApi

export const {
  endpoints: { likeItem, unlikeItem },
} = likeApi
