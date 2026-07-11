import amqplib from "amqplib";

let connection = null;
let channel = null;

const EXCHANGE_NAME = "new_payment";

export async function connectRabbitmq() {
  if (channel) return channel;

  connection = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
  console.log("Connected to RabbitMQ");

  return channel;
}

export async function publishEvent(routingKey, message) {
  const ch = await connectRabbitmq();
  ch.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
  console.log(`event published: ${routingKey}`);
}

export async function consumeEvent(queueName, routingKey, handler) {
  const ch = await connectRabbitmq();

  await ch.assertQueue(queueName, { durable: true });
  await ch.bindQueue(queueName, EXCHANGE_NAME, routingKey);

  await ch.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await handler(data);
      ch.ack(msg);
    } catch (error) {
      console.error(`Error handling ${routingKey}`, error);
      ch.nack(msg, false, false);
    }
  });

  console.log(`subscribed to ${routingKey} on ${queueName}`);
}

export default publishEvent;