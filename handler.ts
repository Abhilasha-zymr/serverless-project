import { sendEmail } from "./SES";
import {  publishMessage} from "./SNS";
import {  receiveMessage, sendMessage } from "./SQS";
import { register, confirm, login }from "./user"

export const registerHandler=async(event:any)=>{
  return await register(event);
}

export const confirmHandler=async(event:any)=>{
  return await confirm(event);
}

export const login1Handler=async(event:any)=>{
  return await login(event);
}
// export const subscribeToTopicHandler=async(event:any)=>{
//   return await subscribeToTopic(event);
// }

export const publishMessageHandler=async(event:any)=>{
  return await publishMessage(event);
}
// export const createQueueHandler=async(event:any)=>{
//   return await createQueue(event);
// }
export const sendMessageToQueueHandler=async(event:any)=>{
  return await sendMessage(event);
}
export const receiveMessageToQueueHandler=async(event:any)=>{
  return await receiveMessage();
}
export const sendEmailToHandler=async(event:any)=>{
  return await sendEmail(event);
}
