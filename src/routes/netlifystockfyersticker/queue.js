// queue.js
class InMemoryQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(item) {
    this.queue.push(item);
  }

  dequeue() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  size() {
    return this.queue.length;
  }

  getAll() {
    return [...this.queue];
  }






  
}

export default new InMemoryQueue(); // singleton
