import axios from "axios";
import fs from "fs";
import Jimp from "jimp";

/**
 * filterImageFromURL -
 * helper function to download, filter, and save the filtered image locally
 * returns the absolute path to the local image
 * Returns an absolute path to a filtered image locally saved file
 *
 *
 * @param inputURL - a publicly accessible url to an image file
 * @returns an absolute path to a filtered image locally saved file
 */
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const imageBuffer = await getImageBuffer(inputURL);
      const photo = await Jimp.read(imageBuffer);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * getImageBuffer -
 * helper function to get image buffer
 *
 * returns an imagebuffer
 *
 * @param inputURL - a publicly accessible url to an image file
 * @returns an imagebuffer
 */
export async function getImageBuffer(inputURL: string) {
  const image = await axios({
    method: "get",
    url: inputURL,
    responseType: "arraybuffer",
  });
  return image.data;
}

/**
 * deleteLocalFiles
 * helper function to delete files on the local disk
 * useful to cleanup after tasks
 *
 * returns an imagebuffer
 *
 * @param files - Array<string> an array of absolute paths to files
 */
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
