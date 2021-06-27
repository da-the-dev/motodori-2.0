import { config } from 'dotenv'; config()
import { MongoClient } from 'mongodb'

export class Connection {
    static connections: Connection[] = []
    private mongoClient: MongoClient

    constructor() {
        this.mongoClient = new MongoClient(process.env.MURL, { useNewUrlParser: true, useUnifiedTopology: true })
        Connection.connections.push(this)
    }

    /** Establish a connection */
    async connect(): Promise<void> {
        await this.mongoClient.connect()
    }
    /** Close connection */
    async close(): Promise<Connection> {
        await this.mongoClient.close()
        return this
    }

    /** Gets data about a key from a guild */
    async get(guildID: string, uniqueID: string): Promise<any> {
        if (!guildID) throw 'No guild ID [get]!'
        if (!uniqueID) throw 'No unique ID [get]!'

        let res: any = await this.mongoClient.db('motodori').collection(guildID).findOne({ id: uniqueID })
        res ? (
            res._id ? delete res._id : null,
            res.id ? delete res.id : null
        ) : res = {}

        return res
    }
    /** Set data about a key from a guild */
    async set(guildID: string, uniqueID: string, data: Record<string, any>): Promise<'OK'> {
        if (!guildID) throw 'No guild ID [set]!'
        if (!uniqueID) throw 'No unique ID [set]!'
        if (!data) throw 'No data to set [set]!'

        await this.mongoClient.db('motodori').collection(guildID).findOneAndReplace({ id: uniqueID }, { ...{ id: uniqueID }, ...data }, { upsert: true })
        return 'OK'
    }

    /** Get a connection */
    static getConnection(): Connection {
        return Connection.connections.find(c => c.mongoClient.isConnected())
    }

    /** Close all connections */
    static async closeAll(): Promise<void> {
        await Promise.all(Connection.connections.map(c => c.close()))
    }
}