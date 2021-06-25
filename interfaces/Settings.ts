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
    }
}

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
    }
}