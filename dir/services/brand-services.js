"use strict";
// import express from 'express';
// import Brand, { IBrand } from '../models/Brand';
// import verifyToken from '../verifyToken';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandById = exports.getAllBrands = exports.addBrand = void 0;
// const router = express.Router();
// // POST route to add a new brand
// router.post('/addbrands',verifyToken, async (req, res) => {
//     try {
//         const { BrandId, BrandName } = req.body;
//         // Check if brandname is provided
//         if (!BrandName) {
//             return res.status(400).send("BrandName is required");
//         }
//         let brand: IBrand | null = null;
//         if (BrandId === "0") {
//             // Creating a new brand
//             const latestBrand = await Brand.findOne({}, { BrandId: 1 }, { sort: { BrandId: -1 } });
//             const lastId = latestBrand ? parseInt(latestBrand.BrandId.slice(2)) : 0;
//             const newBrandId = 'BR' + ('0000' + (lastId + 1)).slice(-4);
//             brand = new Brand({ BrandId: newBrandId, BrandName });
//             await brand.save();
//             //console.log("New brand added:", brand);
//             return res.status(200).send("Brand added successfully");
//         } else if (BrandId) {
//             // Updating an existing brand or creating a new one if not found
//             brand = await Brand.findOneAndUpdate({ BrandId }, { BrandName }, { upsert: true, new: true });
//             if (brand) {
//                 //console.log("Brand updated/created:", brand);
//                 return res.status(200).send("Brand updated successfully");
//             } else {
//                 console.log("Failed to update/create brand");
//                 return res.status(500).send("Internal Server Error");
//             }
//         } else {
//             return res.status(400).send("BrandId is required");
//         }
//     } catch (err) {
//         // Handle errors
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// });
// // GET route to get all brands
// router.get('/getallbrands',verifyToken, async (req, res) => {
//     try {
//         const alldata = await Brand.find();
//         return res.json(alldata);
//     } catch (err) {
//         console.log(err);
//     }
// });
// // GET route to get a brand by ID
// router.get('/getbrandsbyId/:BrandId',verifyToken, async (req, res) => {
//     try {
//         const { BrandId } = req.params;
//         // Validate BrandId
//         if (!BrandId) {
//             return res.status(400).send("BrandId parameter is required");
//         }
//         const data = await Brand.findOne({ BrandId });
//         // Check if data is found
//         if (!data) {
//             return res.status(404).send("Brand not found");
//         }
//         // Return the found brand data
//         return res.json(data);
//     } catch (err) {
//         // Handle errors
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// });
// // router.get('/getallbrands/:id',verifyToken, async (req, res) => {
// //     try {
// //         const data = await Brand.findById(req.params.id);
// //         return res.json(data);
// //     } catch (err) {
// //         console.log(err);
// //     }
// // });
// export default router;
const express_1 = __importDefault(require("express"));
const Brand_1 = __importDefault(require("../models/Brand"));
const router = express_1.default.Router();
const addBrand = async (req, res) => {
    try {
        const { BrandId, BrandName } = req.body;
        // Check if brandname is provided
        if (!BrandName) {
            return res.status(400).send("BrandName is required");
        }
        let brand = null;
        if (BrandId === "0") {
            // Creating a new brand
            const latestBrand = await Brand_1.default.findOne({}, { BrandId: 1 }, { sort: { BrandId: -1 } });
            const lastId = latestBrand ? parseInt(latestBrand.BrandId.slice(2)) : 0;
            const newBrandId = 'BR' + ('0000' + (lastId + 1)).slice(-4);
            brand = new Brand_1.default({ BrandId: newBrandId, BrandName });
            await brand.save();
            //console.log("New brand added:", brand);
            return res.status(200).send("Brand added successfully");
        }
        else if (BrandId) {
            // Updating an existing brand or creating a new one if not found
            brand = await Brand_1.default.findOneAndUpdate({ BrandId }, { BrandName }, { upsert: true, new: true });
            if (brand) {
                //console.log("Brand updated/created:", brand);
                return res.status(200).send("Brand updated successfully");
            }
            else {
                console.log("Failed to update/create brand");
                return res.status(500).send("Internal Server Error");
            }
        }
        else {
            return res.status(400).send("BrandId is required");
        }
    }
    catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.addBrand = addBrand;
const getAllBrands = async (req, res) => {
    try {
        const alldata = await Brand_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
    }
};
exports.getAllBrands = getAllBrands;
const getBrandById = async (req, res) => {
    try {
        const { BrandId } = req.params;
        // Validate BrandId
        if (!BrandId) {
            return res.status(400).send("BrandId parameter is required");
        }
        const data = await Brand_1.default.findOne({ BrandId });
        // Check if data is found
        if (!data) {
            return res.status(404).send("Brand not found");
        }
        // Return the found brand data
        return res.json(data);
    }
    catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getBrandById = getBrandById;
exports.default = router;
