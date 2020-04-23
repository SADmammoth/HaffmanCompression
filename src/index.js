import PriorityQueue from "./PriorityQueue";
import HaffmanCompression from "./HaffmanCompression";

(async () => {
  let haffmanCompression = new HaffmanCompression();
  let mess = await (await fetch("input.txt")).text();
  console.time();
  let result = haffmanCompression.compress(mess.split(""));
  console.timeLog();

  let encodedLength = haffmanText(
    result.compressedMessage,
    result.alphabet
  ).slice("").length;
  let originallength = unicodeText(mess).slice("").length;
  console.log(originallength, encodedLength);
  console.log(((originallength - encodedLength) / originallength) * 100);

  saveAsFile(haffmanText(result.compressedMessage, result.alphabet), "encoded");

  let code = await (await fetch("encoded.txt")).text();
  haffmanCompression.emptyTree();
  let treeLength = parseInt(code.slice(0, 32), 2);
  let maxCharLength = parseInt(code.slice(32, 32 + 6), 2);
  let maxCodeLength = parseInt(
    code.slice(32 + 6, 32 + 6 + treeLength.toString(2).length),
    2
  );
  let skip = 32 + 6 + treeLength.toString(2).length;
  let alphabet = {};
  let char;
  let charCode;
  for (let i = 0; i < treeLength; i++) {
    char = String.fromCharCode(
      parseInt(code.slice(skip, skip + maxCharLength), 2)
    );
    charCode = code.slice(
      skip + maxCharLength,
      skip + maxCharLength + maxCodeLength
    );
    haffmanCompression.addToTree(
      char,
      parseInt(charCode, 2)
        .toString(2)
        .slice(1)
    );
    alphabet[char] = parseInt(charCode, 2).toString(2);
    skip = skip + maxCharLength + maxCodeLength;
  }
  haffmanCompression.drawTree(alphabet);
  let message = code.slice(skip);
  let decodedMessage = "";
  let buffer = "";
  let found = {};
  // let j = 0;
  for (let i = 0; i < message.length; i++) {
    // found = Object.values(alphabet).indexOf(buffer);
    // if (found !== -1) {
    //   decodedMessage += Object.keys(alphabet)[found];
    //   buffer = '';
    //   continue;
    // }
    // buffer += message[i];
    if (Object.keys(found).length) {
      found = haffmanCompression.followPath(message[i], found);
    } else {
      found = haffmanCompression.followPath(message[i]);
    }
    if (typeof found.data === "string") {
      decodedMessage += found.data;
      found = {};
    }
    // console.log(i);
    // buffer = message.slice(i, i + maxCharLength);
    // j = buffer.length - 1;
    // console.log(j);
    // for (j; j > 0; j--) {
    //   console.log(buffer);
    //   found = Object.values(alphabet).indexOf(buffer);
    //   if (found !== -1) {
    //     decodedMessage += Object.keys(alphabet)[found];
    //     buffer = '';
    //     break;
    //   }
    //   buffer = buffer.slice(0, j + 1);
    // }
    // if (j <= 0) {
    //   console.log(j);
    //   console.log(decodedMessage);
    //   throw Error('Unexpected character. Data is damaged');
    // }
    // i += j + 2;
    // j = 0;
  }
  saveAsFile(decodedMessage, "output");
})();

function haffmanText(message, alphabet) {
  let maxLength = [];

  maxLength[0] = [...alphabet.keys()].reduce((max, char) => {
    if (char.charCodeAt(0).toString(2).length > max) {
      return char.charCodeAt(0).toString(2).length;
    }
    return max;
  }, 0);
  maxLength[1] = [...alphabet.values()].reduce((max, code) => {
    if (code.length > max) {
      return code.length;
    }
    return max;
  }, 0);

  let stringifiedAlphabet = [...alphabet.keys()].map(char => {
    return (
      char
        .charCodeAt(0)
        .toString(2)
        .padStart(maxLength[0], "0") +
      ("1" + alphabet.get(char).join("")).padStart(maxLength[1] + 1, "0")
    );
  });

  return (
    stringifiedAlphabet.length.toString(2).padStart(32, "0") +
    maxLength[0].toString(2).padStart(6, "0") +
    (maxLength[1] + 1)
      .toString(2)
      .padStart(stringifiedAlphabet.length.toString(2).length, "0") +
    stringifiedAlphabet.join("") +
    message.flat().join("")
  );
}

function unicodeText(message) {
  return message
    .split("")
    .map(char => {
      return char.charCodeAt(0).toString(2);
    })
    .join("");
}

function saveAsFile(content, filename) {
  const blob = new Blob([content], { type: "text/text" });
  const anchor = document.createElement("a");

  anchor.download = filename + ".txt";
  anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
  anchor.dataset.downloadurl = [
    "text/plain",
    anchor.download,
    anchor.href
  ].join(":");
  anchor.click();
}
