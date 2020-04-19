import PriorityQueue from './PriorityQueue';
import HaffmanCompression from './HaffmanCompression';

(async () => {
  let haffmanCompresion = new HaffmanCompression();
  let message = await (await fetch('input.txt')).text();
  console.time();
  let result = haffmanCompresion.compress(message.split(''));
  console.timeLog();
  console.log(
    ((unicodeText(message).slice('').length -
      haffmanText(result.compressedMessage, result.alphabet).slice('').length) /
      unicodeText(message).slice('').length) *
      100
  );
  saveAsFile(haffmanText(result.compressedMessage, result.alphabet), 'encoded');
})();

function haffmanText(message, alphabet) {
  let stringifiedAlphabet = Object.entries(alphabet)
    .map(([char, code]) => {
      return char.charCodeAt(0).toString(2) + code.join('');
    })
    .join('');
  return stringifiedAlphabet + message.flat().join('');
}

function unicodeText(message) {
  return message
    .split('')
    .map(char => {
      return char.charCodeAt(0).toString(2);
    })
    .join('');
}

function saveAsFile(content, filename) {
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
