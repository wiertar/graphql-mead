import { GraphQLServer } from 'graphql-yoga';
import fs from 'fs';
import path from 'path';
import faker from 'faker';
import { printSchema } from 'graphql';

let users = [{
    id: '1',
    first_name: 'tom',
    email: 't@google.com'
}, {
    id: '2',
    first_name: 'bob',
    last_name: 'bob',
    email: 'bob@bob.com',
    age: '23'
}, {
    id: '3',
    first_name: 'A Name',
    email: 'Someone@gmail.com',
    age: '44'
}];

let posts = [
    {
        id: '1',
        title: 'A cool Book',
        body: 'Vivamus facilisis nisi nibh. Aenean sollicitudin elit sed lacinia cursus. Ut pellentesque, magna eu tempus venenatis, sapien felis fermentum felis, at auctor urna lacus eget tortor. Suspendisse imperdiet malesuada eros sit amet semper. Curabitur et molestie purus. Integer ut nisi vel ex aliquet gravida. Donec et turpis non felis viverra fringilla.',
        published: false,
        author: '1'
    },
    {
        id: '2',
        title: 'asdf',
        body: 'Sed dignissim, diam id fermentum tempus, odio neque feugiat ante, eget elementum neque ex at felis. Vivamus id urna ornare dui elementum euismod ac sed quam. Nam eleifend pellentesque pulvinar. Donec id ipsum et est sollicitudin luctus. Integer placerat rutrum felis, sit amet sodales massa malesuada id. Proin aliquet nunc at pharetra vulputate. Proin elementum auctor risus, eget dictum tellus tempor id. Nullam eleifend, est non dapibus viverra, eros magna sollicitudin velit, id porta mi erat et arcu. Aenean vel risus id nisi vulputate bibendum. Aliquam maximus lectus at justo venenatis gravida. Nam condimentum ex in ex ultrices tempus. Fusce ut aliquet nunc. Duis non consectetur libero.',
        published: true,
        author: '2'
    },
    {
        id: '3',
        title: "JoJo's Bizarre Adventure: Part 1--Phantom Blood, Vol. 1",
        body: `The legendary Shonen Jump series, now available in English for the first time, in a deluxe edition featuring color pages and newly drawn cover art! JoJo’s Bizarre Adventure is a groundbreaking manga famous for its outlandish characters, wild humor and frenetic battles. A multigenerational tale of the heroic Joestar family and their never-ending battle against evil!

        Young Jonathan Joestar’s life is forever changed when he meets his new adopted brother, Dio. For some reason, Dio has a smoldering grudge against him and derives pleasure from seeing him suffer. But every man has his limits, as Dio finds out. This is the beginning of a long and hateful relationship!`,
        published: true,
        author: '3'
    }
];

let comments = [
    {
        id: '1',
        text: 'This is my comment!',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Buff E100',
        author: '1',
        post: '2'
    },
    {
        id: '3',
        text: 'Go sit under a tree.',
        author: '2',
        post: '3'
    },
    {
        id: '4',
        text: "I don't like your attitued",
        author: '3',
        post: '3'
    }
];

const typeDefs: string = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateComment): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        first_name: String!
        last_name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateComment {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        first_name: String!
        last_name: String
        email: String!
        age: Int
        posts: [Post!]
        comments: [Comment!]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            } else {
                return users.filter(user => user.first_name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()));
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            } else {
                return posts.filter(post => {
                    const titleMatch = post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
                    const bodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
                    return titleMatch || bodyMatch;
                });
            }
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const isEmailTaken = users.some(user => user.email === args.data.email);

            if (isEmailTaken) throw new Error("Email is taken...");

            const newUser = {
                id: (users.length + 1).toString(),
                ...args.data
            }

            users.push(newUser);
            
            return newUser;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id);
            
            if (userIndex === -1) {
                throw new Error("User not found.");
            }

            const deletedUser = users[userIndex];

            users.splice(userIndex, 1);

            posts = posts.filter(post => {
                const match = post.author === args.id;
                
                if (match) {
                    comments = comments.filter(comment => comment.post !== post.id);
                }
                comments = comments.filter(comment => comment.author !== args.id)

                return !match;
            });

            return deletedUser;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author);
            
            if (!userExists) {
                throw new Error("User not found");
            }

            const post = {
                id: (Date.now() + Math.random()).toString(),
                ...args.data
            };

            posts.push(post);

            return post;
        },
        deletePost(parent, args, ctx, info) {
            let selectedPost = {};

            const postExists = posts.some(post => post.id === args.id);

            if (!postExists) {
                throw new Error("Post does not exist!");
            }

            const filteredPosts = posts.filter((post, index) => {
                const postToDelete = post.id !== args.id;
                if (postToDelete) {
                    return post;
                } 
                else {
                    selectedPost = posts[index];
                }
            });

            if (filteredPosts) {
                posts = filteredPosts;
            }

            const filteredComments = comments.filter(comment => comment.post !== args.id);

            if (filteredComments) {
                comments = filteredComments;
            }

            return selectedPost;
        },
        createComment(parent, args, ctx, info) {
            const postExists = posts.some(post => post.id === args.data.post && post.published);
            const userExists = users.some(user => user.id === args.data.author);

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

            comments.push(newComment);

            return newComment;
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment => comment.id === args.id);

            if (commentIndex === -1) {
                throw new Error("Comment not found.");
            }

            const deletedComment = comments.splice(commentIndex, 1);

            return deletedComment[0];
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => {
                return user.id === parent.author
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.post === parent.id
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.author === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => {
                return user.id === parent.author
            });
        },
        post(parent, args, ctx, info) {
            return posts.find(post => {
                return post.id === parent.post
            });
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('The server is up!'));