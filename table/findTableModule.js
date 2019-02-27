const fs = require('fs')

module.exports = {
    getRequestProp(primalName,count){
        return new Promise((resolve,reject)=>{
            fs.readdir('./table/tables', (err, data) => {
                data.forEach(x => {
                    var name = x.split('.')[0]
                    if (name == primalName) {
                        var propOriginal = require(`./tables/${name}`)
                        resolve(propOriginal.getData())
                    }
                })
                reject(null)
            })
        })
    }
}