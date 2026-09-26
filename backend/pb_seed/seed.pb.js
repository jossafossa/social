/// <reference path="../pb_data/types.d.ts" />

// Local stress-test data. Lives outside pb_hooks, so `serve` never loads it and it never ships in
// the Docker image. Run from backend/:
//
//   ./pocketbase seed --hooksDir=pb_seed          # add the data (scale 1)
//   ./pocketbase seed 3 --hooksDir=pb_seed        # three times as much
//   ./pocketbase seed clean --hooksDir=pb_seed    # remove it again
//
// Every seeded record's id starts with "seed", so clean can find it all again, including the likes,
// comments and memberships it gave your own accounts. Rows go in as raw SQL: that is fast and lets
// posts get past `created` dates. Record hooks don't fire, so the post counters are recounted at the end.

$app.rootCmd.addCommand(
  new Command({
    use: "seed [scale|clean]",
    short: "Fill the local database with stress-test data",
    run: (_cmd, args) => {
      const seedIds = {
        users: "users.id LIKE 'seed%'",
        posts: "posts.id LIKE 'seed%' OR posts.author LIKE 'seed%' OR posts.`group` LIKE 'seed%'",
      }

      const recountPosts = (db) =>
        db
          .newQuery(
            "UPDATE posts SET " +
              "likes = (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id), " +
              "comments = (SELECT COUNT(*) FROM comments WHERE comments.post = posts.id)",
          )
          .execute()

      const clean = () => {
        $app.runInTransaction((txApp) => {
          const db = txApp.db()
          const run = (sql) => db.newQuery(sql).execute()
          const seededPosts = `SELECT id FROM posts WHERE ${seedIds.posts}`
          run(`DELETE FROM likes WHERE id LIKE 'seed%' OR user LIKE 'seed%' OR post IN (${seededPosts})`)
          run(`DELETE FROM comments WHERE id LIKE 'seed%' OR author LIKE 'seed%' OR post IN (${seededPosts})`)
          run(`DELETE FROM posts WHERE ${seedIds.posts}`)
          run("DELETE FROM memberships WHERE id LIKE 'seed%' OR user LIKE 'seed%' OR `group` LIKE 'seed%'")
          run("DELETE FROM groups WHERE id LIKE 'seed%'")
          run(`DELETE FROM users WHERE ${seedIds.users}`)
          // Your own accounts were given seeded friends.
          run(
            "UPDATE users SET friends = (SELECT json_group_array(value) FROM json_each(users.friends) " +
              "WHERE value NOT LIKE 'seed%') WHERE friends LIKE '%\"seed%'",
          )
          recountPosts(db)
        })
        console.log("seed data removed")
      }

      if (args[0] === "clean") {
        clean()
        return
      }

      const scale = args[0] === undefined ? 1 : Number(args[0])
      if (!(scale > 0)) {
        throw new Error(`scale must be a positive number, got "${args[0]}"`)
      }

      const existing = new DynamicModel({ count: 0 })
      $app.db().newQuery(`SELECT COUNT(*) AS count FROM users WHERE ${seedIds.users}`).one(existing)
      if (existing.count > 0) {
        throw new Error("seed data already exists: run `seed clean` first")
      }

      const counts = {
        users: Math.round(300 * scale),
        groups: Math.round(60 * scale),
        posts: Math.round(6000 * scale),
        likes: Math.round(30000 * scale),
        comments: Math.round(12000 * scale),
      }

      // ---- random helpers ----
      const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
      const newId = () => "seed" + $security.randomStringWithAlphabet(11, alphabet)
      const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
      const pick = (items) => items[Math.floor(Math.random() * items.length)]
      // Leans towards the start of the list: a few items get most of the attention, like real feeds.
      const pickSkewed = (items) => items[Math.floor(items.length * Math.random() ** 2.5)]
      const sample = (items, size) => {
        const copy = items.slice()
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[copy[i], copy[j]] = [copy[j], copy[i]]
        }
        return copy.slice(0, size)
      }
      const now = Date.now()
      const day = 24 * 60 * 60 * 1000
      const toTimestamp = (ms) => new Date(ms).toISOString().replace("T", " ")
      // Anywhere in the last two years, a little denser towards today.
      const randomPastMs = () => now - Math.floor(730 * day * Math.random() ** 1.3)

      // ---- text ----
      const firstNames = ["alice", "bob", "carol", "dave", "eve", "frank", "grace", "heidi", "ivan", "judy",
        "mallory", "niaj", "olivia", "peggy", "rupert", "sybil", "trent", "victor", "walter", "zoë",
        "Anneke", "Bram", "Daan", "Fleur", "Joost", "Lotte", "Maarten", "Noor", "Sanne", "Thijs"]
      const lastNames = ["", "", "de Vries", "Jansen", "Bakker", "Visser", "Smit", "Meijer", "Mulder",
        "van den Berg", "Dekker", "O'Neill", "Nakamura", "García", "Øster", "Kowalski"]
      const words = ("the a pocketbase react query cache feed post group friend terminal zine monospace " +
        "keyboard shortcut focus outline dotted border shadow paper ink accent tab arrow load more " +
        "page list grid card search coffee deploy bug fix ship weekend rain bike train canal cheese " +
        "stroopwafel tulip windmill sqlite migration hook counter like comment reply edit cancel " +
        "is was will not really very quite just still again today tomorrow yesterday because and " +
        "but so then maybe definitely honestly apparently finally").split(" ")
      const emoji = ["🚲", "☕", "🧀", "🌷", "🔥", "✅", "🐛", "🚀", "💾", "⌨️"]
      const groupTopics = ["birds", "cats", "dogs", "bikes", "coffee", "keyboards", "typescript", "react",
        "sqlite", "gardening", "climbing", "board-games", "film", "vinyl", "sourdough", "running",
        "photography", "retro-computing", "chess", "knitting"]

      const sentence = (length) => {
        const text = Array.from({ length }, () => pick(words)).join(" ")
        return text.charAt(0).toUpperCase() + text.slice(1) + pick([".", ".", ".", "!", "?", "…"])
      }
      const paragraph = (sentences) =>
        Array.from({ length: sentences }, () => sentence(randomInt(4, 16))).join(" ")

      // Mostly short posts, some long ones, and a few that try to break the layout.
      const postContent = () => {
        const roll = Math.random()
        let text
        if (roll < 0.6) {
          text = sentence(randomInt(3, 20))
        } else if (roll < 0.9) {
          text = paragraph(randomInt(2, 5))
        } else if (roll < 0.97) {
          text = [paragraph(randomInt(3, 6)), paragraph(randomInt(3, 6)), paragraph(randomInt(2, 4))].join("\n\n")
        } else {
          text = pick([
            "a".repeat(randomInt(150, 400)),
            "https://example.com/" + "very-long-path-segment/".repeat(12) + "?q=" + "x".repeat(40),
            Array.from({ length: 40 }, () => pick(emoji)).join(""),
            "line\n".repeat(30).trim(),
          ])
        }
        if (Math.random() < 0.15) {
          text += " " + pick(emoji)
        }
        return text.slice(0, 1000)
      }
      const commentContent = () =>
        Math.random() < 0.85 ? sentence(randomInt(1, 18)) : paragraph(randomInt(2, 4)).slice(0, 1000)

      const userName = (index) => {
        if (index % 40 === 0) {
          return "Bartholomeus Alexander van der Heijden-Oosterhuis de Jonge the " + index
        }
        return `${pick(firstNames)} ${pick(lastNames)}`.trim() + (Math.random() < 0.3 ? ` ${index}` : "")
      }
      const groupName = (index) => {
        if (index % 25 === 0) {
          return `an-unreasonably-long-group-name-for-${pick(groupTopics)}-${index}`.slice(0, 100)
        }
        return `${pick(groupTopics)}${index < groupTopics.length ? "" : `-${index}`}`
      }

      // ---- write ----
      $app.runInTransaction((txApp) => {
        const db = txApp.db()
        const insert = (table, row) => {
          const columns = Object.keys(row)
          db.newQuery(
            `INSERT INTO ${table} (${columns.map((column) => `\`${column}\``).join(", ")}) ` +
              `VALUES (${columns.map((column) => `{:${column}}`).join(", ")})`,
          )
            .bind(row)
            .execute()
        }

        // Real accounts (yours) join in, so the seeded data shows up in their feeds and lists.
        const realUsers = arrayOf(new DynamicModel({ id: "", friends: [] }))
        db.newQuery("SELECT id, friends FROM users WHERE id NOT LIKE 'seed%'").all(realUsers)

        // bcrypt is slow on purpose, so hash the shared password once and reuse it.
        const usersCollection = txApp.findCollectionByNameOrId("users")
        const template = new Record(usersCollection)
        template.setPassword("password123")
        const passwordHash = template.getRaw("password").hash

        const userIds = []
        for (let i = 1; i <= counts.users; i++) {
          userIds.push(newId())
        }
        userIds.forEach((id, index) => {
          const created = toTimestamp(randomPastMs())
          insert("users", {
            id,
            email: `user${index + 1}@seed.test`,
            emailVisibility: false,
            verified: true,
            password: passwordHash,
            tokenKey: $security.randomString(50),
            name: userName(index + 1),
            avatar: "",
            bio: Math.random() < 0.6 ? paragraph(randomInt(1, 3)).slice(0, 500) : "",
            friends: JSON.stringify(sample(userIds.filter((other) => other !== id), randomInt(0, 40))),
            created,
            updated: created,
          })
        })

        const groupIds = []
        for (let i = 1; i <= counts.groups; i++) {
          const id = newId()
          groupIds.push(id)
          insert("groups", { id, name: groupName(i), image: "" })
        }

        const members = {}
        const addMember = (user, group) => {
          members[group] = members[group] || new Set()
          if (members[group].has(user)) {
            return
          }
          members[group].add(user)
          insert("memberships", { id: newId(), user, group })
        }
        for (const user of userIds) {
          for (const group of sample(groupIds, randomInt(0, 10))) {
            addMember(user, group)
          }
        }
        for (const realUser of realUsers) {
          for (const group of sample(groupIds, 12)) {
            addMember(realUser.id, group)
          }
          const friends = realUser.friends.concat(sample(userIds, 40))
          db.newQuery("UPDATE users SET friends = {:friends} WHERE id = {:id}")
            .bind({ id: realUser.id, friends: JSON.stringify(friends) })
            .execute()
        }

        const posts = []
        for (let i = 0; i < counts.posts; i++) {
          const author = pickSkewed(userIds)
          // A third of posts go to a group the author is in.
          const authorGroups = groupIds.filter((group) => members[group] && members[group].has(author))
          const group = authorGroups.length > 0 && Math.random() < 0.33 ? pick(authorGroups) : ""
          const createdMs = randomPastMs()
          const id = newId()
          posts.push({ id, createdMs })
          insert("posts", {
            id,
            author,
            content: postContent(),
            group,
            likes: 0,
            comments: 0,
            created: toTimestamp(createdMs),
          })
        }

        // Your own posts get likes and comments too.
        const realPosts = arrayOf(new DynamicModel({ id: "", created: "" }))
        db.newQuery("SELECT id, created FROM posts WHERE id NOT LIKE 'seed%'").all(realPosts)
        for (const post of realPosts) {
          posts.push({ id: post.id, createdMs: Date.parse(post.created.replace(" ", "T")) })
        }
        // Popularity is random, not tied to age: an old post can top "likes" and a new one can have
        // none, so sorting by likes, comments or date gives visibly different feeds.
        // Separate orders for likes and comments, so those two sorts differ as well.
        const byLikes = sample(posts, posts.length)
        const byComments = sample(posts, posts.length)

        const likers = userIds.concat(realUsers.map((user) => user.id))
        const existingLikes = arrayOf(new DynamicModel({ post: "", user: "" }))
        db.newQuery("SELECT post, user FROM likes").all(existingLikes)
        const liked = new Set(existingLikes.map(({ post, user }) => post + user))
        for (let i = 0; i < counts.likes; i++) {
          const post = pickSkewed(byLikes).id
          const user = pick(likers)
          if (liked.has(post + user)) {
            continue
          }
          liked.add(post + user)
          insert("likes", { id: newId(), post, user })
        }

        for (let i = 0; i < counts.comments; i++) {
          const post = pickSkewed(byComments)
          const createdMs = Math.min(now, post.createdMs + Math.floor(3 * day * Math.random() ** 3))
          insert("comments", {
            id: newId(),
            post: post.id,
            author: pick(userIds),
            content: commentContent(),
            created: toTimestamp(createdMs),
          })
        }

        recountPosts(db)
      })

      console.log(
        `seeded ${counts.users} users, ${counts.groups} groups, ${counts.posts} posts, ` +
          `~${counts.likes} likes, ${counts.comments} comments. Seeded users log in as ` +
          "user1@seed.test … with password123.",
      )
    },
  }),
)
