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
    createPost(parent, args, { db }, info) {
        const userExists = db.users.some(user => user.id === args.data.author);
        
        if (!userExists) {
            throw new Error("User not found");
        }

        const post = {
            id: (Date.now() + Math.random()).toString(),
            ...args.data
        };

        db.posts.push(post);

        return post;
    },
    deletePost(parent, args, { db }, info) {
        let selectedPost = {};

        const postExists = db.posts.some(post => post.id === args.id);

        if (!postExists) {
            throw new Error("Post does not exist!");
        }

        const filteredPosts = db.posts.filter((post, index) => {
            const postToDelete = post.id !== args.id;
            if (postToDelete) {
                return post;
            } 
            else {
                selectedPost = db.posts[index];
            }
        });

        if (filteredPosts) {
            db.posts = filteredPosts;
        }

        const filteredComments = db.comments.filter(comment => comment.post !== args.id);

        if (filteredComments) {
            db.comments = filteredComments;
        }

        return selectedPost;
    },
    createComment(parent, args, { db }, info) {
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

        return newComment;
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