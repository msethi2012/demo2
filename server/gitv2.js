let request = require('request');
let async = require("async");
let _ = require('lodash');

const accessToken = '876487a587e4f79ef137e7f4513609bc27d34986';
const userName="sequelize";
const repos="sequelize";


const PR = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://api.github.com/repos/'+ userName + '/' + repos + '/pulls';
        let options = {
            url: url,
             headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Awesome-Octocat-App',
    },
            method: 'GET',
        };
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,{PRs: body}));
        });
    })
}
// Get the lines of code
const loc = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://api.github.com/repos/'+ userName + '/' + repos + '/stats/contributors';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Awesome-Octocat-App',
            },
            method: 'GET',
        };
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,{Lines_of_Code: body}));
        });
    })
}

const getComment = (pullNumber,callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://api.github.com/repos/'+ userName + '/' + repos +'/pulls/'+pullNumber+'/comments';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Awesome-Octocat-App',
            },
            method: 'GET',
        };
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,body));
        });

    })
}

const PRComments = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        let comments = [];

        await PR(async function(err,pullReqResult){
            if(err){
                return console.log(err);
            }else{
                //console .log("pullReqResult",pullReqResult);

                let data = JSON.parse(pullReqResult.PRs);
                for(let i = 0; i < data.length; i++){
                    if(_.has(data[i], 'number')){
                        await getComment(data[i].number,function(err,comment){
                            if(err){
                                return console.log(err);
                            }else{
                                comments.push(comment);
                            }
                        });
                    }
                }
                callback(null,{Comments_on_PRs:comments});
            }
        })
    })
}
// Get the All issues of the repository
const getIssues = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://api.github.com/repos/'+ userName + '/' + repos + '/issues';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Awesome-Octocat-App',
            },
            method: 'GET',
        };
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,body));
        });
    })
}

const getIssuesComment = (issueNumber,callback)=>{
    return new Promise(async(resolve, reject)=>{
        const url = 'https://api.github.com/repos/'+ userName + '/' + repos +'/issues/'+issueNumber+'/comments';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Awesome-Octocat-App',
            },
            method: 'GET',
        };
        request(options,function (error, response, body) {
            if(error){
                return reject(error)
            }
            return resolve(callback(null,body));
        });
    })
}
// Get comments of the issues
const IssuesComments = (callback)=>{
    return new Promise(async(resolve, reject)=>{
        let issues = [];
        await getIssues( async function(err,issuesData){
            if(err){
                return console.log(err);
            }else{
                let data = JSON.parse(issuesData);
                for(let i = 0; i < data.length; i++){
                    if(!_.has(data[i], 'pull_request')){
                        await getIssuesComment(data[i].number,function(err,issue){
                            if(err){
                                return console.log(err);
                            }else{
                                issues.push(issue);
                            }
                        })
                    }
                }
                callback(null,{issuesComments:issues});
            }
        })
    })
}

const getAllData =  (accessToken,userName,repos)=>{
   //  accessToken = '876487a587e4f79ef137e7f4513609bc27d34986';
   // userName ="get-alex";
   // repos="alex";
   return   async.series([PR, loc, PRComments, IssuesComments], function(err, results) {
            console.dir(results);
            return results;
        });
}
module.exports = {
    getAllData : getAllData
}