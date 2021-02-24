'use strict';

var fs = require('fs');

// promise version of fs.readFile
function readFileAsync(fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, 'utf8', function(err, data){
            if (err) {
                throw({
                    code: "ERR_READ_ERROR",
                    file: fileName,
                    message: "Read error (file \"" + fileName + "\"): " + err.message
                });
            } else {
                resolve({name: fileName, content: data})}
        });
    });
}

// fetch the contents of multiple JSON files into a promise-wrapped array
function asyncReadMultipleJSON(fileList) {
    return Promise.all(fileList.map(readFileAsync))
        .then(function (fileContentList) {
            try {
                var returnArray = [];
                fileContentList.forEach(function (fileContent) {
                    try {
                        var parsedFileContent = JSON.parse(fileContent.content);
                    } catch (err) {
                        throw({
                            code: "ERR_PARSE_ERROR",
                            file: fileContent.name,
                            message: "Parse error (file \"" + fileContent.name + "\"): " + err.message
                        });
                    }
                    returnArray.push(parsedFileContent);
                });
                return returnArray;
            } catch (err) {throw err;}
        })
        .catch(function (err) {throw err;});
}

module.exports = asyncReadMultipleJSON;

