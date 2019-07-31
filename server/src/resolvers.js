import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();
const contacts = [
  {
    id: '1',
    firstName: 'Manny',
    lastName: 'Henri',
    notes: [
      {
        id: '1',
        details: 'I think this guy is an author at linkedin'
      },
      {
        id: '2',
        details: 'His name is Manny'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Jasmine',
    lastName: 'Henri-Rainville',
    notes: [
      {
        id: '1',
        details: 'I think this guy is an author at linkedin'
      },
      {
        id: '2',
        details: 'His name is Manny'
      }
    ]
  },
    {
    id: '3',
    firstName: 'Jeremy',
    lastName: 'Henri-Rainville',
    notes: [
      {
        id: '1',
        details: 'I think this guy is an author at linkedin'
      },
      {
        id: '2',
        details: 'His name is Manny'
      }
    ]
  }
]
//import {getAllData} from '../gitv2'
import {getAllData} from '../git'

export const resolvers = {
  Query: {
    contributors:  () => {
      const fetch = require('node-fetch');
      let repoPath = 'get-alex/alex';
      //console.log(repo);
      let repo = repoPath;
      //return dataJson;

      const accessToken = '876487a587e4f79ef137e7f4513609bc27d34986';
      return fetch(`https://api.github.com/repos/${repo}/contributors`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then(res => res.json())
          .catch(error => console.error(error));

      /*
      return fetch(`${baseURL}/posts`).then(res => res.json())

      * */
    },

    getAlldata:   () => {

     return   getAllData("","","");

    }
  },
};
