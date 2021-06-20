import { GuildMember, Role } from "discord.js";

/** Makes sure member has a role that is on the same position or above the given role */
export function roleCheck(member: GuildMember, role: Role) {
    return member.roles.cache.find(r => r.position >= role.position) || false
}