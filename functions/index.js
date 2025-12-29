/**
 * Trovo Backend API - Firebase Functions Entry Point
 * This file exports the Express API as a Firebase Cloud Function
 */

const { api } = require('../dist/index.js');

// Export the API function
exports.api = api;
