import AWS from "aws-sdk"
import dotenv from "dotenv";
dotenv.config();
const ses = new AWS.SES({ region: process.env.AWS_REGION});

export const sendEmail=async(event:any)=>{
    try{
    const {toAddress,subject,body}=JSON.parse(event.body)
    const params={
        Destination: {
            ToAddresses: [toAddress],
          },
          Message: {
            Body: {
              Text: { Data: body },
            },
            Subject: { Data: subject },
          },
         Source: process.env.SOURCE_EMAIL! // Ensure SOURCE_EMAIL is verified in SES (sandbox requires verification)
    }
        const result = await ses.sendEmail(params).promise();
        console.log("Email sent successfully:", result);
        return {
            statusCode: 200,
            body: JSON.stringify({
              message: "Email sent successfully",
              result,
            }),
          };
        } catch (error) {
          console.error("Error sending email:", error);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as Error).message }),
          };
        }
    }
