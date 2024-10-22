const testDbConnection = (db) => {
    // Describing table named 'users' on our local dev server
    db.select('*').from('pg_stat_activity')
    .then((dbConnection) => {
        // const databaseName = dbConnection.filter(item => item.datname === 'smart-brain');
        // console.log(`\nConnected Database Information:\n`, databaseName, `\n`);
    })
    .catch(err => {
        console.log(`\nError verifying PostgreSQL connection:\n${err}\n`);
    });

    // Logging whether connection to PostgreSQL on Render.com is successful
    db.raw("SELECT 1")
    .then(() => {
        console.log(`\nPostgreSQL connected!!\n`);
    })
    .catch(err => {
        console.log(`\nPostgreSQL not connected\nErrors: ${err}\n`);
    });
}

module.exports = { testDbConnection };