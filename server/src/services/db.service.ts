const path = require('path');
const DB = require('better-sqlite3')(path.join(__dirname, '../../db/cozy_corner.db'));
export { DB };