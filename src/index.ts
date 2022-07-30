import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { encode } from 'blurhash';
import { Canvas, loadImage } from 'canvas';

// Genrate blurhash from storageLocation
export async function genrateBlurhash(storageLocation: string): Promise<string> {
  if (storageLocation) {
    const fileBucket = process.env.GCLOUD_PROJECT + '.appspot.com';
    if (fileBucket) {
      logger.info(`Image storageLocation: ${storageLocation}`);
      logger.info(`File bucket: ${fileBucket}`);

      const fileName = storageLocation.substring(storageLocation.lastIndexOf('/') + 1);
      const dir = storageLocation.replace('/' + fileName, '');
      logger.log(storageLocation, dir, fileName);

      // download file to memory
      const bucket = admin.storage().bucket();
      const tempFilePath = path.join(os.tmpdir(), fileName);
      logger.log('fileName', fileName);
      // download the file from bucket to tmp disk
      try {
        logger.log('Downloading file to tmp disk', tempFilePath);
        const upRes = await bucket.file(storageLocation).download({ destination: tempFilePath });
        logger.info('UP_RES', JSON.stringify(upRes));
        logger.log('file has been downloaded to :', tempFilePath);
      } catch (error) {
        logger.log('err at download bucket', error);
      }

      const imageWidth = 1000;
      const imageHeight = 1000;

      const canvas = new Canvas(imageWidth, imageHeight);
      const context = canvas.getContext('2d');
      const myImg = await loadImage(tempFilePath);
      context.drawImage(myImg, 0, 0);
      const imageData = context.getImageData(0, 0, imageWidth, imageHeight);
      const hash = encode(imageData.data, imageWidth, imageHeight, 5, 5);
      fs.unlinkSync(tempFilePath);
      return hash;
    } else {
      throw new Error('No bucket found');
    }
  } else {
    throw new Error('StorageLocation not valid');
  }
}
