

import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUserDetails extends Document {
    UserId: string;
    UserName: string;
    FirstName: string;
    LastName: string;
    Mobile: string;
    MailId: string;
    City: string;
    Address: string;
    Password: string;
    IsActive: boolean;
    VersionNo: string;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate: Date;
}

const UserDetailsSchema: Schema<IUserDetails> = new Schema<IUserDetails>({
    UserName: { type: String, required: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Mobile: { type: String, required: true },
    MailId: { type: String },
    City: { type: String },
    Address: { type: String },
    Password: { type: String, required: true },
    IsActive: { type: Boolean},
    VersionNo: { type: String },
    CreatedBy: { type: String },
    CreatedDate: { type: Date},
    UpdatedBy: { type: String },
    UpdatedDate: { type: Date }
});

const UserDetails: Model<IUserDetails> = mongoose.model<IUserDetails>('UserDetails', UserDetailsSchema, 'UserDetails');

export default UserDetails;
