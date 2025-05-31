export const config = {
    auth: {
        secret: process.env.ACCESS_SECRET,
    },
    db: {
        mongo: {
            host: process.env.MONGO_HOST,
            port: process.env.MONGO_PORT,
            dbName: process.env.MONGO_DBNAME,
            dbPass: process.env.MONGO_PASSWORD,
        },
        postgres: {}
    }
}