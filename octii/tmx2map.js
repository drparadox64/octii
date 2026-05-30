import { MAP_SIZE } from "/octii/data.js";

export async function tmx2map(fn) {
    const xmlfile = await fetch("/octii/maps/"+fn+".tmx");
    const text = await xmlfile.text();
    const xmlparser = new DOMParser();
    const doc = xmlparser.parseFromString(text, "text/xml");
    console.log(text);
    const dataNode = doc.getElementsByTagName("data")[0];
    const csv = dataNode.textContent.trim();

    const tiles = csv
        .split(",")
        .map(n=>parseInt(n, 10));

    let output = [];
    for (let i = 0; i < MAP_SIZE; i++) {
        let row = [];
        for (let j = 0; j < MAP_SIZE; j++) {
            row.push(tiles[i*MAP_SIZE+j]-1);
        }
        output.push(row);
    }
    return output;
}

export async function mapmeta(fn) {
    const xmlfile = await fetch("/octii/maps/" + fn + ".tmx");
    const text = await xmlfile.text();

    const xmlparser = new DOMParser();
    const doc = xmlparser.parseFromString(text, "text/xml");

    const props = doc.getElementsByTagName("property");

    let output = {};

    for (let i = 0; i < props.length; i++) {
        const prop = props[i];

        const name = prop.getAttribute("name");
        let value = prop.getAttribute("value");

        // convert ints automatically
        if (prop.getAttribute("type") == "int") {
            value = parseInt(value, 10);
        }

        output[name] = value;
    }

    return output;
}