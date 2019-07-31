const request = require('request');
const _ = require('lodash');

const accessToken = '876487a587e4f79ef137e7f4513609bc27d34986';
const userName = "sequelize";
const repos = "sequelize";

const PR = (userName, repos) => {
    return new Promise(async (resolve, reject) => {
        const url = 'https://api.github.com/repos/' + userName + '/' + repos + '/pulls';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'nodejs test app',
            },
            method: 'GET',
        };
        request(options, function (error, response, body) {
            if (error) {
                return reject(error)
            }
            return resolve(body);
        });
    });
}
// Get the lines of code
const loc = (userName, repos) => {
    return new Promise(async (resolve, reject) => {
        const url = 'https://api.github.com/repos/' + userName + '/' + repos + '/stats/contributors';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'nodejs test app',
            },
            method: 'GET',
        };
        request(options, function (error, response, body) {
            if (error) {
                return reject(error)
            }
            return resolve(body);
        });
    })
}

const getComment = async (pullNumber) => {
    return new Promise(async (resolve, reject) => {
        const url = 'https://api.github.com/repos/' + userName + '/' + repos + '/pulls/' + pullNumber + '/comments';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'nodejs test app',
            },
            method: 'GET',
        };
        request(options, function (error, response, body) {
            if (error) {
                return reject(error)
            }
            return resolve(body);
        });

    })
}

const PRComments = (userName, repos, PRdata) => {
    return new Promise(async (resolve, reject) => {
        let comments = [];
        let tempComment;
        let data = PRdata;
        for (let i = 0; i < 2; i++) {
            if (_.has(data[i], 'number')) {

                tempComment = await getComment(data[i].number);

                //   if(i==0)console.log("tempComment id=>>"+i,JSON.parse(tempComment));
                //   if(i==0)console.log("tempComment id=>>"+i,typeof tempComment);
                comments.push(JSON.parse(tempComment))
            }
        }

        //console .log("pullReqResult",pullReqResult);

        console.log("comments =>>", comments.length);

        return resolve(comments);

    })
}
// Get the All issues of the repository
const getIssues = (userName, repos) => {
    return new Promise(async (resolve, reject) => {
        const url = 'https://api.github.com/repos/' + userName + '/' + repos + '/issues';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'nodejs test app',
            },
            method: 'GET',
        };
        request(options, function (error, response, body) {
            if (error) {
                return reject(error)
            }
            return resolve(body);
        });
    })
}

const getIssuesComment = (issueNumber) => {
    return new Promise(async (resolve, reject) => {
        const url = 'https://api.github.com/repos/' + userName + '/' + repos + '/issues/' + issueNumber + '/comments';
        let options = {
            url: url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'nodejs test app',
            },
            method: 'GET',
        };
        request(options, function (error, response, body) {
            if (error) {
                return reject(error)
            }
            return resolve(body);
        });
    })
}
// Get comments of the issues
const IssuesComments = (userName, repos) => {
    console.log("step 1");
    return new Promise(async (resolve, reject) => {
        let issues = [], tempIssueData;
        let issuesData = await getIssues(userName, repos);

        let data = JSON.parse(issuesData);
        for (let i = 0; i < data.length; i++) {
            if (!_.has(data[i], 'pull_request')) {
                tempIssueData = await getIssuesComment(data[i].number);
                //console.log(typeof tempIssueData);
                //console.log("getIssuesComment=>"+i);
                issues.push(tempIssueData);
                tempIssueData = "";
            }

        }
        //console.log(typeof issues);
        //console.log("issues.length=>",issues.length);

        return resolve(issues);

    })
}

const getAllData = async (accessToken, userName, repos) => {
    accessToken = '876487a587e4f79ef137e7f4513609bc27d34986';
    userName = "sequelize";
    repos = "sequelize";
    let data = [];
    let PRdata = await PR(userName, repos);
    PRdata = JSON.parse(PRdata);
    data["pr"] = PRdata;
    //console.dir(PRdata[0]);
    console.dir("PRdata[0]//////////////////////");

    /*

    let locData = await loc(userName, repos);
     locData=JSON.parse(locData);
     data["loc"]=locData;

     */
    //// console.dir(locData[0]);
    //// console.log("typeof locData",typeof locData);
    //// console.log("Object.keys(locData)=>",Object.keys(locData[0]));


    let PRCommentsData = await PRComments(userName, repos, PRdata);
    console.log("PRCommentsData", PRCommentsData);
    // data["PRComments"]=PRCommentsData["comments"];
    console.log("typeof PRCommentsData", typeof PRCommentsData);
    console.log("Object.keys(PRCommentsData)=>", Object.keys(PRCommentsData));
    //thisWriteFile(PRCommentsData);


    let issuesCommentsData = await IssuesComments(userName, repos);
    //console.log("issuesCommentsData", issuesCommentsData);
    data["IssuesComments"] = issuesCommentsData;
    console.log("typeof IssuesComments", typeof IssuesComments);
    console.log("Object.keys(IssuesComments)=>", Object.keys(IssuesComments));
    // console.log("data",data);
    return data;


}


module.exports = {
    getAllData: getAllData
}