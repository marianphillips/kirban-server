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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("@prisma/client"));
const email_validator_1 = __importDefault(require("email-validator"));
const dbClient = new client_1.default.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    const passwordHash = yield bcrypt_1.default.hash(req.body.password, 8);
    try {
        const existingUser = yield dbClient.user.findUnique({
            where: {
                email: req.body.email
            },
        });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail, email already in use',
            });
        }
        if (!email_validator_1.default.validate(req.body.email)) {
            return res.status(400).json({
                status: 'fail, invalid email address',
            });
        }
        const createdUser = yield dbClient.user.create({
            data: {
                email: req.body.email,
                password: passwordHash,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }
        });
        return res.status(200).json({
            status: 'success',
            data: createdUser
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail, server error',
        });
    }
});
exports.createUser = createUser;
