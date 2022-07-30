"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genrateBlurhash = void 0;
var firebase_functions_1 = require("firebase-functions");
var admin = require("firebase-admin");
var path = require("path");
var os = require("os");
var fs = require("fs");
var blurhash_1 = require("blurhash");
var canvas_1 = require("canvas");
// Genrate blurhash from storageLocation
function genrateBlurhash(storageLocation) {
    return __awaiter(this, void 0, void 0, function () {
        var fileBucket, fileName, dir, bucket, tempFilePath, upRes, error_1, imageWidth, imageHeight, canvas, context, myImg, imageData, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!storageLocation) return [3 /*break*/, 8];
                    fileBucket = process.env.GCLOUD_PROJECT + '.appspot.com';
                    if (!fileBucket) return [3 /*break*/, 6];
                    firebase_functions_1.logger.info("Image storageLocation: ".concat(storageLocation));
                    firebase_functions_1.logger.info("File bucket: ".concat(fileBucket));
                    fileName = storageLocation.substring(storageLocation.lastIndexOf('/') + 1);
                    dir = storageLocation.replace('/' + fileName, '');
                    firebase_functions_1.logger.log(storageLocation, dir, fileName);
                    bucket = admin.storage().bucket();
                    tempFilePath = path.join(os.tmpdir(), fileName);
                    firebase_functions_1.logger.log('fileName', fileName);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    firebase_functions_1.logger.log('Downloading file to tmp disk', tempFilePath);
                    return [4 /*yield*/, bucket.file(storageLocation).download({ destination: tempFilePath })];
                case 2:
                    upRes = _a.sent();
                    firebase_functions_1.logger.info('UP_RES', JSON.stringify(upRes));
                    firebase_functions_1.logger.log('file has been downloaded to :', tempFilePath);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    firebase_functions_1.logger.log('err at download bucket', error_1);
                    return [3 /*break*/, 4];
                case 4:
                    imageWidth = 1000;
                    imageHeight = 1000;
                    canvas = new canvas_1.Canvas(imageWidth, imageHeight);
                    context = canvas.getContext('2d');
                    return [4 /*yield*/, (0, canvas_1.loadImage)(tempFilePath)];
                case 5:
                    myImg = _a.sent();
                    context.drawImage(myImg, 0, 0);
                    imageData = context.getImageData(0, 0, imageWidth, imageHeight);
                    hash = (0, blurhash_1.encode)(imageData.data, imageWidth, imageHeight, 5, 5);
                    fs.unlinkSync(tempFilePath);
                    return [2 /*return*/, hash];
                case 6: throw new Error('No bucket found');
                case 7: return [3 /*break*/, 9];
                case 8: throw new Error('StorageLocation not valid');
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.genrateBlurhash = genrateBlurhash;
