/** User data interface */
export declare interface User {
    id?: string,
    money?: number,
    msgs?: number,
    voiceTime?: number,
    inv?: ShopRole[],
    customInv?: CustomRole[],
    warns?: Warn[],
    ban?: boolean,
    toxic?: boolean,
    mute?: boolean,
    pics?: boolean,
    uact?: boolean,
    disGameRole?: boolean,
    status?: string,
    streak?: number,
    rewardTimestamp?: number,
    invites?: number,
    discount?: number
}

/** Custom role interface */
export declare interface CustomRole {
    id: string,
    owner: string,
    createdTimestamp: number,
    expireTimestamp: number,
    members: number
    maxHolders: number
}

/** Love room data interface */
export declare interface LoveRoom {
    id: string,
    partner: string,
    creationDate: number
    bal: number
}

/** Custom role data inteface */
export declare interface CustomRole {
    id: string,
    name: string,
    creator: string,
    createdTimestamp: number,
    aprover: string,
    activity: number
}

/** Shop role data interface */
export declare interface ShopRole {
    id: string,
    price: number
}

/** Warn data interface */
export declare interface Warn {
    reason: string,
    who: string,
    time: number
}