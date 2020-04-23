import PriorityQueue from "./PriorityQueue";
import HaffmanCompression from "./HaffmanCompression";
import HaffmanTreeDiagram from "./HaffmanTreeDiagram";
import "./index.css";

(function bind() {
  document.getElementById("submit_input").addEventListener("click", event => {
    let file = document.getElementById("input").files[0];
    readFile(file, text => {
      console.log(text);
      encode(text);
    });
  });

  document.getElementById("submit_encoded").addEventListener("click", event => {
    let file = document.getElementById("encoded").files[0];
    readFile(file, text => {
      console.log(text);
      decode(text);
    });
  });
})();

function readFile(file, onFileLoad) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function(evt) {
    onFileLoad(evt.target.result);
  };
}

async function encode(message) {
  let haffmanCompression = new HaffmanCompression(compare);
  // let message = await (await fetch("input.txt")).text();
  console.time();
  let {
    alphabet,
    alphabetTree,
    compressedMessage
  } = haffmanCompression.compress(message.split(""));
  console.timeLog();
  console.log(alphabetTree);
  drawTree("tree1", alphabet, alphabetTree);

  (function logCompressionPercent() {
    let encodedLength = haffmanText(compressedMessage, alphabet).slice("")
      .length;
    let originallength = unicodeText(message).slice("").length;

    console.log(originallength, encodedLength);
    console.log(((originallength - encodedLength) / originallength) * 100);
  })();

  saveAsFile(haffmanText(compressedMessage, alphabet), "encoded");
}

async function decode(input) {
  let haffmanCompression = new HaffmanCompression(compare);
  // let input = await (await fetch("encoded.txt")).text();
  let { alphabet, message } = parseInput(
    haffmanCompression.getTreeRoot(),
    input
  );

  let {
    alphabetTree,
    alphabet: alphabetArray,
    decompressedMessage
  } = haffmanCompression.decompress(alphabet, message);

  drawTree("tree2", alphabetArray, alphabetTree);
  console.log(decompressedMessage);
  saveAsFile(decompressedMessage.join(""), "output");
}

function compare(inputText, outputText) {
  return inputText === outputText;
}

//

//

//

function drawTree(containerId, alphabet, alphabetTree) {
  let alphabetLength = [...alphabet.keys()].length;
  let treeLevelsCount = alphabetTree.breadthTraversal.length;
  console.log(alphabetLength);
  let diag = new HaffmanTreeDiagram();
  diag.drawTree(containerId, alphabetTree, alphabetLength, treeLevelsCount);
}

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

function parseInput(treeRoot, input) {
  let alphabetLength = parseInt(input.slice(0, 32), 2);
  let maxCharLength = parseInt(input.slice(32, 32 + 6), 2);
  let maxCodeLength = parseInt(
    input.slice(32 + 6, 32 + 6 + alphabetLength.toString(2).length),
    2
  );

  let skip = 32 + 6 + alphabetLength.toString(2).length;
  let limit = (maxCharLength + maxCodeLength) * alphabetLength;

  let alphabet = createAlphabet(
    treeRoot,
    input.slice(skip, skip + limit),
    alphabetLength,
    maxCharLength,
    maxCodeLength
  );

  let message = input.slice(skip + limit);
  return { alphabet, message };
}

function createAlphabet(
  tree,
  encodedAlphabet,
  aphabetLength,
  maxCharLength,
  maxCodeLength
) {
  let char;
  let code;

  let skip = 0;

  for (let i = 0; i < aphabetLength; i++) {
    char = String.fromCharCode(
      parseInt(encodedAlphabet.slice(skip, skip + maxCharLength), 2)
    );
    code = encodedAlphabet.slice(
      skip + maxCharLength,
      skip + maxCharLength + maxCodeLength
    );

    tree.createPath(
      tree,
      char,
      parseInt(code, 2)
        .toString(2)
        .slice(1)
    );

    skip = skip + maxCharLength + maxCodeLength;
  }
  return tree;
}
