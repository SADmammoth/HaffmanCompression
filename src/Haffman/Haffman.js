import PriorityQueue from "../PriorityQueue";

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

function setCompareFunction(predicate) {
  compare = predicate;
}

function createPriorityQueue(message) {
  //   if (!alphabet.length) {
  //     alphabet = removeDuplicates(message);
  //   }

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

function createTree({ ...priorityQueue }) {
  if (!priorityQueue.length) {
    return priorityQueue;
  }

  let left;
  let right;
  for (let i = 0; i < priorityQueue.length; i++) {
    left = { ...[...priorityQueue][0] };
    right = { ...[...priorityQueue][1] };

    priorityQueue.shift();
    priorityQueue.shift();
    let newItem = {
      priority: left.priority + right.priority,
      data: {
        left,
        right
      }
    };
    priorityQueue.addItem(newItem);
  }
  return priorityQueue.toArray()[0];
}

function breadthFirstTreeTraversal(tree, showElement, onEnd) {
  let root = { ...tree };
  let current = root;
  let result = [];
  let processStack = [];
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
    showElement(current);
    if (!current.data.left && !current.data.right) {
      onEnd(processStack.slice(1), current);
    }
    current = processStack.pop().current;
  } while (processStack.length);
  return result;
}

// function removeDuplicates(array) {
//   return array.filter((element, index) => {
//     return (
//       array.slice(index + 1).findIndex(candidate => {
//         return !compare(candidate, element);
//       }) < 0
//     );
//   });
// }

export default function Haffman(compareChars) {
  if (compareChars) setCompareFunction(compareChars);
  let currentSequence = [];
  let sequences = {};
  return {
    compress: message => {
      console.log(createPriorityQueue(message).toArray());
      breadthFirstTreeTraversal(
        createTree(createPriorityQueue(message)),
        current => {
          console.log(
            current.priority,
            typeof current.data === "object" ? "" : current.data
          );
        },
        (sequence, current) => {
          sequences[current.data] = sequence.map(el => el.value);
        }
      );
      return sequences;
    }
  };
}
