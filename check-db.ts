import sequelize from './src/config/database';
import User from './src/models/User';
import Pet from './src/models/Pet';
import AdoptionRequest from './src/models/AdoptionRequest';

async function check() {
    console.log('Registered Models:', Object.keys(sequelize.models));
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log('Existing Tables:', tables);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

check();
