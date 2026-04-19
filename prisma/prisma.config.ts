import { defineConfig } from '@prisma/client/config';
import 'dotenv/config';

export default defineConfig({
	datasources: {
		db: {
			url: "postgresql://neondb_owner:npg_2zGwXZqIWYg4@ep-sparkling-unit-amzt1sdc-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=verify-full"
		}
	}
});
