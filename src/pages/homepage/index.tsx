/* eslint-disable @typescript-eslint/no-restricted-imports */
import type { Key } from "react"
import { useSelector } from "react-redux"

import { useGetAllCollectionsQuery } from "../../app/services/collectionApi"
import { selectCurrent } from "../../features/user/userSlice"
import ProfileCard from "../../components/card-profile"
import ItemCard from "../../components/card-item"
import CollectionCard from "../../components/card-collection"
import { useGetAllItemsQuery } from "../../app/services/itemApi"

const HomePage = () => {
  const current = useSelector(selectCurrent)
  const { data: collData } = useGetAllCollectionsQuery()
  const { data: itemData } = useGetAllItemsQuery()

  return (
    <div className="flex gap-5 relative">
      <div className="flex-col flex gap-5">
        <b>Top 5 collections: </b>
        {collData
          ?.slice()
          .sort((a, b) => b.items.length - a.items.length)
          .slice(0, 5)
          .map(collection => {
            return (
              <div key={collection.id as Key}>
                <CollectionCard
                  id={collection.id}
                  name={collection.name}
                  imageUrl={collection.imageUrl}
                  categoryId={collection.categoryId}
                  authorId={collection.authorId}
                  authorImg={collection.author.imageUrl}
                  authorName={collection.author.name}
                  createdAt={collection.createdAt}
                  forEdit={collection}
                />
              </div>
            )
          })}
      </div>
      <div className="flex-col flex gap-5">
        <b>Newest items: </b>
        {itemData?.map(item => {
          return (
            <div key={item.id as Key}>
              <ItemCard
                id={item.id}
                name={item.name}
                categoryId={item.categoryId}
                userId={item.userId}
                authorImg={item.user.imageUrl}
                authorName={item.user.name}
                tags={item.tags}
              />
            </div>
          )
        })}
      </div>
      <div className="flex-col flex">{current && <ProfileCard />}</div>
    </div>
  )
}

export default HomePage
