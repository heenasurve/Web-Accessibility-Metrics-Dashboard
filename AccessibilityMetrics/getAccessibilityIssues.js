/**
 * Created by Heena on 4/11/2018.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const opts = { chromeFlags: ['--show-paint-rects'] };

const fs = require('fs');

let common_mistakes = require("./accessibility_common_issues.json");


let university_websites= [
     "https://www.rit.edu",
     "http://web.mit.edu/",
    "https://www.usc.edu/",
    "https://www.princeton.edu",
     "https://www.harvard.edu",
     "https://www.columbia.edu"
];

let audits = common_mistakes.common_issues;

function launchChromeAndRunLighthouse(url, opts, config,callback){
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => {
            // The gathered artifacts are typically removed as they can be quite large (~50MB+)
            delete results.artifacts;
            return chrome.kill().then(() => results)
        });
    });
}

function analyzeWebsite(index) {
    if (index < university_websites.length){
        let website = university_websites[index];
        console.log(index, website);

        launchChromeAndRunLighthouse(website,opts).then(results => {
            let response = JSON.stringify(results);
            fs.writeFile('response.json', response, function (err){
                if (err){
                    analyzeWebsite(index = index+1);
                    return console.log(err);
                }

                console.log(website);
                analyzeWebsite(index = index+1);

            });
        });

     }


}
 analyzeWebsite(0)

// university_websites.forEach(function(website){
//
//       launchChromeAndRunLighthouse(website, opts).then(results => {
//         let response = JSON.stringify(results);
//         fs.writeFile('response.json', response, function (err){
//             if (err)
//                 return console.log(err);
//                  console.log(website);
//
//             // fs.readFile('./response.json', 'utf8', function (err,data) {
//             //     if (err) {
//             //         return console.log(err);
//             //     }
//             //     let JSON_data = JSON.parse(data);
//             //     let categories = JSON_data["reportCategories"];
//             //     let category_info = "";
//             //     categories.forEach(function(category){
//             //        console.log(category.name + "-" + category.score);
//             //     });
//             //     let accessibility_audits = categories[2].audits;
//             //     audits.forEach(function(audit){
//             //
//             //         fs.writeFileSync('student-2.json', response);
//             //         console.log(accessibility_audits[Object.keys(audit)[0]].id +"->" + accessibility_audits[Object.keys(audit)[0]].score);
//             //     });
//             //
//             // });
//         });
//     });
// });