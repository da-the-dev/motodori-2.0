import { config } from 'dotenv'; config()
import { MongoClient } from 'mongodb'
import { User } from '../interfaces/DBInterfaces'

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

export class DBUser {
    private connection: Connection
    public data: User = {}
    private guildID: string
    private id: string

    constructor(guildID, id) {
        this.connection = Connection.getConnection()
        this.guildID = guildID
        this.id = id
    }

    /** Fetch user's data from DB */
    async fetch() {
        const userData = await this.connection.get(this.guildID, this.id)

        this.data.id = this.id
        this.data.money = userData.money || 0
        this.data.msgs = userData.msgs || 0
        this.data.voiceTime = userData.voiceTime || 0
        this.data.inv = userData.inv || []
        this.data.customInv = userData.customInv || []
        this.data.warns = userData.warns || []
        this.data.ban = userData.ban
        this.data.toxic = userData.toxic
        this.data.mute = userData.mute
        this.data.pics = userData.pics
        this.data.status = userData.status
        this.data.disGameRole = userData.disGameRole || false
        this.data.uact = userData.uact || false
        // this.data.loveroom = userData.loveroom
        this.data.rewardTimestamp = userData.rewardTimestamp
        this.data.streak = userData.streak
        this.data.invites = userData.invites || 0
        this.data.discount = userData.discount || 0
        return this
    }

    /** Get the optimized version of the user's data */
    get() {
        var userData: any = {}

        if (this.data.money && this.data.money > 0) userData.money = this.data.money
        if (this.data.msgs && this.data.msgs > 0) userData.msgs = this.data.msgs
        if (this.data.voiceTime && this.data.voiceTime > 0) userData.voiceTime = this.data.voiceTime
        if (this.data.inv && this.data.inv.length > 0) userData.inv = this.data.inv
        if (this.data.customInv && this.data.customInv.length > 0) userData.customInv = this.data.customInv
        if (this.data.warns && this.data.warns.length > 0) userData.warns = this.data.warns

        this.data.ban ? userData.ban = this.data.ban : null
        this.data.toxic ? userData.toxic = this.data.toxic : null
        this.data.mute ? userData.mute = this.data.mute : null
        this.data.pics ? userData.pics = this.data.pics : null
        this.data.status ? userData.status = this.data.status : null
        this.data.disGameRole ? userData.disGameRole = this.data.disGameRole : null
        this.data.uact ? userData.uact = this.data.uact : null
        // this.data.loveroom ? userData.loveroom = this.data.loveroom : null
        this.data.rewardTimestamp ? userData.rewardTimestamp = this.data.rewardTimestamp : null
        this.data.streak ? userData.streak = this.data.streak : null
        this.data.invites ? userData.invites = this.data.invites : null
        this.data.discount ? userData.discount = this.data.discount : null

        return userData
    }

    async save() {
        await this.connection.set(this.guildID, this.id, this.get())
    }
}
