import PriorityQueue from '../PriorityQueue';

let compare = (left, right) => {
  if (left === right) {
    return 0;
  }
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
};

export default function HaffmanCompression(compareChars) {
  if (compareChars) setCompareFunction(compareChars);

  let tree = {};
  return {
    compress: message => {
      let alphabet = createTree(createPriorityQueue(message));
      let sequences = new Map();

      depthFirstTreeTraversal(
        alphabet,
        () => {},
        (sequence, current) => {
          sequences.set(
            current.data,
            sequence.map(el => el.value)
          );
        }
      );

      return {
        alphabetTree: {
          ...alphabet,
          breadthTraversal: breadthFirstTreeTraversal(alphabet)
        },
        alphabet: sequences,
        compressedMessage: compression(message, sequences)
      };
    },
    getTreeRoot: () => {
      return {
        data: {},
        createPath,
        followPath
      };
    },
    decompress: (alphabetTree, message) => {
      let decompressedMessage = decompress(message, alphabetTree);
      let sequences = new Map();

      depthFirstTreeTraversal(
        alphabetTree,
        () => {},
        (sequence, current) => {
          sequences.set(
            current.data,
            sequence.map(el => el.value)
          );
        }
      );

      return {
        alphabetTree: {
          ...alphabetTree,
          breadthTraversal: breadthFirstTreeTraversal(alphabetTree)
        },
        alphabet: sequences,
        decompressedMessage
      };
    }
  };
}

function setCompareFunction(predicate) {
  compare = predicate;
}

function createPriorityQueue(message) {
  let counts = {};
  message.forEach(char => {
    if (!counts[char]) {
      counts[char] = 1;
    } else {
      counts[char]++;
    }
  });

  let priorityQueue = new PriorityQueue();
  Object.entries(counts).forEach(([char, count]) => {
    priorityQueue.addItem({ priority: count, data: char });
  });

  return priorityQueue;
}

function createTree(priorityQueue) {
  let tree = { ...priorityQueue };
  if (!tree.length) {
    return tree;
  }

  let left;
  let right;
  for (let i = 0; [...tree].length; i++) {
    left = { ...tree.toArray()[0] };
    right = { ...tree.toArray()[1] };
    tree.shift();
    tree.shift();
    let newItem = {
      priority: left.priority + right.priority,
      data: {
        left,
        right
      }
    };
    tree.addItem(newItem);
  }
  let root = tree.toArray()[0];
  root.priority = root.data.left.priority + root.data.right.priority;
  return root;
}

function depthFirstTreeTraversal(tree, showElement, onLeaf) {
  let root = { ...tree };
  let current = root;
  let result = [];
  let processStack = [root];
  do {
    if (current.data.left && result.indexOf(current.data.left) < 0) {
      processStack.push({ value: 0, current });
      current = current.data.left;
      continue;
    }
    if (current.data.right && result.indexOf(current.data.right) < 0) {
      processStack.push({ value: 1, current });
      current = current.data.right;
      continue;
    }

    result.push(current);
    showElement && showElement(current);
    if (!current.data.left && !current.data.right) {
      onLeaf(processStack.slice(1), current);
    }
    current = processStack.pop().current;
  } while (processStack.length);
  return result;
}

function breadthFirstTreeTraversal(tree) {
  let root = { ...tree };
  let result = [[]];
  let processStack = [root];
  let i = 0;
  while (processStack.length) {
    processStack = processStack
      .map(element => {
        result[i] = [];
        result[i].push(element);
        let arr = [];
        if (element.data.left) {
          arr.push(element.data.left);
        }
        if (element.data.right) {
          arr.push(element.data.right);
        }
        return arr;
      })
      .flat();
    i++;
  }
  return result;
}

function compression(message, alphabet) {
  return message.map(char => {
    let key = [...alphabet.keys()].find(candidate => {
      return !compare(candidate, char);
    });
    return alphabet.get(key);
  });
}

function createPath(root, leafValue, path) {
  let curr = root;
  for (let i = 0; i < path.length; i++) {
    if (path[i] === '0') {
      if (curr.data && curr.data.left) {
        curr = curr.data.left;
      } else {
        curr.data.left = { priority: '', data: {} };
        curr = curr.data.left;
      }
    }
    if (path[i] === '1') {
      if (curr.data && curr.data.right) {
        curr = curr.data.right;
      } else {
        curr.data.right = { priority: '', data: {} };
        curr = curr.data.right;
      }
    }
    if (i === path.length - 1) {
      curr.data = leafValue;
    }
  }
  return root;
}

function followPath(start, path) {
  let curr = start;
  for (let i = 0; i < path.length; i++) {
    if (!curr.data.left && !curr.data.right) {
      return {};
    }
    if (path[i] === '0') {
      curr = curr.data.left;
    }

    if (path[i] === '1') {
      curr = curr.data.right;
    }
  }
  return curr;
}

function decompress(message, alphabetTree) {
  let decodedMessage = [];
  let found = null;

  for (let i = 0; i < message.length; i++) {
    if (found) {
      found = followPath(found, message[i]);
    } else {
      found = followPath(alphabetTree, message[i]);
    }
    if (!found.data.left && !found.data.right) {
      decodedMessage.push(found.data);
      found = null;
    }
  }
  return decodedMessage;
}
