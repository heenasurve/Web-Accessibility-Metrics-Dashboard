/**
 * Created by Heena on 4/11/2018.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const opts = { chromeFlags: ['--show-paint-rects'] };

const fs = require('fs');

let common_mistakes = require("./accessibility_common_issues.json");


//ranking
// "http://www.rit.edu/",
//     "https://www.princeton.edu",
//     "https://www.harvard.edu",
//     "https://www.uchicago.edu",
//     "https://www.columbia.edu",
//     "https://ucsd.edu",
//     "https://www1.lehigh.edu",
//     "http://www.psu.edu",
//     "https://www.fordham.edu",
//     "https://www.umass.edu",
//     "https://www.iastate.edu",
//     "https://www.catholic.edu/index.html",
//     "https://www.colostate.edu",
//     "https://www2.gmu.edu",
//     "https://www.k-state.edu",
//     "https://www.wright.edu",
//     "https://www.umkc.edu",
//     "http://wmich.edu",
//     "http://www.rit.edu/",
//     "https://www.umich.edu/",
//     "https://www.usc.edu/",
//     "http://www.northeastern.edu/",
//     "https://www.dean.edu/"


//Software Engineering Research University
// "http://www.se.rit.edu/",
//     "https://msse.sjsu.edu/",
//     "https://csc.calpoly.edu/",
//     "https://www.stevens.edu/school-systems-enterprises/masters-degree-programs/software-engineering",
//     "http://www.byui.edu/computer-science-electrical-engineering/degrees-and-majors/b-s-in-software-engineering"

//International

// "http://www.rit.edu/",
//     "https://www.cam.ac.uk/",
//         "https://www.utoronto.ca/",
//             "https://www.ethz.ch/en.html",
//                 "http://www.iitd.ac.in/",
//                     "http://www.tsinghua.edu.cn/publish/newthuen/"

//Within the same university

// "http://www.se.rit.edu/",
//     "http://cis.rit.edu/",
// "http://cias.rit.edu/",
//             "http://nsa.rit.edu/",
//                 "https://www.rit.edu/science/"

let university_websites= [

    "http://www.se.rit.edu/",
    "http://cis.rit.edu/",
    "http://cias.rit.edu/",
    "http://nsa.rit.edu/",
    "https://www.rit.edu/science/"

   ];

let audits = common_mistakes.common_issues;

function launchChromeAndRunLighthouse(url, opts, config){
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => {
            // The gathered artifacts are typically removed as they can be quite large (~50MB+)
            delete results.artifacts;
            return chrome.kill().then(() => results)
        });
    });
}
let allData = []

function analyzeWebsite(index) {
    if (index < university_websites.length){
        let website = university_websites[index];

        launchChromeAndRunLighthouse(website,opts).then(results => {


            let  reportCategories =  results["reportCategories"];


            reportCategories.forEach(function (val) {

                if (val["name"] == "Accessibility"){

                    let accessibility_audits = val["audits"];

                     let neededData = JSON.stringify({websiteName:website,audits:accessibility_audits});

                    allData.push(neededData);

                    analyzeWebsite(index = index+1);


                }

            });


        });

     }else {
        fs.writeFile('Withinthesameuniversity.json', allData, function (err){
            if (err){
                return console.log("error happened ");
            }

            return console.log("All data Saved");

        });
    }


}
// analyzeWebsite(0)

function readParseFile(fileName) {

                fs.readFile('./'+fileName+'.json', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                let JSON_data = JSON.parse(data);


                    JSON_data.forEach(function (val) {

                        let websiteName = val["websiteName"]
                        let audits = val["audits"];

                        audits.forEach(function (value) {


                            console.log(websiteName+" , "+value.id+","+value.score+","+ "'"+value.result.helpText+"'")

                        })


                    });

            });

}
//readParseFile("Ranking");
//readParseFile("SoftwareEngineeringResearchUniversity");
// readParseFile("International");
//readParseFile("Withinthesameuniversity");



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