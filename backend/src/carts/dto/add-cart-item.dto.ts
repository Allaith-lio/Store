import { IsMongoId, IsInt, Max, Min } from "class-validator";

export class AddCartItemDto {
  @IsMongoId()
  productId: string

  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number
}