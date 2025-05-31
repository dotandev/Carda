import mongoose from 'mongoose';

interface DBType {
    [key: string]: any;
}

type DBConfig = {
    host: string;
    port: number | string;
    dbName: string;
    dbPass: string;
};

export class Database {
    private host: string;
    private port: number | string;
    private dbName: string;
    private dbPass: string;

    constructor(config?: DBConfig, uri?: string) {
        this.host = config?.host as string;
        this.port = config?.port as number | string;
        this.dbName = config?.dbName as string;
        this.dbPass = config?.dbPass as string;
        if (uri) {
            this.host = uri;
        }
    }

    public async connectPostgres() {
        console.log(`Connecting to PostgreSQL at ${this.host}:${this.port}/${this.dbName}`);
    }

    public async connectMongo(uri: string) {
        console.log(`Connecting to MongoDB at ${uri}`);
        try {
            await mongoose.connect(uri, {});
            console.log(`Connected to MongoDB at ${uri}`);
        } catch (error) {
            console.error(`Error connecting to MongoDB: ${error}`);
        }
    }
}