import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ai-city-simulator',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'ai-city-group' });

const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();
};

export { kafka, producer, consumer, connectKafka };
