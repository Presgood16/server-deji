import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../middleware/authmiddleware.js";
import Portrait from "./../models/portraitModel.js";
import { upload } from "../config/cloudinary.js";

const portraitRouter = express.Router();

// GET ALL PORTRAIT PICTURES
portraitRouter.get(
    '/', asyncHandler(async (req, res) => {
    const portrait = await Portrait.find({});
    res.json(portrait);
  }));

// ADMIN GET ALL PORTRAIT PICTURES
portraitRouter.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const portrait = await Portrait.find({}).sort({_id:-1})
      res.json(portrait);
    })
  );
// GET SINGLE PORTRAIT PICTURES
portraitRouter.get(
    '/:id', asyncHandler(async (req, res) => {
    const portrait = await Portrait.findById(req.params.id);
    if (portrait) {
      res.json(portrait);
    } else {
      res.status(404);
      throw new Error("Image not found");
    }
  }));

// DELETE PORTRAIT PICTURES
portraitRouter.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const portrait = await Portrait.findById(req.params.id);
        if (portrait) {
            await portrait.deleteOne({ _id: req.params.id });
            res.json({ message: "Image deleted" });
        } else {
            res.status(404);
            throw new Error("Image not found");
        }
    })
  );
  
// CREATE PORTRAIT PICTURES
portraitRouter.post(
  "/",
  protect,
  admin,
  upload.array('pictures', 30),
  asyncHandler(async (req, res) => {
    const pictures = req.files.map(file => file.path);
    const portraitExist = await Portrait.findOne({ pictures });
    if (portraitExist) {
          res.status(400);
          throw new Error("Image already exists");
      } else {
        const portrait = new Portrait({
          pictures,
          user: req.user._id,
        });
        if(portrait) {
          const createdportrait = await portrait.save();
          res.status(201).json(createdportrait);
        }
        else{
          res.status(400);
          throw new Error("Invalid data");
        }
       
      }
  })
);

export default portraitRouter;
