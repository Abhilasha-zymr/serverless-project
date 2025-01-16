import AWS from "aws-sdk"
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const sns=new AWS.SNS({
    region:process.env.AWS_REGION})
 
// export const createTopic = async (event:any) => {
//         try {
//             const { name } = JSON.parse(event.body); 
//             const params = {
//                 Name: name, 
//             };
    
//             const response = await sns.createTopic(params).promise();
//             return {
//                 statusCode: 201,
//                 body: JSON.stringify({ message: "Topic created successfully", data: response }),
//             };
//         }catch (error: unknown) {
//             if (error instanceof Error) {
//               return {
//                 statusCode: 500,
//                 body: JSON.stringify({ error: error.message }),
//               };
//             } else {
//               return {
//                 statusCode: 500,
//                 body: JSON.stringify({ error: 'An unknown error occurred' }),
//               };
//             }
//           }
//     };
      
// export const subscribeToTopic = async (event:any) => {
//     const {protocol,endpoint} = JSON.parse(event.body);
    
//     const params = {
//       Protocol: protocol, 
//       TopicArn: process.env.TOPIC_ARN!,
//       Endpoint: endpoint,
//     };
  
//     try {
//       const response = await sns.subscribe(params).promise();
//       console.log('Subscription ARN:', response.SubscriptionArn);
//       return {
//         statusCode: 201,
//         body: JSON.stringify({ message: "subscribed successfully", data: response }),
//     };
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
//   };

  export const publishMessage = async (event:any) => {
    const {message,subject} = JSON.parse(event.body);
    const params = {
      TopicArn: process.env.TOPIC_ARN!,
      Message: message, 
       Subject: subject, 
    };
  
    try {
      const result = await sns.publish(params).promise();
      console.log("Message ID:", result.MessageId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Notification sent successfully",
          data: {
            MessageId: result.MessageId
          }
        })
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'An unknown error occurred' }),
        };
      }
    }
  };

  