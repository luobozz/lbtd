const inquirer = require("inquirer");
const lodash = require('lodash');
const fileUtils = require('./fileUtils');
inquirer.registerPrompt('checkbox_n', require('./checkbox_n'));
var fuzzy = require('fuzzy');
const INDENT_CHAR = "―"

module.exports = {
    ls() {
        const json = deconstructJson(JSON.parse(fileUtils.readFIle("./json_todo2.json")))

        var source = json2inquire(json);

        inquirer.prompt([{
            type: 'checkbox_n',
            name: 'todo',
            message: '待办列表',
            pageSize: 200,
            highlight: true,
            searchable: false,
            default: source[1],
            source: function (answersSoFar, input) {
                input = input || '';
                return new Promise(function (resolve) {
                    var fuzzyResult = fuzzy.filter(input, source[0]);
                    var data = fuzzyResult.map(function (element) {
                        return element.original;
                    });
                    resolve(data);
                });
            },
            onAdd: (choice) => {
                //TODO I建先选择模式是增加还是删除还是修改
                //TODO 然后选择当前目录还是根目录
                //TODO 菜单期间用clear处理
                console.log();
                inquirer.prompt([  {
                    type: 'input',
                    name: 'add_todo',
                    message: `在${choice.name}下增加一个名称`,
                  },]).then((answers) => {
                    console.log(JSON.stringify(answers, null, '  '));
                });
            }
        }]).then(function (answers) {
            fileUtils.touchWriteFile('./json_todo2.json', JSON.stringify(assembleJson(json, answers.todo)))
        });
    }
}

const json2inquire = (json) => {

    const inquireChoices = [], inquireChoicesdft = []

    json.forEach(fo => {
        if (fo.type != "title") {
            const str = `${INDENT_CHAR.repeat(fo.indent)}${fo.content}`
            inquireChoices.push(str)
            if (fo.finish) {
                inquireChoicesdft.push(str)
            }
        } else {
            const str = `${INDENT_CHAR.repeat(fo.indent)}${fo.content}`
            inquireChoices.push(str)
            if (fo.finish) {
                inquireChoicesdft.push(str)
            }
        }
    })
    return [inquireChoices, inquireChoicesdft]
}

const deconstructJson = (json) => {
    const djson = []

    const recu = (arr, parent, indent) => {
        arr.forEach(fo => {
            if (!lodash.isEmpty(fo.childrens)) {
                djson.push({
                    content: fo.content,
                    indent,
                    type: "title",
                    parent: parent
                })
                recu(fo.childrens, fo.content, indent + 1)
            } else {
                djson.push({
                    type: "task",
                    ...fo,
                    parent: parent,
                    indent
                })
            }
        })
    }
    recu(json, '', 0)
    return djson
}

const assembleJson = (json, choices) => {
    const ajson = []
    const recu = (arr, pjson, indent) => {
        arr.forEach(fo => {
            const childrens = json.filter(fi => fi.parent == fo.content && fi.indent == fo.indent + 1)
            const obj = {
                content: fo.content,
                childrens: [],
                finish: choices.filter(fi => replaceAll(fi, INDENT_CHAR, "") == `${fo.content}`).length > 0
            }
            if (!lodash.isEmpty(childrens)) {
                recu(childrens, obj.childrens, fo.indent + 1)
            }
            if (fo.indent == indent) {
                pjson.push(obj)
            }
        })
    }
    recu(json, ajson, 0)
    return ajson
}

function replaceAll(fd, replace, str) {
    return fd.replace(new RegExp(replace, "gm"), str);
}