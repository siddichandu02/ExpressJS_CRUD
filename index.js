import "dotenv/config";
// File: index.js
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextid = 1;

app.post("/tea", (req, res) => {
  const { name, price } = req.body;
  const newTea = {
    id: nextid++,
    name,
    price,
  };

  teaData.push(newTea);
  res.status(201).json(newTea);
});

app.get("/teas", (req, res) => {
  res.status(200).json(teaData);
});

app.get("/tea/:id", (req, res) => {
  const teaId = parseInt(req.params.id, 10);
  const tea = teaData.find((t) => t.id === teaId);

  if (!tea) {
    return res.status(404).json({ error: "Tea not found" });
  }

  res.status(200).json(tea);
});

app.delete("/tea/:id", (req, res) => {
  const teaId = parseInt(req.params.id, 10);
  const teaIndex = teaData.findIndex((t) => t.id === teaId);

  if (teaIndex === -1) {
    return res.status(404).json({ error: "Tea not found" });
  }

  const deletedTea = teaData.splice(teaIndex, 1);
  res.status(200).json(deletedTea[0]);
});
app.put("/tea/:id", (req, res) => {
  const teaId = parseInt(req.params.id, 10);
  const { name, price } = req.body;
  const teaIndex = teaData.findIndex((t) => t.id === teaId);

  if (teaIndex === -1) {
    return res.status(404).json({ error: "Tea not found" });
  }

  const updatedTea = { ...teaData[teaIndex], name, price };
  teaData[teaIndex] = updatedTea;

  res.status(200).json(updatedTea);
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}...`);
});
