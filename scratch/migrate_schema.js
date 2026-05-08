const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Update provider
schema = schema.replace('provider = "mysql"', 'provider = "postgresql"');

// Add directUrl
schema = schema.replace('url      = env("DATABASE_URL")', 'url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")');

// Remove @db.VarChar(...)
schema = schema.replace(/@db\.VarChar\(\d+\)/g, '');

// Remove @db.DateTime(...)
schema = schema.replace(/@db\.DateTime\(\d+\)/g, '');

// Remove @db.Timestamp(...)
schema = schema.replace(/@db\.Timestamp\(\d+\)/g, '');

// Remove @db.Float
schema = schema.replace(/@db\.Float/g, '');

// Remove @db.Date
schema = schema.replace(/@db\.Date/g, '');

// Remove @db.Text
schema = schema.replace(/@db\.Text/g, '');

// Remove map: "..."
schema = schema.replace(/, map: "[^"]+"/g, '');
schema = schema.replace(/map: "[^"]+"/g, '');

// Clean up extra spaces
schema = schema.replace(/  +/g, ' ');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated to PostgreSQL format');
