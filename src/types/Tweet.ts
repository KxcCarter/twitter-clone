import { objectType } from 'nexus'

export const Tweet = objectType({
  name: 'Tweet',
  definition(t) {
    t.model.id()
    t.model.content()
    t.model.author()
  },
})
