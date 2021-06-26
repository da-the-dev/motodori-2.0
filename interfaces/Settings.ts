export interface Settings {
    roles: {
        admin: string,
        moderator: string,
        chatMod: string,
        voiceMod: string,
    },
    channels: {
        general: string,
        flood: string,
        privateRooms: {
            category: string,
            creatorID: string
        }
    },
    togglables: {
        generalProtection: boolean
    }
}
export type SettingsRole = 'admin' | 'moderator' | 'chatMod' | 'voiceMod'
export const nullSettings: Settings = {
    roles: {
        admin: null,
        moderator: null,
        chatMod: null,
        voiceMod: null,
    },
    channels: {
        general: null,
        flood: null,
        privateRooms: {
            category: null,
            creatorID: null
        }
    },
    togglables: {
        generalProtection: undefined
    }
}