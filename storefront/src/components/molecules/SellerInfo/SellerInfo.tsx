import { SellerAvatar } from "@/components/cells/SellerAvatar/SellerAvatar"
import { SellerProps } from "@/types/seller"
import { SellerReview } from "../SellerReview/SellerReview"

export const SellerInfo = ({
  seller,
  header = false,
}: {
  seller: SellerProps
  header?: boolean
}) => {
  const { photo, name, reviews } = seller

  return (
    <div className="flex gap-4 w-full">
      <div className="relative h-12 w-12 overflow-hidden rounded-sm">
        <SellerAvatar photo={photo} size={56} alt={name} />
      </div>
      <div className="w-[90%]">
        <h3 className="heading-sm text-primary">{name}</h3>
        <div className="mt-4">
          {!header &&
            reviews
              ?.filter((rev) => rev !== null)
              .slice(-3)
              .map((review) => (
                <SellerReview key={review.id} review={review} />
              ))}
        </div>
      </div>
    </div>
  )
}
