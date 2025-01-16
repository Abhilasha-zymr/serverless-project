import AWS from "aws-sdk"
import dotenv from "dotenv";
dotenv.config();
const sqs = new AWS.SQS({ region: process.env.AWS_REGION});

// export const createQueue = async (event:any) => {
//     try {
//         const { queueName } = JSON.parse(event.body); 
//         const params = {
//             QueueName : queueName , 
//         };

//         const response = await sqs.createQueue(params).promise();
//         return {
//             statusCode: 201,
//             body: JSON.stringify({ message: "queue created successfully", data: response }),
//         };
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return {
//           statusCode: 500,
//           body: JSON.stringify({ error: error.message }),
//         };
//       } else {
//         return {
//           statusCode: 500,
//           body: JSON.stringify({ error: 'An unknown error occurred' }),
//         };
//       }
//     }
// };


export const sendMessage= async(event:any)=> {
    try{
        const{message}=JSON.parse(event.body);
        const params={
            
            MessageBody:message,
            QueueUrl: process.env.QUE_URL!,
            
        }
        const response = await sqs.sendMessage(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Message sent successfully",
        data: response,
      }),
    };
     }
     catch (error) {
      console.error("Error in message:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: (error as Error).message }),
      };
    }
}

export const receiveMessage=async()=>{
  try {
    const params = {
      QueueUrl: process.env.QUE_URL!,
      MaxNumberOfMessages: 10, 
      WaitTimeSeconds: 10, 
    };

    const response = await sqs.receiveMessage(params).promise();
    if (response.Messages) {
      for (const message of response.Messages) {
        console.log("Message Received:", message.Body);
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Messages processed successfully" }),
      };
   }
  }
  catch (error) {
    console.error("Error in message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
 }




