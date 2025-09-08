"use strict";
// import mongoose, { Schema, Document } from "mongoose";
// export interface IFarmer extends Document {
//     FarmerId: string;
//     FarmerName: string;
//     Mobile: string;
//     Dob: Date;
//     PotentialFarmer: string;
//     PotentialFarmerValue: string;
//     LatLong: string;
//     Lattitude: string;
//     Longitude: string;
//     Photo: string;
//     PhotoOrg: string ;
//     FarmerLocalId: string;
//     JsonData: {
//         FarmerName: string;
//         Mobile: string;
//         Dob: Date;
//         TotalLandHolding: string;
//         L5Id: string;
//         PotentialFarmer: string;
//         PotentialFarmerValue: string;
//         LatLong: string;
//         Photo: string;
//         FarmerLocalId: string;
//         Lattitude: string;
//         Longitude: string;
//         LocalCreatedDate: Date;
//     };
//     IsSync: boolean;
//     SyncedDate: Date;
//     IsActive: boolean;
//     AllowEdit: boolean;
//     CreatedBy: string;
//     CreatedDate: Date;
//     LocalCreatedDate: Date;
//     UpdatedBy: string ;
//     UpdatedDate: Date ;
//     TotalAcres: string;
// }
// const JsonDataSchema: Schema = new Schema({
//     FarmerName: { type: String },
//     Mobile: { type: String },
//     Dob: { type: Date },
//     TotalLandHolding: { type: String },
//     L5Id: { type: String },
//     PotentialFarmer: { type: String },
//     PotentialFarmerValue: { type: String },
//     LatLong: { type: String },
//     Photo: { type: String, default: "" },
//     FarmerLocalId: { type: String },
//     Lattitude: { type: String },
//     Longitude: { type: String },
//     LocalCreatedDate: { type: Date }
// });
// const FarmerSchema: Schema = new Schema({
//     _id: { type: mongoose.Types.ObjectId, required: true },
//     FarmerId: { type: String, required: true, unique: true },
//     FarmerName: { type: String, required: true },
//     Mobile: { type: String, required: true },
//     Dob: { type: Date, required: true },
//     PotentialFarmer: { type: String, required: true },
//     PotentialFarmerValue: { type: String, required: true },
//     LatLong: { type: String, required: true },
//     Lattitude: { type: String, required: true },
//     Longitude: { type: String, required: true },
//     Photo: { type: String, default: "" },
//     PhotoOrg: { type: String, default: null },
//     FarmerLocalId: { type: String, required: true },
//     JsonData: { type: JsonDataSchema, required: true },
//     IsSync: { type: Boolean, required: true },
//     SyncedDate: { type: Date, default: new Date(0) },
//     IsActive: { type: Boolean, required: true },
//     AllowEdit: { type: Boolean, required: true },
//     CreatedBy: { type: String, required: true },
//     CreatedDate: { type: Date, required: true },
//     LocalCreatedDate: { type: Date, required: true },
//     UpdatedBy: { type: String, default: null },
//     UpdatedDate: { type: Date, default: null },
//     TotalAcres: { type: String, required: true }
// });
// const Farmer = mongoose.model<IFarmer>("Farmer", FarmerSchema, 'Farmer');
// export default Farmer;
