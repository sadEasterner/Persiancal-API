"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        username: "persia_admin",
        name: "Dr.Ali Tavakoli",
        email: "persia.azmasystem1@gmail.com",
        password:
          "97089167ab147bcd545e77db278a230bf4ba4f404e4b27b5addf4b22646f2d98",
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('users', null, {});
     */
  },
};
