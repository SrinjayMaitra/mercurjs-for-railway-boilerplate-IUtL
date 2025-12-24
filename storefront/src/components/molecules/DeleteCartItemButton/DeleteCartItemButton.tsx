"use client"

import { Button } from "@/components/atoms"
import { BinIcon } from "@/icons"
import { deleteLineItem } from "@/lib/data/cart"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const DeleteCartItemButton = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteLineItem(id)
      // Refresh the page to update the cart display
      router.refresh()
    } catch (error) {
      console.error("Failed to delete cart item:", error)
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <Button
      variant="text"
      className="w-10 h-10 flex items-center justify-center p-0"
      onClick={() => handleDelete(id)}
      loading={isDeleting}
      disabled={isDeleting}
    >
      <BinIcon size={20} />
    </Button>
  )
}
