const should = require('chai').should();
const rewire = require("rewire");

const asyncReadMultipleJSON = rewire('./index');

const asyncFunctionShouldThrow = async (method, params, code) => {
    let err = null;
    try {
        await method(...params);
    } catch (error) {
        err = error;
    }
    if (code) {
        should.exist(err.code);
        err.code.should.equal(code);
    } else {
        (typeof(err)).should.equals('object')
    }
};

const runAsync = async (method, params) => {
    try {
        const retVal = await method(...params);
        return retVal;
    } catch (error) {
        return error;
    }
}

const files = {
    "file1.json": {
        "id": 1,
        "name": "name1",
        "content": [
            "item1",
            "item2"
        ],
        "visited": 11
    },
    "file2.json": {
        "id": 2,
        "name": "name2",
        "content": [
            "item1",
            "item2"
        ],
        "visited": 8
    },
    "file3.json": {
        "id": 3,
        "name": "name3",
        "content": [
            "item1",
            "item2"
        ],
        "visited": 0
    }
};

const fsMock_allgood = {
    readFile: function (filename, encoding, callback) {
        callback(null, JSON.stringify(files[filename]));
    }
};

const fsMock_notfound = {
    readFile: function (filename, encoding, callback) {
        callback(new Error("ENOENT: no such file or directory"), null);
    }
};

const JSONMock_allgood = {
    parse: JSON.parse,
    stringify: JSON.stringify
};

const JSONMock_parseError = {
    parse: function (data) {
        throw(new Error("Unexpected token ] in JSON at position 75"));
    },
    stringify: JSON.stringify
};

describe('async-read-multiple-json unit tests', function() {

    it("return the proper array normally", function (done) {
        asyncReadMultipleJSON.__set__("fs", fsMock_allgood);
        asyncReadMultipleJSON.__set__("JSON", JSONMock_allgood);
        runAsync(asyncReadMultipleJSON, [Object.keys(files)])
            .then((result) => {
                result[0].id.should.equal(1);
                result[1].id.should.equal(2);
                result[2].id.should.equal(3);
                done();
            });
    });

    it("fail with a 'ERR_READ_ERROR' error code when a file doesn't exist", function (done) {
        asyncReadMultipleJSON.__set__("fs", fsMock_notfound);
        asyncReadMultipleJSON.__set__("JSON", JSONMock_allgood);
        asyncFunctionShouldThrow(asyncReadMultipleJSON, [Object.keys(files)], "ERR_READ_ERROR")
            .then(done)
            .catch(done);
    });

    it("fail with a 'ERR_PARSE_ERROR' error code when a file's contents can't be parsed", function (done) {
        asyncReadMultipleJSON.__set__("fs", fsMock_allgood);
        asyncReadMultipleJSON.__set__("JSON", JSONMock_parseError);
        asyncFunctionShouldThrow(asyncReadMultipleJSON, [Object.keys(files)], "ERR_PARSE_ERROR")
            .then(done)
            .catch(done);
    });
});
