import { intArg, nullable, queryType, stringArg } from 'nexus'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })

    t.list.field('tweets', {
      type: 'Tweet',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.tweet.findMany({ orderBy: { createdAt: 'desc' } })
      },
    })
  },
})
