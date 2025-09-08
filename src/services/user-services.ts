
import express, { Request, Response } from 'express';
import UserDetails from '../models/User';

const router = express.Router();

export const addUser = async (req: Request, res: Response) => {
    try {
        const { UserName, Password, FirstName, LastName, Mobile,MailId,City,Address,VersionNo} = req.body;

        // Check for missing fields
        const requiredFields = ['UserName', 'Password', 'FirstName', 'LastName', 'Mobile', 'VersionNo'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Some required fields are missing",
                missingFields
            });
        }

        // Add hardcoded values
        const createdBy = UserName;
        const createdDate = Date.now();
        const isActive = true;

        // Create a new user with hardcoded values
        const newUser = new UserDetails({
            UserName,
            Password,
            FirstName,
            LastName,
            Mobile,
            MailId,
            City,
            Address,
            VersionNo,
            CreatedBy: createdBy,
            CreatedDate: createdDate,
            IsActive: isActive
        });

        await newUser.save();

        return res.status(200).json({ message: "User added successfully" });
    } catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const alldata = await UserDetails.find();
        return res.json(alldata);
    } catch (err) {
        console.log(err);
    }
}

export default router;
