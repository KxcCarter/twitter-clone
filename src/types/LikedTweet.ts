import { objectType } from 'nexus'

export const LikedTweet = objectType({
  name: 'LikedTweet',
  definition(t) {
    t.model.id()
    t.model.tweet()
    t.model.likedAt()
  },
})
