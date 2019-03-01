const fs = require('fs')

function chkToMulti(x) {
    return !(!(x.count || (x.option ? x.option.stack : false)))
}

module.exports = {
    getRequestProp(primalName,count){
        return new Promise((resolve, reject) => {
            fs.readdir('./table/tables', (err, data) => {
                data.forEach(x => {
                    var name = x.split('.')[0]
                    if (name == primalName) {
                        var propOriginal = require(`./tables/${name}`)
                        return resolve(propOriginal.getData())
                    }
                })
                return reject(null)
            })
        })
    },
    getPropList(){
        return new Promise((resolve, reject) => {
            fs.readdir('./table/tables', (err, data) => {
                if(err) reject(null)
                var propList = data.map(x=>{
                    var name = x.split('.')[0]
                    var table = require(`./tables/${name}`)
                    var data = table.getData()
                    data.isProps = chkToMulti(data)
                    data.primalName = table.primalName
                    return data
                })
                return resolve(propList)
            })
        })
    }
}