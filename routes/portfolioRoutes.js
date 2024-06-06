import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../middleware/authmiddleware.js";
import Portfolio from "./../models/portfolioModel.js";
import multer from "multer";


const portfolioRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Upload files to the 'uploads' directory
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// GET ALL PORTFOLIO
portfolioRouter.get(
    '/', asyncHandler(async (req, res) => {
    const portfolio = await Portfolio.find({});
    res.json(portfolio);
  }));

// ADMIN GET ALL PORTFOLIO
portfolioRouter.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const portfolio = await Portfolio.find({}).sort({_id:-1})
      res.json(portfolio);
    })
  );

// GET SINGLE PORTFOLIO
portfolioRouter.get(
    '/:id', asyncHandler(async (req, res) => {
    const portfolio = await Portfolio.findById(req.params.id);
    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404);
      throw new Error("Project not found");
    }
  }));

// DELETE PORTFOLIO
portfolioRouter.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.id);
        if (portfolio) {
            await portfolio.deleteOne({ _id: req.params.id });
            res.json({ message: "Project deleted" });
        } else {
            res.status(404);
            throw new Error("Project not found");
        }
    })
  );
  
  // CREATE PORTFOLIO
portfolioRouter.post(
    "/",
    protect,
    admin,
    upload.array('pictures', 30),
    asyncHandler(async (req, res) => {
      const { title, category } = req.body;
      const pictures = req.files.map(file => file.path);
      const portfolioExist = await Portfolio.findOne({ title });
      if (portfolioExist) {
            res.status(400);
            throw new Error("Project name already exists");
        } else {
          const portfolio = new Portfolio({
            title,
            category,
            pictures,
            user: req.user._id,
          });
          if(portfolio) {
            const createdportfolio = await portfolio.save();
            res.status(201).json(createdportfolio);
          }
          else{
            res.status(400);
            throw new Error("Invalid project data");
          }
         
        }
    })
  );
  
  // EDIT PORTFOLIO
portfolioRouter.put(
    "/:id",
    protect,
    admin,
    upload.array('pictures', 10),
    asyncHandler(async (req, res) => {
      const { title, category } = req.body;
      const newPictures = req.files.map(file => file.path);
      const portfolio = await Portfolio.findById( req.params.id );
      if (portfolio) {
            portfolio.title = title || portfolio.title;
            portfolio.category = category || portfolio.category;
            portfolio.pictures = newPictures.length > 0 ? newPictures : portfolio.pictures;
  
            const updatedPortfolio = await portfolio.save();
            res.json(updatedPortfolio);
        } else {
          res.status(404);
          throw new Error("Project not found");
        }
    })
  );


export default portfolioRouter;
