const fs = require('fs');

const files = fs.readdirSync('./MI');

console.log(files);

const stateFile = {
    type: 'FeatureCollection',
    features: []
};

for (const file of files) {
    const rawPolygon = fs.readFileSync(`./MI/${file}`);
    const polygon = JSON.parse(rawPolygon);
    stateFile.features.push(polygon);
}

fs.writeFileSync(
    'michigan-counties.geo.json',
    JSON.stringify(stateFile, null, '  '));
