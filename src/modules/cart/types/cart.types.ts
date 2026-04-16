export type CartItem = {
  productVariantId: string
  productId: string
  name: string
  slug: string
  sku: string
  price: number
  quantity: number
  maxStock: number
  sizeName: string
  sizeShortName: string
  unitCategoryName: string
  cardImage: string | null
}
