export type User = {
  id: string
  email: string
  password: string
  name?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  collections: Collection[]
  likes: Like[]
  comments: Comment[]
  Items: Item[]
}

export type Collection = {
  id: string
  name: string
  description: string
  categoryId: string
  createdAt: Date
  content?: string
  imageUrl?: string
  author: User
  authorId: string
  items: Item[]
}

export type Item = {
  id: string
  name: string
  tags: string
  collection: Collection
  collectionId: string
  categoryId: string
  createdAt: Date
  content: string
  user: User
  likedByUser: boolean
  userId: string
  custom_string1_state?: Boolean
  custom_string1_name?: string
  custom_string2_state?: Boolean
  custom_string2_name?: string
  custom_string3_state?: Boolean
  custom_string3_name?: string
  custom_int1_state?: Boolean
  custom_int1_name?: string
  custom_int2_state?: Boolean
  custom_int2_name?: string
  custom_int3_state?: Boolean
  custom_int3_name?: string
  Like: Like[]
  Comment: Comment[]
}

export type Like = {
  id: string
  user: User
  userId: string
  item: Item
  itemId: string
}

export type Comment = {
  id: string
  content: string
  user: User
  userId: string
  item: Item
  itemId: string
}
