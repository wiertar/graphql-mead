import { GraphQLServer } from 'graphql-yoga';
import { typeDefs } from './schema';
import db from './db';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Comment from './resolvers/custom_types/Comment';
import Post from './resolvers/custom_types/Post';
import User from './resolvers/custom_types/User';

const server = new GraphQLServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Comment,
        Post,
        User
    },
    context: {
        db
    }
});

server.start(() => console.log('The server is up!'));