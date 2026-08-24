import amqp from 'amqplib';

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'new_payment';

async function connectRabbitmq(){
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "topic", {durable:true});
        console.log("connected to rabbitmq");
    } catch (error) {
        console.log("Error connecting RabbitMQ", error);
         throw error;
    }
}

async function consumeEvent(routingKey, callback){
    if(!channel){
        await connectRabbitmq();
    }

    const q = await channel.assertQueue("", {exclusive: true});
    await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
    await channel.consume(q.queue, (msg) => {
        if(msg != null){
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
        }
    })

    console.log("subscribed to event")
}

async function publishEvent(routingKey, message){

    if(!channel){
        await connectRabbitmq();
    }

    channel.publish(
        EXCHANGE_NAME,
        routingKey,
        Buffer.from(JSON.stringify(message))
    );

    console.log("event published")
}

export  {consumeEvent,connectRabbitmq, publishEvent};