const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const text2png = require('text2png');
const { openStreamDeck } = require('elgato-stream-deck');
const myStreamDeck = openStreamDeck();
const config = require('./config');
const log = console.log;
const error = console.error;
const generatedIconFolder = 'src/icons/generated/';
const premadeIconFolder = 'src/icons/premade/';
const folderElement = {
    "index": 0,
    "content": {
        "fill": {
            "text": "BACK",
            "bgColor": "black",
            "textColor": "white",
            "font": "Helvetica",
            "fontSize": 30,
            "padding": 30
        }
    }
}
const folderIconPath = 'src/icons/generated/folder.png';
let folderIndex = undefined;

const runCommand = async (action) => {
    try {
        await exec(action);
    } catch (err) {
        error(err);
    };
}

const mkdirp = (dir) => {
    if (fs.existsSync(dir)) { return true }
    const dirname = path.dirname(dir)
    mkdirp(dirname);
    fs.mkdirSync(dir);
}

const setup = () => {
    return new Promise((resolve) => {
        myStreamDeck.on('up', keyIndex => {
            if (folderIndex) {
                folderIndex = undefined;
                fillDisplays(config);
            } else {
                const element = config.find(element => element.index === keyIndex);
                if (element.action) {
                    runCommand(element.action)
                } else if (element.folder) {
                    folderIndex = element.index;
                    displayFolder(element);
                }
            }
        });

        myStreamDeck.on('error', error => {
            error(error);
        });

        myStreamDeck.clearAllKeys();
        resolve(myStreamDeck);
    })
}

const displayFolder = (element) => {
    myStreamDeck.clearAllKeys();
    const sourceFile = createImageFromText(folderElement, true);
    setImageToDisplay(sourceFile, folderElement);
    fillDisplays(element.folder);
}

const fillDisplays = (elements) => {
    if (elements.length) {
        elements.forEach(async (element) => {
            if (element.content) {
                let file;
                if (element.content.fill) {
                    file = createImageFromText(element);
                } else if (element.content.icon) {
                    file = getIconFilePath(element);
                }
                setImageToDisplay(file, element);
            }
        });
    }
}

const getIconFilePath = (element) => `${element.content && element.content.fill ? generatedIconFolder : premadeIconFolder}${element.index}.png`;

const createImageFromText = (element, folder) => {
    const fill = element.content.fill;
    fs.writeFileSync(folder ? folderIconPath : getIconFilePath(element), text2png(fill.text, {
        color: fill.textColor,
        font: `${fill.fontSize}px ${fill.font}`,
        bgColor: fill.bgColor,
        padding: fill.padding
    }));
    return folder ? folderIconPath : getIconFilePath(element);
}

const setImageToDisplay = async (sourceFile, element) => {
    const buffer = await sharp(sourceFile)
        .flatten()
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE)
        .raw()
        .toBuffer();
    myStreamDeck.fillImage(element.index, buffer)
}

(async () => {
    await setup();
    fillDisplays(config);
})();
