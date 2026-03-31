import { CreateBookingDTO } from "../dto/booking.dto";
import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizedIdempotencyKey,
  getIdempotencyKeyWithLock,
} from "../repositories/booking.repositories";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/helpers/generateIdempotencyKey";
// import { PrismaClient } from "../prisma/generated/client";
import { prisma as prismaClient } from "../config/prisma.config";
import { redlock } from "../config/redis.config";
import { serverConfig } from "../config";
export async function createBookingService(createBookingDTO: CreateBookingDTO) {
  const tll = serverConfig.LOCK_TTL;
  const bookingResource = `hotel:${createBookingDTO.hotelId}`;

  try {
    await redlock.acquire([bookingResource], tll);
    const booking = await createBooking({
      userId: createBookingDTO.userId,
      hotelId: createBookingDTO.hotelId,
      totalGuests: createBookingDTO.totalGuests,
      bookingAmount: createBookingDTO.bookingAmount,
    });
    const idempotencyKey = generateIdempotencyKey();
    await createIdempotencyKey(idempotencyKey, booking.id);
    return {
      bookingId: booking.id,
      idempotencyKey,
    };
  } catch (error) {
    throw new InternalServerError(
      "Failed to acquire lock for booking resource",
    );
  }
}

export async function confirmBookingService(idempotencyKey: string) {
  return await prismaClient.$transaction(async (tx) => {
    const idempotencyKeyData = await getIdempotencyKeyWithLock(
      tx,
      idempotencyKey,
    );
    if (!idempotencyKeyData || !idempotencyKeyData.bookingId) {
      throw new NotFoundError("Idempotency key not found");
    }
    if (idempotencyKeyData.finalized) {
      throw new BadRequestError("Idempotency key already finalized");
    }
    // payment steps
    const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
    await finalizedIdempotencyKey(tx, idempotencyKey);
    return booking;
  });
}
