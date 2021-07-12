export type SettingsRole = 'admin' | 'moderator' | 'chatMod' | 'voiceMod' | 'banned' | 'muted'
export type SettingsChannel = 'general' | 'flood' | 'privateRoomCategory'
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
        privateRoomsCategory: string
    },
    togglables: {
        generalProtection: boolean
    }
}

export const nullSettings = (): Settings => {
    return {
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
            privateRoomsCategory: null
        },
        togglables: {
            generalProtection: undefined
        }
    }
}