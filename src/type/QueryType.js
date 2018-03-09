// @flow

import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { globalIdField, connectionArgs, fromGlobalId } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';

import UserType from './UserType';
import StudentType from './StudentType';
import { NodeField } from '../interface/NodeInterface';
import { UserLoader } from '../loader';
import UserConnection from '../connection/UserConnection';
import { Student } from '../model';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: NodeField,
    me: {
      type: UserType,
      resolve: (root, args, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    allStudents: {
      type: new GraphQLList(StudentType),
      args: {},
      resolve: async () => {
        const students = await Student.find({});
        return students;
      },
    },
    getStudent: {
      type: StudentType,
      args: {
        _id: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (obj, args, context) => {
        const student = await Student.findById(args._id);
        return student;
      },
    },
  }),
});
