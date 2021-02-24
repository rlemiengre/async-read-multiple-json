# @rlemiengre/async-read-multiple-json

## Version

1.1.0

## Description

Asynchronously read the contents of one or more JSON files into a promise-wrapped array,
in order to process the contents of the files only after they are all read and parsed correctly.

## Usage

**file1.json**:
```json
{
  "id": 1,
  "name": "name1",
  "content": [
    "item1",
    "item2"
  ],
  "visited": 11
}

```

**file2.json**:
```json
{
  "id": 2,
  "name": "name2",
  "content": [
    "item1",
    "item2"
  ],
  "visited": 8
}
```

**file3.json**:
```json
{
  "id": 3,
  "name": "name3",
  "content": [
    "item1",
    "item2"
  ],
  "visited": 0
}
```

**index.js**:

```js
const asyncReadMultipleJSON = require(async-read-multiple-json);  

const jsonFiles = [ 
	'file1.json', 
	'file2.json', 
	'file3.json'
];   

asyncReadMultipleJSON(jsonFiles)
    .then(responses => { 
        for (let i=0; i<responses.length; i++) {
            console.log(responses[i]);
        }
    })
    .catch(err => {
        console.log(err.message);
    });
```

**running the code**:
```bash
>> node index.js
```

```js
{
    "id": 1,
    "name": "name1",
    "content": [
      "item1",
      "item2"
    ],
    "visited": 11
}

{
    "id": 2,
    "name": "name2",
    "content": [
      "item1",
      "item2"
    ],
    "visited": 8
}

{
    "id": 3,
    "name": "name3",
    "content": [
      "item1",
      "item2"
    ],
    "visited": 0
}
```

## Installation

Use the package manager **npm** to install @rlemiengre/async-read-multiple-json.

```bash
>> npm install --save @rlemiengre/async-read-multiple-json
```

## API

**syntax**:

asyncReadMultipleJSON(fileList);

**parameters**:

fileList

An array of one or more JSON files to be read.

**return value**:

The function returns a promise (which resolves with an array of objects representing the contents of the provided JSON files).

## Errors

When an exception happens during execution of the code, a custom error object will be thrown:  

```json
{
    code: <error-type>,
    file: <file-name>,
    message: <message>
}
```

Possible error-types (passed in the "**code**" property):  

- "ERR_READ_ERROR":
One of the files could not be read.

- "ERR_PARSE_ERROR":
There was a problem parsing one of the provided files.

The "**file**" property contains the filename of the file where the error occurred.

The "**message**" property is a more verbose error message (also including the error type and filename).

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contributors

**rlemiengre**  
[https://github.com/rlemiengre](https://github.com/rlemiengre)