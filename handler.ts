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
