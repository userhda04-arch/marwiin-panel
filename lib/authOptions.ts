import { NextAuthOptions } from 'next-auth'
import DiscordProvider from "next-auth/providers/discord";
import prisma from '@/lib/db'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        {
            id: "discord",
            name: "Discord",
            type: "oauth",
            authorization: {
                url: "https://discord.com/api/oauth2/authorize",
                params: { scope: 'identify guilds.members.read guilds.join' }
            },
            token: "https://discord.com/api/oauth2/token",
            userinfo: "https://discord.com/api/users/@me",
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            checks: ["none"],
            async profile(profile: any, tokens: any): Promise<any> {
                if (profile.avatar === null) {
                    const defaultAvatarNumber = parseInt(profile.discriminator) % 5
                    profile.image = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
                } else {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                    profile.image = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
                }

                if (tokens.access_token && process.env.DISCORD_SERVER_ID) {
                    try {
                        await fetch(
                            `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${profile.id}`,
                            {
                                method: 'PUT',
                                body: JSON.stringify({ access_token: tokens.access_token }),
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bot ${process.env.DISCORD_OAUTH_TOKEN}`,
                                },
                            }
                        )
                    } catch (error) {
                        console.log("Failed to add user to support server, error: ", error);
                    }

                    const ownedServers = await prisma.license.findMany({
                        where: { ownerId: profile.id },
                        select: { id: true, serverName: true, licenseKey: true }
                    })

                    if (ownedServers && ownedServers.length > 0) {
                        try {
                            await fetch(
                                `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${profile.id}/roles/733834739236077620`,
                                {
                                    method: 'PUT',
                                    body: JSON.stringify({ access_token: tokens.access_token }),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bot ${process.env.DISCORD_OAUTH_TOKEN}`,
                                    },
                                }
                            )
                        } catch (error) {
                            console.log("Failed to add customer role in discord server, error: ", error);
                        }
                    }
                }

                return {
                    id: profile.id,
                    username: profile.username,
                    image: profile.image,
                }
            },
        }
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
          if (url) return url;
          return baseUrl
        },
        async session({ session, token, user }) {
          session.user.id = token.sub as string;
          return {
            ...session,
            user: {
              ...session.user,
              username: token.username,
            }
          }
        },
        async jwt({ token, trigger, user, session }) {
          if (user) {
            token.username = user.username
            token.image = user.image
          }
          
          return token
        },
      },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};