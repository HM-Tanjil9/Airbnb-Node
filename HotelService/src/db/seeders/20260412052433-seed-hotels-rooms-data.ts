import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    // DISABLE foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    try {
      // Clear tables in correct order
      await queryInterface.bulkDelete("rooms", {}, {});
      await queryInterface.bulkDelete("room_categories", {}, {});
      await queryInterface.bulkDelete("hotels", {}, {});

      // Reset auto-increment counters
      await queryInterface.sequelize.query(
        "ALTER TABLE hotels AUTO_INCREMENT = 1",
      );
      await queryInterface.sequelize.query(
        "ALTER TABLE room_categories AUTO_INCREMENT = 1",
      );
      await queryInterface.sequelize.query(
        "ALTER TABLE rooms AUTO_INCREMENT = 1",
      );

      // Insert hotels
      await queryInterface.bulkInsert("hotels", [
        {
          name: "Ocean View Hotel",
          address: "123 Beachside Lane",
          location: "Goa",
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          name: "Mountain Retreat",
          address: "456 Hilltop Road",
          location: "Manali",
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ]);

      // Insert room categories
      await queryInterface.bulkInsert("room_categories", [
        {
          hotel_id: 1,
          price: 3000,
          room_type: "SINGLE",
          room_count: 10,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 1,
          price: 5000,
          room_type: "DOUBLE",
          room_count: 8,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 2,
          price: 8000,
          room_type: "DELUXE",
          room_count: 5,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 2,
          price: 12000,
          room_type: "SUITE",
          room_count: 2,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ]);

      // Insert rooms - WITHOUT the price column
      await queryInterface.bulkInsert("rooms", [
        {
          hotel_id: 1,
          room_category_id: 1,
          room_no: 101,
          date_of_availability: "2025-06-03",
          // price: 3000,  // REMOVED - column doesn't exist in database
          booking_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 1,
          room_category_id: 2,
          room_no: 201,
          date_of_availability: "2025-06-04",
          // price: 5000,  // REMOVED
          booking_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 1,
          room_category_id: 1,
          room_no: 102,
          date_of_availability: "2025-06-05",
          // price: 3000,  // REMOVED
          booking_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 2,
          room_category_id: 3,
          room_no: 301,
          date_of_availability: "2025-06-03",
          // price: 8000,  // REMOVED
          booking_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 2,
          room_category_id: 1,
          room_no: 302,
          date_of_availability: "2025-06-04",
          // price: 3000,  // REMOVED
          booking_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          hotel_id: 2,
          room_category_id: 2,
          room_no: 303,
          date_of_availability: "2025-06-05",
          // price: 5000,  // REMOVED
          booking_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ]);
    } finally {
      // Re-enable foreign key checks
      await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    try {
      await queryInterface.bulkDelete("rooms", {}, {});
      await queryInterface.bulkDelete("room_categories", {}, {});
      await queryInterface.bulkDelete("hotels", {}, {});
    } finally {
      await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  },
};
