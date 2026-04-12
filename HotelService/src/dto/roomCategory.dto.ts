import { RoomType } from "../db/models/roomCategory";

export type createRoomCategoryDto = {
  hotelId: number;
  price: number;
  roomType: RoomType;
  roomCount: number;
};
