export type SettingsRole = 'admin' | 'moderator' | 'chatMod' | 'voiceMod' | 'banned' | 'muted'
export type SettingsChannel = 'general' | 'flood'
export interface Settings {
    roles: {
        admin: string,
        moderator: string,
        chatMod: string,
        voiceMod: string,
        banned: string,
        muted: string
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

export const nullSettings: Settings = {
    roles: {
        admin: null,
        moderator: null,
        chatMod: null,
        voiceMod: null,
        banned: null,
        muted: null
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