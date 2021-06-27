import { config } from 'dotenv'; config()
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis';

export class RedCon {
    static connections: RedCon[] = []
    public client: WrappedNodeRedisClient

    constructor() {
        this.client = createNodeRedisClient(process.env.RURL)
        RedCon.connections.push(this)
    }

    /** Close connection */
    async close() {
        await this.client.quit()
        return this
    }

    /** Get a connection */
    static getConnection() {
        return RedCon.connections.find(c => c.client.nodeRedis.connected)
    }

    /** Close all connections */
    static async closeAll() {
        await Promise.all(RedCon.connections.map(c => c.close()))
    }
}