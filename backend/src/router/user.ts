import { Request, Response, Router } from 'express';
import { User, Room } from '../models/schema';
import { date, z } from 'zod';

export const userRoute = Router();



userRoute.post('/', async function (req: Request, res: Response) : Promise<void> {

  
  try {
    const sanatizeUser = z.object({
      username: z.string().toLowerCase().max(20),
      email: z.string().email().max(40),
      password: z.string().max(100),
    });
    const parseduser = sanatizeUser.safeParse(req.body);
    console.log(parseduser);
    
    if (!parseduser.success) {
      res.status(400).json({ error: "Invalid user details" }); 
      return  
    }

  
    const { username, email, password } = parseduser.data!;
  
    const findUser = await User.findOne({ username, email });
  
    if (findUser) {      
     res.status(409).send("user already exists"); 
     return
    }
  
    const user = new User({ username, email, password });
    await user.save();
    res.send({
      message: "user created",
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



