import logger from "../config/logger.config";
import Room from "../db/models/room";
import BaseRepository from "./base.repository";

export class RoomRepository extends BaseRepository<Room> {
  constructor() {
    super(Room);
  }

  async findAll(): Promise<Room[]> {
    const records = await this.model.findAll({
      where: {
        deletedAt: null,
      },
    });

    if (!records || records.length === 0) {
      logger.warn("No rooms found");
      return [];
    }

    logger.info(`Rooms found: ${records.length}`);
    return records;
  }
}
