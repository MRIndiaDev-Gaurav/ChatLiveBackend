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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Checking for existing admin user");
        const existingAdmin = yield prisma.user.findFirst({
            where: {
                role: "ADMIN",
            },
        });
        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }
        const saltPassword = 10;
        const defaultPassword = "Admin@123";
        const hashedPassword = yield bcrypt_1.default.hash(defaultPassword, saltPassword);
        //   create admin user
        const adminUser = yield prisma.user.create({
            data: {
                firstName: "Gaurav Rana",
                email: "gauravrana@gmail.com",
                password: hashedPassword,
                country: "India",
                role: "ADMIN",
                verified: true,
            },
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Seeding data...");
            yield seedData();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main();
