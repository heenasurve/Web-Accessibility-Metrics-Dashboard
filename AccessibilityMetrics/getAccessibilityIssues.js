/**
 * Created by Heena on 4/11/2018.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const opts = { chromeFlags: ['--show-paint-rects'] };

const fs = require('fs');



let university_websites= [
    "http://www.tnstate.edu","http://www.tntech.edu","http://www.tamuc.edu","http://www.tamucc.edu","http://www.tamuk.edu","http://tsu.edu","http://txstate.edu","https://twu.edu","https://www.trevecca.edu","https://www.tiu.edu","http://www.uakron.edu","http://ualr.edu","https://louisiana.edu","http://www.ulm.edu","https://www.umes.edu/home/","http://www.memphis.edu","https://www.umsl.edu","https://www.unomaha.edu","https://www.unlv.edu","http://uno.edu","https://www.uncg.edu","http://unco.edu","http://unt.edu","http://southalabama.edu","http://usm.edu","https://www.uta.edu/uta/","https://www.utep.edu","http://www.utrgv.edu/en-us/","https://www.utsa.edu","http://ucumberlands.edu","http://utoledo.edu","http://uwf.edu","http://westga.edu","http://uwm.edu","http://valdosta.edu","http://wichita.edu","http://wright.edu"

   ];


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
    try {

        if (index < university_websites.length){
            let website = university_websites[index];

            launchChromeAndRunLighthouse(website,opts).then(results => {


                let  reportCategories =  results["reportCategories"];


                reportCategories.forEach(function (val) {

                    if (val["name"] == "Accessibility"){

                        let accessibility_audits = val["audits"];

                        let neededData = JSON.stringify({websiteName:website,audits:accessibility_audits});

                        allData.push(neededData);

                        writeResult(allData,website)

                        analyzeWebsite(index = index+1);


                    }

                });


            });

        }else {

         //   writeResult(allData)
        }

    }catch (ex)  {
        console.log("ex ex",ex);

        writeResult(allData)
        analyzeWebsite(index = index+1);

    }



}
function writeResult(data ,websiteName) {

    fs.writeFile('Rankings3.json', data, function (err){
        if (err){
            return console.log("error happened ");
        }

        return console.log(websiteName+" was Saved");

    });
}
 //analyzeWebsite(0)

function readParseFile(fileName) {

                fs.readFile('./'+fileName+'.json', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                let JSON_data = JSON.parse(data);


                    JSON_data.forEach(function (val) {

                        let websiteName = val["websiteName"]
                        let audits = val["audits"];


                         var temp = ""+websiteName+",";

                        audits.forEach(function (value) {


                            temp = temp+value.score
                            temp = temp+","

                        })
                       temp = temp.substring(0, temp.length - 1);

                        console.log(temp)


                    });

            });

}
readParseFile("Rankings");

