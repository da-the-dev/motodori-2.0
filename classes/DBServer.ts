import { Server, nullSettings } from '../headers/interfaces'
import { Connection } from './Connection'
import { mergeWith } from 'lodash'

export class DBServer {
    private connection: Connection
    public data = ({} as any) as Server
    private guildID: string
    private id: string

    constructor(guildID: string) {
        this.connection = Connection.getConnection()
        this.guildID = guildID
    }

    /** Fetch servers's data from DB */
    async fetch(): Promise<DBServer> {
        const serverData = await this.connection.get(this.guildID, 'serverSettings')

        this.data.id = this.id
        this.data.flags = serverData.flags || []
        this.data.def = serverData.def
        this.data.roles = serverData.roles || []
        this.data.customRoles = serverData.customRoles || []
        this.data.personalRooms = serverData.personalRooms || []
        this.data.settings = mergeWith(serverData.settings, nullSettings(), (objValue, srcValue) => {
            if (srcValue === null) return objValue
        })

        return this
    }

    /** Get the optimized version of the servers's data */
    private get(): Record<string, any> {
        const serverData: Record<string, any> = {}

        this.data.flags && this.data.flags.length > 0 ? serverData.flags = this.data.flags : null
        this.data.def ? serverData.def = this.data.def : null
        this.data.roles && this.data.roles.length > 0 ? serverData.roles = this.data.roles : null
        this.data.customRoles && this.data.customRoles.length > 0 ? serverData.customRoles = this.data.customRoles : null
        this.data.personalRooms && this.data.personalRooms.length > 0 ? serverData.personalRooms = this.data.personalRooms : null
        this.data.settings ? serverData.settings = removeNullFields(this.data.settings) : null

        return serverData
    }

    async save(): Promise<'OK'> {
        return await this.connection.set(this.guildID, 'serverSettings', this.get())
    }
}

function removeNullFields(obj: any) {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v === Object(v) ? removeNullFields(v) : v])
    )
}