const fs = require('fs');

const files = fs.readdirSync('./MI');

const stateFile = {
    type: 'FeatureCollection',
    features: []
};

const hsas = {};

const hsaColors = {
    hsa1: '#0000ff', // blue
    hsa2: '#ff0000', // red
    hsa3: '#00ff00', // green
    hsa4: '#ffff00', // yellow
    hsa5: '#ff8000', // orange
    hsa6: '#6600cc', // purple
    hsa7: '#000000', // black
    hsa8: '#a0a0a0' // grey
};

for (let i = 1; i < 9; i++) {
    const hsaObj = {
        type: 'FeatureCollection',
        properties: {
            kind: 'HSA',
            hsa: i
        },
        features: []
    };

    stateFile.features.push(hsaObj);
    hsas[`hsa${i}`] = hsaObj;
}

const hsa2Regions = {
    hsa1: [
        'St. Clair', 'Livingston', 'Oakland', 'Macomb', 'Washtenaw',
        'Wayne', 'Monroe'
    ],
    hsa2: [
        'Clinton', 'Eaton', 'Ingham', 'Jackson', 'Hillsdale',
        'Lenawee'
    ],
    hsa3: [
        // Berrie from the state's data is actually `Berrien`
        'Barry', 'Van Buren', 'Kalamazoo', 'Calhoun', 'Berrien',
        'Cass', 'St. Joseph', 'Branch'
    ],
    hsa4: [
        'Mason', 'Lake', 'Osceola', 'Oceana', 'Newaygo',
        'Mecosta', 'Muskegon', 'Ottawa', 'Kent', 'Montcalm',
        'Ionia', 'Allegan'
    ],
    hsa5: [
        'Shiawassee', 'Genesee', 'Lapeer'
    ],
    hsa6: [
        'Roscommon', 'Ogemaw', 'Iosco', 'Clare', 'Gladwin',
        'Arenac', 'Isabella', 'Midland', 'Bay', 'Huron',
        'Gratiot', 'Saginaw', 'Tuscola', 'Sanilac'
    ],
    hsa7: [
        'Emmet', 'Cheboygan', 'Presque Isle', 'Charlevoix', 'Antrim',
        'Otsego', 'Montmorency', 'Alpena', 'Leelanau', 'Benzie',
        'Grand Traverse', 'Kalkaska', 'Crawford', 'Oscoda', 'Alcona',
        'Manistee', 'Wexford', 'Missaukee'
    ],
    hsa8: [
        'Keweenaw', 'Gogebic', 'Ontonagon', 'Houghton', 'Iron',
        'Baraga', 'Marquette', 'Dickinson', 'Menominee', 'Alger',
        'Delta', 'Schoolcraft', 'Luce', 'Mackinac', 'Chippewa'
    ]
};

for (const file of files) {
    const rawPolygon = fs.readFileSync(`./MI/${file}`);
    const polygon = JSON.parse(rawPolygon);

    let region;

    const pieces = file.split('.');
    if (pieces.length === 3) {
        region = pieces[0];
    } else {
        region = [pieces[0], pieces[1]].join('.');
    }

    let hsa;
    for (const hsaName in hsa2Regions) {
        const counties = hsa2Regions[hsaName];
        if (counties.indexOf(region) > -1) {
            hsa = hsaName;
            break;
        }
    }

    for (const feature of polygon.features) {
        feature.properties.fill = hsaColors[hsa];
    }

    if (!hsa) {
        throw new Error(`no hsa found for region: ${region}`);
    }
    hsas[hsa].features.push(polygon);
}

fs.writeFileSync(
    'michigan-hsa-regions.geo.json',
    JSON.stringify(stateFile, null, '  '));
