const fs = require('fs');
const path = require('path');
const { Report, initDB, mongoose } = require('./src/models/Report');

const migrate = async () => {
  await initDB();
  const jsonPath = path.join(__dirname, 'reports.json');
  
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Found ${data.length} reports to migrate...`);
    
    for (const report of data) {
      try {
        const exists = await Report.findOne({ id: report.id });
        if (!exists) {
          await Report.create(report);
          console.log(`Migrated report ${report.id}`);
        } else {
          console.log(`Report ${report.id} already exists, skipping.`);
        }
      } catch (err) {
        console.error(`Failed to migrate report ${report.id}:`, err.message);
      }
    }
    console.log('Migration complete!');
  } else {
    console.log('No reports.json found to migrate.');
  }
  
  if (mongoose && mongoose.connection) {
    await mongoose.connection.close();
  }
  process.exit(0);
};

migrate();
