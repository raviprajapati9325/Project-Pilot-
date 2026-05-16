/*const { Sequelize } = require('sequelize');
const config = require('./index');

const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL || process.env.POSTGRES_URL || config.databaseUrl;

console.log('[DB] Connecting with:', dbUrl ? `${dbUrl.substring(0, 15)}...` : 'individual vars');
console.log('[DB] Available DB vars:', Object.keys(process.env).filter(k => k.includes('PG') || k.includes('POSTGRES') || k.includes('DATABASE')).join(', ') || 'none');

let sequelize;

if (dbUrl && (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))) {
  try {
    const url = new URL(dbUrl);
    sequelize = new Sequelize(url.pathname.slice(1), url.username, decodeURIComponent(url.password), {
      host: url.hostname,
      port: url.port || 5432,
      dialect: 'postgres',
      logging: config.nodeEnv === 'development' ? console.log : false,
      dialectOptions: {
        ssl: config.nodeEnv === 'production' ? { require: true, rejectUnauthorized: false } : false
      },
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    });
  } catch (e) {
    console.error('[DB] Failed to parse DATABASE_URL:', e.message);
    console.error('[DB] Raw value starts with:', dbUrl.substring(0, 20));
    process.exit(1);
  }
} else {
  const pgHost = process.env.PGHOST || process.env.POSTGRES_HOST || 'localhost';
  const pgPort = process.env.PGPORT || process.env.POSTGRES_PORT || 5432;
  const pgUser = process.env.PGUSER || process.env.POSTGRES_USER || 'postgres';
  const pgPass = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || '';
  const pgDb = process.env.PGDATABASE || process.env.POSTGRES_DB || 'railway';

  console.log(`[DB] Using individual vars: ${pgUser}@${pgHost}:${pgPort}/${pgDb}`);

  sequelize = new Sequelize(pgDb, pgUser, pgPass, {
    host: pgHost,
    port: pgPort,
    dialect: 'postgres',
    logging: config.nodeEnv === 'development' ? console.log : false,
    dialectOptions: {
      ssl: config.nodeEnv === 'production' ? { require: true, rejectUnauthorized: false } : false
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  });
}

module.exports = sequelize;
*/


const { Sequelize } = require('sequelize');
const config = require('./index');

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  process.env.POSTGRES_URL;

console.log(
  '[DB] Available DB vars:',
  Object.keys(process.env)
    .filter((k) => k.includes('PG') || k.includes('POSTGRES') || k.includes('DATABASE'))
    .join(', ') || 'none'
);

if (config.nodeEnv === 'production') {
  if (!dbUrl) {
    console.error('[DB] FATAL: No DATABASE_URL found in production.');
    console.error('[DB] Add DATABASE_URL=${{PostgreSQL.DATABASE_URL}} in Railway backend Variables.');
    process.exit(1);
  }

  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('[DB] FATAL: DATABASE_URL is invalid.');
    console.error('[DB] It starts with:', dbUrl.substring(0, 60));
    console.error('[DB] It must start with postgresql:// or postgres://');
    process.exit(1);
  }
}

let sequelize;

if (dbUrl && (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))) {
  console.log('[DB] Connecting with DATABASE_URL:', `${dbUrl.substring(0, 15)}...`);

  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: config.nodeEnv === 'development' ? console.log : false,
    dialectOptions: {
      ssl:
        config.nodeEnv === 'production'
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  console.log('[DB] Local development mode');

  sequelize = new Sequelize(
    process.env.PGDATABASE || 'team_task_manager',
    process.env.PGUSER || 'postgres',
    process.env.PGPASSWORD || '',
    {
      host: process.env.PGHOST || '127.0.0.1',
      port: process.env.PGPORT || 5432,
      dialect: 'postgres',
      logging: config.nodeEnv === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;