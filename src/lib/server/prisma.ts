import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Ensure .env is loaded (for dev without Vite)
import 'dotenv/config';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | undefined;

function createPrismaClient(): PrismaClient | undefined {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		console.warn('DATABASE_URL not set - database features will be disabled');
		return undefined;
	}

	try {
		const pool = new Pool({ connectionString });
		const adapter = new PrismaPg(pool);

		return new PrismaClient({
			adapter,
			log: ['error']
		});
	} catch (error) {
		console.error('Failed to create Prisma client:', error);
		return undefined;
	}
}

// Create client at module load time if possible
prismaInstance = createPrismaClient();

export const prisma: PrismaClient | undefined = prismaInstance ?? undefined;

export function getPrisma(): PrismaClient {
	if (!prismaInstance) {
		prismaInstance = createPrismaClient();
	}

	if (!prismaInstance) {
		throw new Error('Database not available. Please set DATABASE_URL environment variable.');
	}

	return prismaInstance;
}
