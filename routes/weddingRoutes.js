import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../middleware/authmiddleware.js";
import Wedding from "./../models/weddingModel.js";
import { upload } from "../config/cloudinary.js";

const weddingRouter = express.Router();

// GET ALL WEDDING PICTURES
weddingRouter.get(
    '/', asyncHandler(async (req, res) => {
    const wedding = await Wedding.find({});
    res.json(wedding);
  }));

// ADMIN GET ALL WEDDING PICTURES
weddingRouter.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const wedding = await Wedding.find({}).sort({_id:-1})
      res.json(wedding);
    })
  );
// GET SINGLE WEDDING PICTURES
weddingRouter.get(
    '/:id', asyncHandler(async (req, res) => {
    const wedding = await Wedding.findById(req.params.id);
    if (wedding) {
      res.json(wedding);
    } else {
      res.status(404);
      throw new Error("Image not found");
    }
  }));

// DELETE WEDDING PICTURES
weddingRouter.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const wedding = await Wedding.findById(req.params.id);
        if (wedding) {
            await wedding.deleteOne({ _id: req.params.id });
            res.json({ message: "Image deleted" });
        } else {
            res.status(404);
            throw new Error("Image not found");
        }
    })
  );
  
// CREATE WEDDING PICTURES
weddingRouter.post(
  "/",
  protect,
  admin,
  upload.array('pictures', 30),
  asyncHandler(async (req, res) => {
    const pictures = req.files.map(file => file.path);
    const weddingExist = await Wedding.findOne({ pictures });
    if (weddingExist) {
          res.status(400);
          throw new Error("Image already exists");
      } else {
        const wedding = new Wedding({
          pictures,
          user: req.user._id,
        });
        if(wedding) {
          const createdwedding = await wedding.save();
          res.status(201).json(createdwedding);
        }
        else{
          res.status(400);
          throw new Error("Invalid data");
        }
       
      }
  })
);


export default weddingRouter;
