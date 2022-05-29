#!/usr/bin/env node
// const json2md = require("json2md");
// const fileUtils = require('./utils/fileUtils');

// let JSON_TODO = [
//     {
//         h2: "How to contribute"
//     },
//     {
//         ol: [
//             "Fork the project"
//             , "Create your branch"
//             , "Raise a pull request"
//         ]
//     }
// ]
// fileUtils.touchFile('./json_todo', JSON.stringify(JSON_TODO))
// fileUtils.touchFile('./TODOS.md', json2md(JSON_TODO))

const { ArgumentParser } = require('argparse');

const { version } = require('./package.json');
const todoDrivers = require('./utils/todo_driver');

const parser = new ArgumentParser({
    description: 'todos'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-ls', '--ls', {action:'store_true', help:'查看当前的todos'});
const args = parser.parse_args()
if(args.ls){
    todoDrivers.ls()
}else{
    todoDrivers.ls()
}