import type { Collection } from "../types"
import { api } from "./api"

export const CollectionApi = api.injectEndpoints({
  endpoints: builder => ({
    createCollection: builder.mutation<
      Collection,
      {
        name: string
        description: string
        categoryId: string
      }
    >({
      query: collectionData => ({
        url: "/collections",
        method: "POST",
        body: collectionData,
      }),
    }),

    getAllCollections: builder.query<Collection[], void>({
      query: () => ({
        url: "/collections",
        method: "GET",
      }),
    }),

    getCollectionById: builder.query<Collection, string>({
      query: id => ({
        url: `/collections/${id}`,
        method: "GET",
      }),
    }),

    editCollection: builder.mutation<Collection, Partial<Collection>>({
      query: collData => ({
        url: `/collections/${collData.id}`,
        method: "PUT",
        body: collData,
      }),
    }),

    deleteCollection: builder.mutation<void, string>({
      query: id => ({
        url: `/collections/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useCreateCollectionMutation,
  useGetAllCollectionsQuery,
  useGetCollectionByIdQuery,
  useDeleteCollectionMutation,
  useLazyGetAllCollectionsQuery,
  useLazyGetCollectionByIdQuery,
  useEditCollectionMutation,
} = CollectionApi

export const {
  endpoints: {
    createCollection,
    deleteCollection,
    getAllCollections,
    getCollectionById,
    editCollection,
  },
} = CollectionApi
