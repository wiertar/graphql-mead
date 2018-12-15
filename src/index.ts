import { GraphQLServer, PubSub } from 'graphql-yoga';
import { typeDefs } from './schema';
import db from './db';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Comment from './resolvers/custom_types/Comment';
import Post from './resolvers/custom_types/Post';
import User from './resolvers/custom_types/User';
import Subscription from './resolvers/Subscription';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Comment,
        Post,
        User
    },
    context: {
        db,
        pubsub
    }
});

server.start(() => console.log('The server is up!'));