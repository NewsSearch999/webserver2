/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/dummy/src/connection/connection.service.ts":
/*!*********************************************************!*\
  !*** ./apps/dummy/src/connection/connection.service.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const connection = __importStar(__webpack_require__(/*! mysql2/promise */ "mysql2/promise"));
const sql_template_strings_1 = __webpack_require__(/*! sql-template-strings */ "sql-template-strings");
let ConnectionService = class ConnectionService {
    constructor(configService) {
        this.connection = connection.createPool({
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            user: configService.get('DB_USER'),
            database: configService.get('DB_NAME'),
            password: configService.get('DB_PASSWORD'),
            connectionLimit: 500,
        });
    }
    async Query(rawQuery, params) {
        const conn = await this.connection.getConnection();
        const [results, fields] = await conn.query(rawQuery, params);
        conn.release();
        return results;
    }
    async SQL(...args) {
        let data = [];
        if (typeof args[0] === 'string' && args[1] instanceof Array)
            data = await this.connection.query(args[0], args[1]);
        else if (args[0] instanceof sql_template_strings_1.SQLStatement && args[1] instanceof Array)
            data = await this.connection.query(args[0], args[1]);
        else if (args[0] instanceof sql_template_strings_1.SQLStatement && args[1] === undefined)
            data = await this.connection.query(args[0]);
        return data[0];
    }
};
ConnectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], ConnectionService);
exports.ConnectionService = ConnectionService;


/***/ }),

/***/ "./apps/dummy/src/dummy.controller.ts":
/*!********************************************!*\
  !*** ./apps/dummy/src/dummy.controller.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DummyController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dummy_service_1 = __webpack_require__(/*! ./dummy.service */ "./apps/dummy/src/dummy.service.ts");
let DummyController = class DummyController {
    constructor(dummyService) {
        this.dummyService = dummyService;
    }
    createProdcuts() {
        return this.dummyService.createProducts();
    }
};
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DummyController.prototype, "createProdcuts", null);
DummyController = __decorate([
    (0, common_1.Controller)('dummy'),
    __metadata("design:paramtypes", [typeof (_a = typeof dummy_service_1.DummyService !== "undefined" && dummy_service_1.DummyService) === "function" ? _a : Object])
], DummyController);
exports.DummyController = DummyController;


/***/ }),

/***/ "./apps/dummy/src/dummy.module.ts":
/*!****************************************!*\
  !*** ./apps/dummy/src/dummy.module.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DummyModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const connection_service_1 = __webpack_require__(/*! ./connection/connection.service */ "./apps/dummy/src/connection/connection.service.ts");
const dummy_controller_1 = __webpack_require__(/*! ./dummy.controller */ "./apps/dummy/src/dummy.controller.ts");
const dummy_service_1 = __webpack_require__(/*! ./dummy.service */ "./apps/dummy/src/dummy.service.ts");
const Joi = __importStar(__webpack_require__(/*! joi */ "joi"));
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let DummyModule = class DummyModule {
};
DummyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    DB_HOST: Joi.string().required(),
                    DB_USER: Joi.string().required(),
                    DB_PASSWORD: Joi.string().required(),
                    DB_NAME: Joi.string().required(),
                    DB_PORT: Joi.number().required(),
                }),
                envFilePath: './apps/dummy/.env',
            }),
        ],
        controllers: [dummy_controller_1.DummyController],
        providers: [dummy_service_1.DummyService, connection_service_1.ConnectionService],
    })
], DummyModule);
exports.DummyModule = DummyModule;


/***/ }),

/***/ "./apps/dummy/src/dummy.service.ts":
/*!*****************************************!*\
  !*** ./apps/dummy/src/dummy.service.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DummyService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const connection_service_1 = __webpack_require__(/*! ./connection/connection.service */ "./apps/dummy/src/connection/connection.service.ts");
const faker_1 = __webpack_require__(/*! ./util/faker */ "./apps/dummy/src/util/faker.ts");
let DummyService = class DummyService {
    constructor(connectionService) {
        this.connectionService = connectionService;
    }
    async createProducts() {
        const createQuery = `INSERT INTO products (productName, description, image, price) values (?)`;
        for (let i = 0; i <= 1000; i++) {
            let product = (0, faker_1.createRandomProduct)();
            await this.connectionService.Query(createQuery, [
                [
                    product.productName,
                    product.description,
                    product.image,
                    product.price,
                ],
            ]);
        }
    }
};
DummyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof connection_service_1.ConnectionService !== "undefined" && connection_service_1.ConnectionService) === "function" ? _a : Object])
], DummyService);
exports.DummyService = DummyService;


/***/ }),

/***/ "./apps/dummy/src/util/faker.ts":
/*!**************************************!*\
  !*** ./apps/dummy/src/util/faker.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRandomProduct = void 0;
const faker_1 = __webpack_require__(/*! @faker-js/faker */ "@faker-js/faker");
function createRandomProduct() {
    return {
        productName: faker_1.faker.commerce.product(),
        description: faker_1.faker.commerce.productDescription(),
        image: faker_1.faker.image.imageUrl(),
        price: Math.floor(Math.random() * 1000) + 10,
    };
}
exports.createRandomProduct = createRandomProduct;


/***/ }),

/***/ "@faker-js/faker":
/*!**********************************!*\
  !*** external "@faker-js/faker" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@faker-js/faker");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("joi");

/***/ }),

/***/ "mysql2/promise":
/*!*********************************!*\
  !*** external "mysql2/promise" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("mysql2/promise");

/***/ }),

/***/ "sql-template-strings":
/*!***************************************!*\
  !*** external "sql-template-strings" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("sql-template-strings");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./apps/dummy/src/main.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const dummy_module_1 = __webpack_require__(/*! ./dummy.module */ "./apps/dummy/src/dummy.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(dummy_module_1.DummyModule);
    await app.listen(3000);
}
bootstrap();

})();

/******/ })()
;