export default function List(list) {
  let head;
  let tail;
  let count;

  if (list) {
    head = list.head;
    tail = list.tail;
    count = list.count;
  } else {
    head = null;
    tail = null;
    count = 0;
  }

  function iterateTo(index) {
    let curr = head;
    for (let i = 0; curr; i++) {
      if (i === index) {
        return curr;
      }
      curr = curr.next;
    }
  }

  let thisList = {
    addItem: itemData => {
      const newItem = new Item(itemData);
      if (!head) {
        head = newItem;
        tail = head;
        return newItem;
      }
      tail.next = newItem;
      tail = tail.next;
      count++;
      return newItem;
    },
    map: callback => {
      let curr = head;
      let list = new List();
      for (let i = 0; curr; i++) {
        list.addItem(callback(curr.data, i, thisList));
        curr = curr.next;
      }
      return list;
    },
    forEach: callback => {
      let curr = head;
      for (let i = 0; curr; i++) {
        callback(curr.data, i, thisList);
        curr = curr.next;
      }
    },
    find: predicate => {
      let curr = head;
      for (let i = 0; curr; i++) {
        if (predicate(curr.data, i, thisList)) {
          return curr.data;
        }
        curr = curr.next;
      }
    },
    findIndex: predicate => {
      let curr = head;
      for (let i = 0; curr; i++) {
        if (predicate(curr.data, i, thisList)) {
          return i;
        }
        curr = curr.next;
      }
      return -1;
    },
    filter: predicate => {
      let curr = head;
      let list = new List();
      for (let i = 0; curr; i++) {
        if (predicate(curr.data, i, thisList)) {
          list.addItem(curr);
        }
        curr = curr.next;
      }
      return list;
    },
    *[Symbol.iterator]() {
      let curr = head;
      for (let i = 0; curr; i++) {
        yield curr.data;
        curr = curr.next;
      }
    },
    toArray: () => {
      return [...thisList];
    },
    getItem: index => {
      let item = iterateTo(index);
      return item && item.data;
    },
    get head() {
      return head.data;
    },
    get tail() {
      return tail.data;
    },
    insertWithIndex: (index, itemData) => {
      if (index === count - 1) {
        return thisList.addItem(itemData);
      }
      if (index === 0) {
        return thisList.prependItem(itemData);
      }
      const newItem = new Item(itemData, iterateTo(index - 1).next);
      iterateTo(index - 1).next = newItem;
      count++;
      return newItem;
    },
    prependItem: itemData => {
      const newHead = new Item(itemData, head);
      head = newHead;
      count++;
      return newHead;
    },
    removeItem: index => {
      if (index === 0) {
        return thisList.removeHead();
      }
      if (index === count - 1) {
        return thisList.removeTail();
      }
      const item = iterateTo(index - 1);
      const deleteditem = item.next;
      item.next = deleteditem.next;
      count--;
      return deletedItem;
    },
    removeHead: () => {
      const pastHead = head;
      head = head.next;
      count--;
      return pastHead;
    },
    removeTail: () => {
      const item = iterateTo(count - 2);
      const pastTail = tail;
      item.next = null;
      count--;
      return pastTail;
    },
    get count() {
      return count;
    }
  };

  return thisList;
}

function Item(data, next = null) {
  return { data, next };
}
