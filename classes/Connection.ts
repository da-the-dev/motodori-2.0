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
    async connect() {
        await this.mongoClient.connect()
    }
    /** Close connection */
    async close() {
        await this.mongoClient.close()
        return this
    }

    /** Gets data about a key from a guild */
    get(guildID: string, uniqueID: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!guildID) reject('No guild ID [get]!')
            if (!uniqueID) reject('No unique ID [get]!')

            var res: any = await this.mongoClient.db('motodori').collection(guildID).findOne({ id: uniqueID })

            res ? (
                res._id ? delete res._id : null,
                res.id ? delete res.id : null
            ) : res = {}

            resolve(res)
        })
    }
    /** Set data about a key from a guild */
    set(guildID: string, uniqueID: string, data: any): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (!guildID) reject('No guild ID [set]!')
            if (!uniqueID) reject('No unique ID [set]!')
            if (!data) reject('No data to set [set]!')

            await this.mongoClient.db('motodori').collection(guildID).findOneAndReplace({ id: uniqueID }, { ...{ id: uniqueID }, ...data }, { upsert: true })
            resolve('OK')
        })
    }

    /** Get a connection */
    static getConnection() {
        return Connection.connections.find(c => c.mongoClient.isConnected())
    }

    /** Close all connections */
    static async closeAll() {
        await Promise.all(Connection.connections.map(c => c.close()))
    }
}