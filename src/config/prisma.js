import { PrismaClient } from "@prisma/client"

global.prisma = global.prisma || new PrismaClient()

export default global.prisma
