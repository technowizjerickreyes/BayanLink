import express from "express";
import {
  addMunicipality,
  browseMunicipalities,
  deleteMunicipality,
  editMunicipality,
  readMunicipality,
} from "../controllers/municipalityController.js";

const router = express.Router();

router.get("/", browseMunicipalities);
router.get("/:id", readMunicipality);
router.post("/", addMunicipality);
router.put("/:id", editMunicipality);
router.delete("/:id", deleteMunicipality);

export default router;
