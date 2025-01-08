import AWS from "aws-sdk"
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const cognito=new AWS.CognitoIdentityServiceProvider({
    region:process.env.AWS_REGION})
    
    if (!process.env.COGNITO_CLIENT_ID || !process.env.COGNITO_CLIENT_SECRET) {
        throw new Error("Missing required environment variables");
      }
      

const calculateSecretHash = (username:string) => {
    const message = username + process.env.COGNITO_CLIENT_ID!;
    const hmac = crypto.createHmac("sha256", process.env.COGNITO_CLIENT_SECRET!);  
    hmac.update(message); 
    return hmac.digest("base64");  
  };
  


export const register=async(event:any)=>{
    const {username,password,email,phoneNumbers}=JSON.parse(event.body);
    const params={
        ClientId:process.env.COGNITO_CLIENT_ID!,
        Username:username,
        Password:password,
       
        UserAttributes: [
            { Name: "email", Value: email },{Name: "phone_number", Value: phoneNumbers}
          ],
          SecretHash: calculateSecretHash(username),
    }
    try{
        const response=await cognito.signUp(params).promise();
        return{
            statusCode:201,
            body:JSON.stringify({MESSAGE:"user registered successfully",data:response})
        }
        
    }
    catch (error: unknown) {
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

}
export const confirm = async (event:any) => {
    const { username, code } = JSON.parse(event.body);
    const secretHash = calculateSecretHash(username);
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: username,
      ConfirmationCode: code,
      SecretHash: secretHash,
    };
    

    try {
      await cognito.confirmSignUp(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "User confirmed successfully" }),
      };
    }catch (error: unknown) {
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
  
  export const login = async (event:any) => {
    const { username, password } = JSON.parse(event.body);
    const secretHash = calculateSecretHash(username);
    const params = {
     AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,  
      },
    };
  
    try {
      const response = await cognito.initiateAuth(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Login successful",
          
        }),
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

