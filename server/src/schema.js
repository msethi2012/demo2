import {makeExecutableSchema} from 'graphql-tools';
import {resolvers} from './resolvers';

const typeDefs = `
   
  type User {
    login :String
    id : ID
    url : String
    type : String
    site_admin :Boolean 
    contributions : Int
  }
 type PR{
     url :String
     id :String
     issue_url :String
     number : Int
     title : String
     user : String
     body : String
     created_at : String
     labels : String
     commits_url : String
 }
 type LOC{
     total : String
     author: authorArr
 }
 type authorArr {
     login : String
     avatar_url: String
     url: String
     type:String
     site_admin: Boolean
     }
   type allData {
     loc : LOC
     pr: [PR]
     }
  type Query {
    contributors:[User]
    getAlldata:allData
    getAlldata:allData
  } 
 input GitInput {
  userName: String!
  repo: String
  accessToken: String
}
`;

const schema = makeExecutableSchema({typeDefs, resolvers});

export {schema};
