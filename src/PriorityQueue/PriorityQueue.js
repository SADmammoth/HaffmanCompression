import List from "../List";

function PriorityQueue() {
  let list = new List();

  return {
    addItem: ({ priority, data }) => {
      let nextIndex = list.findIndex(el => {
        return el.priority > priority;
      });

      if (nextIndex < 0) {
        list.addItem({ priority, data });
        return;
      }
      list.insertWithIndex(nextIndex, { priority, data });
    },

    getItemsByPriority: priority => {
      return list.filter(el => {
        return el.priority === priority;
      });
    },

    toArray: () => {
      return list.toArray();
    },
    *[Symbol.iterator]() {
      for (let i = 0; i < list.count; i++) {
        yield list.getItem(i);
      }
    },
    get length() {
      return list.count;
    },
    shift: () => {
      return list.removeHead();
    }
  };
}

export default PriorityQueue;

// function PiorityQueue() {
//   let head = null;

//   return {
//     addItem: (priority, data) => {
//         if(!head){
//             head =
//         }
//     }
//   };
// }

// function PriorityQueueItem(priority, data, nextItem) {
//   return { priority, data, nextItem };
// }
