class MessageQueue {
  constructor() {
    this.queue = [];
  }

  // Add a message to the queue
  enqueue(message) {
    this.queue.push(message);
  }

  // Remove a message from the queue
  dequeue() {
    return this.queue.shift();
  }

  // Peek at the first message in the queue
  peek() {
    return this.queue[0];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.queue.length === 0;
  }
}

export const messageQueue = new MessageQueue();
