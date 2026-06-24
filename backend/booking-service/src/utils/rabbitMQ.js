import ampq from  'amqplib';

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'new_payment';

async function connectRabbitmq(){
    try {
        connection = await ampq.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "topic", {durable:true} )
        console.log("Connected to RabbitMQ");
    } catch (error) {
        throw error;
    }
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

export default publishEvent;