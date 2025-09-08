
import express, { Request, Response } from 'express';
import UserDetails from '../models/User';
import jwt from 'jsonwebtoken';
import config from "../config";

const router = express.Router();

export const loginUser = async (req: Request, res: Response) => {
    const { UserName, Password } = req.body;
    try {
        const user = await UserDetails.findOne({ UserName });
        if (!user || user.Password !== Password) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign(
            { username: UserName },
            (config.jwtSecret, 'base64'), // Use Base64 buffer if the secret is in Base64
            {
                algorithm: 'HS256',
                expiresIn: '1d'
            }
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export default router;
