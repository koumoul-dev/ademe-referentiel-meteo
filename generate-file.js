const fs = require('fs-extra')
const path = require('path')
const endOfLine = require('os').EOL

// 'month', 'day_of_month', 'file' ,
const fields = ['date', 'year', 'day_of_year', 'time', 'country', 'region']

module.exports = async function (name, filesSet){
    await fs.ensureDir(path.join(__dirname, 'out'))
    const dataWriteStream = fs.createWriteStream(path.join(__dirname, 'out', name+'.csv'))
    dataWriteStream.write(fields.join(',') + ',' + name + endOfLine)
    for (const file of filesSet){
        const lines = (await fs.readFile(file.path, 'utf-8')).split('\r\n')
        const header = lines.shift().split(';')
        const tail = file.path.split('data/').pop()
        const toks = tail.split('/')
        const country = toks[0]
        const region = toks.length > 2 ? toks[1] : undefined
        lines.filter(l => l.length).forEach((line, dayOfYear) => {
            const cells = line.split(';')
            const [date, time] = cells[0].split(' ')
            const [dd, mm, yyyy] = date.split('/')
            for (let i = 1;i<19;i++){
                // console.log(file.filename, dayOfYear, i, cells[i])
                const data = [
                    header[i].split(' ')[0] + '-' + mm + '-' + dd,
                    header[i],
                    Math.floor(dayOfYear/24) + 1,
                    time,
                    country,
                    region,
                    cells[i].replace(',', '.')
                ]
                dataWriteStream.write(data.join(',') + endOfLine)
            }
        })
        // console.log(header)
    }
    dataWriteStream.end()
}