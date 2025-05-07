"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const path = require('path');
const DB = require('better-sqlite3')(path.join(__dirname, '../../db/cozy_corner.db'));
exports.DB = DB;
