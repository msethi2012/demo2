const request = require('request');
const _ = require('lodash');
const accessToken = '876487a587e4f79ef137e7f4513609bc27d34986';

// Get the pull request
const getPullRequest = (callback)=>{
  return new Promise(async(resolve, reject)=>{
    const url = `https://api.github.com/repos/${USERNAME}/${REPOSITORIES}/pulls`;
    const options = {
      url: url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      method: 'GET',
    };
    request(options, (error, response, body) => {
      if(error){
        return reject(error)
      }
      return resolve(callback(null,{PRs: body}));156416
    });
  })
}
// Get the lines of code
const getLinesOfCode = (callback)=>{
  return new Promise(async(resolve, reject)=>{
    const url = `https://repos/${USERNAME}/${REPOSITORIES}/stats/contributors`;
    const options = {
      url: url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      method: 'GET',
    };
    request(options, (error, response, body) => {
      if(error){
        return reject(error)
      }
      return resolve(callback(null,{Lines_of_Code: body}));
    });
  })
}
// Get single pull request comment
const getComment =async (pullNumber,callback)=>{
  return new Promise(async(resolve, reject)=>{
    const url = `https://https://api.github.com/repos/${USERNAME}/${REPOSITORIES}/pulls/${pullNumber}/comments`;
    const options = {
      url: url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      method: 'GET',
    };
    request(options, (error, response, body) => {
      if(error){
        return reject(error)
      }
      return resolve(callback(null,body));
    });

  })
}
// Get all comments of the pull request
const getCommentsOnPRs = (callback)=>{
  return new Promise(async(resolve, reject)=>{
    const comments = [];
    await getPullRequest(async (err, pullReqResult) => {
      if(err){
        return console.log(err);
      }else{
        const data = JSON.parse(pullReqResult.PRs);
        for(let i = 0; i < data.length; i++){
          if(_.has(data[i], 'number')){
            await getComment(data[i].number,(err, comment) => {
              if(err){
                return console.log(err);
              }else{
                comments.push(comment);
              }
            });
          }
        }
        callback(null, {Comments_on_PRs:comments});
      }
    })
  })
}
// Get the All issues of the repository
const getIssues = (callback)=>{
  return new Promise(async(resolve, reject)=>{
    const url = `https://${process.env.BASE_URL}/repos/${USERNAME}/${REPOSITORIES}/issues`;
    const options = {
      url: url,
      headers: {'user-agent': 'node.js'},
      auth:{
        user: USERNAME,
        pass: process.env.PASSWORD,
      },
      method: 'GET',
    };
    request(options, (error, response, body) => {
      if(error){
        return reject(error)
      }
      return resolve(callback(null,body));
    });
  })
}
// Get single comment of the issues
const getIssuesComment = (issueNumber,callback)=>{
  return new Promise(async(resolve, reject)=>{
    const url = `https://${process.env.BASE_URL}/repos/${USERNAME}/${REPOSITORIES}/issues/${issueNumber}/comments`;
    const options = {
      url: url,
      headers: {'user-agent': 'node.js'},
      auth:{
        user: USERNAME,
        pass: process.env.PASSWORD,
      },
      method: 'GET',
    };
    request(options, (error, response, body) => {
      if(error){
        return reject(error)
      }
      return resolve(callback(null,body));
    });
  })
}
// Get comments of the issues
const getCommentsOnIssues = (callback)=>{
  return new Promise(async(resolve, reject)=>{
    const issues = [];
    await getIssues( (err, issuesData) => {
      if(err){
        return console.log(err);
      }else{
        const data = JSON.parse(issuesData);
        for(let i = 0; i < data.length; i++){
          if(!_.has(data[i], 'pull_request')){
            await getIssuesComment(data[i].number,(err, issue) => {
              if(err){
                return console.log(err);
              }else{
                issues.push(issue);
              }
            })
          }
        }
        callback(null, {Comments_on_Issues:issues});
      }
    })
  })
}
// Main Function to get data for metrix
const getMetrix = ()=>{
  const USERNAME="get-alex";
  const REPOSITORIES="alex";

  async.series([
    getPullRequest,
    getLinesOfCode,
    getCommentsOnPRs,
    getCommentsOnIssues
  ], (err, results) => {
    console.log(results);
  });
}
getMetrix()
module.exports = {
  getMetrix : getMetrix
}