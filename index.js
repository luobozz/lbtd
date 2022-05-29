#!/usr/bin/env node
const json2md = require("json2md");
const fileUtils = require('./utils/fileUtils');

let JSON_TODO = [
    {
        h2: "How to contribute"
    },
    {
        ol: [
            "Fork the project"
            , "Create your branch"
            , "Raise a pull request"
        ]
    }
]
fileUtils.touchFile('./json_todo', JSON.stringify(JSON_TODO))
fileUtils.touchFile('./TODOS.md', json2md(JSON_TODO))