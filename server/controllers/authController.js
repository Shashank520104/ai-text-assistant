import {signupService} from "../services/authService.js";

export const signupController=async(req ,res)=>
{
    try 
    {
        const result = await signupService(req.body);

        return res.status(201).json({
            success:true,
            message:"User registred Succesfully ",
            data:result,
        });
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:error.message,
        });
    }
};

export const loginController=async(req , res)=>
{
    try 
    {
        const result =await loginService(req.body);

        return res.status(200).json({
            success:true,
            message:"loginSuccesfull",
            data:result,
        });
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:error.message,
        });
    }
};

