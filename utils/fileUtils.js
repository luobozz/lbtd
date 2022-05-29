const fs = require("fs")
const path = require("path")
module.exports = {
    touchWriteFile:(to, content) => {
        const makeDirs = pt => {
            if (fs.existsSync(pt)) {
                return true;
            }
            if (makeDirs(path.dirname(pt))) {
                fs.mkdirSync(pt);
                return true;
            }
        };
        makeDirs(path.dirname(to) + '/')
        fs.writeFileSync(to, content, "utf8")
    },
    readFIle:(path)=>{
        return fs.existsSync(path)?fs.readFileSync(path, 'utf8'):"";
    }
}