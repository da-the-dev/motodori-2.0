export type SettingsRole = 'admin' | 'moderator' | 'chatMod' | 'voiceMod' | 'banned' | 'muted'
export type SettingsChannel = 'general' | 'flood' | 'privateRoomsCategory' | 'privateRoomsCreator'
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
        privateRoomsCategory: string,
        privateRoomsCreator: string,
    },
    togglables: {
        generalProtection: boolean,
        privateRooms: boolean
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
            privateRoomsCategory: null,
            privateRoomsCreator: null,
        },
        togglables: {
            generalProtection: undefined,
            privateRooms: undefined
        }
    }
}