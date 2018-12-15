export default {
    createUser(parent, args, { db }, info) {
        const isEmailTaken = db.users.some(user => user.email === args.data.email);

        if (isEmailTaken) throw new Error("Email is taken...");

        const newUser = {
            id: (db.users.length + 1).toString(),
            ...args.data
        }

        db.users.push(newUser);
        
        return newUser;
    },
    updateUser(parent, args, { db }, info) {
        const user = db.users.find(user => user.id === args.id);

        if (!user) {
            throw new Error("User not found.");
        }

        if (typeof args.data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === args.data.email);

            if (emailTaken) {
                throw new Error("Email in use.");
            }

            user.email = args.data.email;
        }

        if (typeof args.data.first_name === 'string') {
            user.first_name = args.data.first_name;
        }

        if (typeof args.data.last_name === 'string') {
            user.last_name = args.data.last_name;
        }

        if (typeof args.data.age !== 'undefined') {
            user.age = args.data.age;
        }

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id);
        
        if (userIndex === -1) {
            throw new Error("User not found.");
        }

        const deletedUser = db.users[userIndex];

        db.users.splice(userIndex, 1);

        db.posts = db.posts.filter(post => {
            const match = post.author === args.id;
            
            if (match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id);
            }
            db.comments = db.comments.filter(comment => comment.author !== args.id)

            return !match;
        });

        return deletedUser;
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some(user => user.id === args.data.author);
        
        if (!userExists) {
            throw new Error("User not found");
        }

        const post = {
            id: db.posts.length + 1,
            ...args.data
        };

        db.posts.push(post);

        if (args.data.published) {
            pubsub.publish(`post`, {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }

        return post;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const post = db.posts.find(post => post.id === args.id);
        let hasChanged = false;

        if (!post) {
            throw new Error("Post not found.");
            hasChanged = true;
        }

        if (typeof args.data.title === 'string') {
            post.title = args.data.title;
            hasChanged = true;
        }
        
        if (typeof args.data.body === 'string') {
            post.body = args.data.body;
            hasChanged = true;
        }

        if (typeof args.data.published === 'boolean') {
            post.published = args.data.published;
            hasChanged = true;
        }

        if (hasChanged && post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }

        return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const selectedPostIndex = db.posts.findIndex(post => post.id === args.id);

        if (selectedPostIndex === -1) {
            throw new Error('Post not found.');
        }

        const selectedPost = db.posts[selectedPostIndex];

        const filteredComments = db.comments.filter(comment => comment.post !== args.id);

        db.comments = filteredComments;

        db.posts.splice(selectedPostIndex, 1);

        if (selectedPost.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: selectedPost
                }
            });
        }

        return selectedPost;
    },
    createComment(parent, args, { db, pubsub }, info) {
        const postExists = db.posts.some(post => post.id === args.data.post && post.published);
        const userExists = db.users.some(user => user.id === args.data.author);

        if (!postExists) {
            throw new Error("The post doesn't exists.");
        }

        if (!userExists) {
            throw new Error("User not found");
        }

        const newComment = {
            id: (Date.now() + Math.random()).toString(),
            ...args.data
        };

        db.comments.push(newComment);

        pubsub.publish(`comment ${args.data.post}`, {
            comment: newComment
        });

        return newComment;
    },
    updateComment(parent, args, { db }, info) {
        const comment = db.comments.find(comment => comment.id === args.id);

        if (!comment) {
            throw new Error("Comment not found.");
        }

        if (typeof args.data.text === 'string') {
            comment.text = args.data.text;
        }

        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error("Comment not found.");
        }

        const deletedComment = db.comments.splice(commentIndex, 1);

        return deletedComment[0];
    }
};