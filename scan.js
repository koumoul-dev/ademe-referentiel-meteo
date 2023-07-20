const path = require('path')
const klaw = require('klaw')
const generateFile = require('./generate-file')

const sets = ['load_factor_solar_roof', 'load_factor_solar_small_roof', 'load_factor_solar_tracker', 'load_factor_solar', 'load_factor_wind_offshore', 'load_factor_wind_onshore_new', 'load_factor_wind_onshore_old', 'temperatures' ]

async function scan() {
    const filesGroups = {}
    for await (const file of klaw(path.join(__dirname,'data'))) {
        const filename = file.path.split('/').pop()
        let setFound = false
        for (const set of sets){
            if (!setFound && filename.includes(set)){
                filesGroups[set] = filesGroups[set] || []
                filesGroups[set].push({ filename, path: file.path })
                setFound = true
            }
        }
        // if (!setFound) console.log(file.path)
    }
    for (const group of Object.keys(filesGroups)){
        console.log(group)
        await generateFile(group, filesGroups[group])
     }
    // console.log(filesGroups)
} 

scan()