import type { Item } from "../types"
import { api } from "./api"

export const ItemApi = api.injectEndpoints({
  endpoints: builder => ({
    createItem: builder.mutation<
      Item,
      {
        name: string
        tags: string
        collectionId: string
        categoryId: string
        content: string
      }
    >({
      query: itemData => ({
        url: "/items",
        method: "POST",
        body: itemData,
      }),
    }),

    getAllItems: builder.query<Item[], void>({
      query: () => ({
        url: "/items",
        method: "GET",
      }),
    }),

    getItemById: builder.query<Item, string>({
      query: id => ({
        url: `/items/${id}`,
        method: "GET",
      }),
    }),

    editItem: builder.mutation<Item, Partial<Item>>({
      query: itemData => ({
        url: `/items/${itemData.id}`,
        method: "PUT",
        body: itemData,
      }),
    }),

    deleteItem: builder.mutation<void, string>({
      query: id => ({
        url: `/items/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useCreateItemMutation,
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useEditItemMutation,
  useDeleteItemMutation,
  useLazyGetAllItemsQuery,
  useLazyGetItemByIdQuery,
} = ItemApi

export const {
  endpoints: { createItem, getAllItems, getItemById, editItem, deleteItem },
} = ItemApi
