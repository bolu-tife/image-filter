import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import fs from "fs";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      const { image_url } = req.query;
      if (!image_url) {
        res.status(400).send("image_url is required");
      }

      const filteredPath = await filterImageFromURL(image_url);
      res
        .status(200)
        .sendFile(filteredPath, () => deleteLocalFiles([filteredPath]));
    } catch (error) {
      res.status(422).send("Error on image processing");
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
