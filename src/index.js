import PriorityQueue from './PriorityQueue';
import HaffmanCompression from './HaffmanCompression';
import HaffmanTreeDiagram from './HaffmanTreeDiagram';
import './index.css';

(function bind() {
  document.getElementById('submit_input').addEventListener('click', event => {
    let file = document.getElementById('input').files[0];
    readFile(file, text => {
      console.log('Input chars count: ' + text.length);
      encode(text);
    });
  });

  document.getElementById('submit_encoded').addEventListener('click', event => {
    let file = document.getElementById('encoded').files[0];
    readFile(file, text => {
      decode(text);
    });
  });

  document.getElementById('tree1_scaler').addEventListener('change', event => {
    scaleTree('tree1', event.target.value);
  });
  document.getElementById('tree2_scaler').addEventListener('change', event => {
    scaleTree('tree2', event.target.value);
  });
})();

function readFile(file, onFileLoad) {
  var reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  reader.onload = function(evt) {
    onFileLoad(evt.target.result);
  };
}

async function encode(message) {
  let haffmanCompression = new HaffmanCompression(compare);

  console.time('Compression time');
  let {
    alphabet,
    alphabetTree,
    compressedMessage
  } = haffmanCompression.compress(message.split(''));
  console.timeLog('Compression time');
  console.timeEnd('Compression time');

  drawTree('tree1', alphabet, alphabetTree);
  (function logCompressionPercent() {
    let encodedLength = haffmanText(compressedMessage, alphabet).length;
    let originalLength = unicodeText(message).length;

    console.log('Length in unicode (binary): ' + originalLength);
    console.log(
      'Length of compressed in binary: ' +
        compressedMessage.flat().join('').length
    );
    console.log(
      'Length of compressed with alphabet in binary: ' + encodedLength
    );

    console.log(
      'Compressed by percent: ' +
        (((originalLength - encodedLength) / originalLength) * 100).toFixed(2)
    );
  })();

  saveAsFile(haffmanText(compressedMessage, alphabet), 'encoded');
}

async function decode(input) {
  let haffmanCompression = new HaffmanCompression(compare);
  let { alphabet, message } = parseInput(
    haffmanCompression.getTreeRoot(),
    input
  );

  console.time('Decompression time');
  let {
    alphabetTree,
    alphabet: alphabetArray,
    decompressedMessage
  } = haffmanCompression.decompress(alphabet, message);
  console.timeLog('Decompression time');
  console.timeEnd('Decompression time');

  drawTree('tree2', alphabetArray, alphabetTree);

  compareFiles(decompressedMessage.join(''), () =>
    saveAsFile(decompressedMessage.join(''), 'output')
  );
}

function compareFiles(output, doAfter) {
  if (document.getElementById('input').value) {
    if (confirm('Compare input and output?')) {
      let file = document.getElementById('input').files[0];
      readFile(file, text => {
        if (text === output) {
          console.log('Output and input are equal');
          alert('Output and input are equal');
        } else {
          console.log('Output and input are NOT equal');
          alert('Output and input are NOT equal');
        }
      });
    }
  }
  if (doAfter) {
    doAfter();
  }
}

function compare(inputText, outputText) {
  if (inputText === outputText) {
    return 0;
  } else if (inputText < outputText) {
    return -1;
  }
  return 1;
}

//

//

//

function drawTree(containerId, alphabet, alphabetTree) {
  let alphabetLength = [...alphabet.keys()].length;
  let treeLevelsCount = alphabetTree.breadthTraversal.length;
  let diag = new HaffmanTreeDiagram();
  document.getElementById(containerId).innerHTML = '';
  document.getElementById(containerId + '_header').style.display = 'block';
  diag.drawTree(containerId, alphabetTree, alphabetLength, treeLevelsCount);
}

function scaleTree(containerId, value) {
  let svg = document.getElementById(containerId).children[0];
  svg.setAttribute('width', (svg.getAttribute('defaultWidth') * value) / 100);
  svg.setAttribute('height', (svg.getAttribute('defaultHeight') * value) / 100);
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
        .padStart(maxLength[0], '0') +
      ('1' + alphabet.get(char).join('')).padStart(maxLength[1] + 1, '0')
    );
  });

  return (
    stringifiedAlphabet.length.toString(2).padStart(32, '0') +
    maxLength[0].toString(2).padStart(6, '0') +
    (maxLength[1] + 1)
      .toString(2)
      .padStart(stringifiedAlphabet.length.toString(2).length, '0') +
    stringifiedAlphabet.join('') +
    message.flat().join('')
  );
}

function unicodeText(message) {
  return message
    .split('')
    .map(char => {
      return char.charCodeAt(0).toString(2);
    })
    .join('');
}

function saveAsFile(content, filename, doAfter) {
  const blob = new Blob([content], { type: 'text/text' });
  const anchor = document.createElement('a');

  anchor.download = filename + '.txt';
  anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
  anchor.dataset.downloadurl = [
    'text/plain',
    anchor.download,
    anchor.href
  ].join(':');
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
