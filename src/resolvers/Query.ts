export default {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        } else {
            return db.users.filter(user => user.first_name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()));
        }
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        } else {
            return db.posts.filter(post => {
                const titleMatch = post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
                const bodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
                return titleMatch || bodyMatch;
            });
        }
    },
    comments(parent, args, { db }, info) {
        if (!args.query) {
            return db.comments;
        }
    }
};