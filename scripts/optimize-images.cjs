const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");

const targets = [
  {
    relPath: "src/img/71236a8cc6b04d6a87e15feef63b9cb64728b379.jpg",
    width: 1440,
  },
  {
    relPath: "src/img/71236a8cc6b04d6a87e15feef63b9cb64728b379-2x.jpg",
    width: 2880,
  },
  {
    relPath: "src/img/f160f7810cea23bed860734e12e1a81def3d668a.jpg",
    width: 168,
  },
  {
    relPath: "src/img/f160f7810cea23bed860734e12e1a81def3d668a-2x.jpg",
    width: 336,
  },
  {
    relPath: "src/img/587b8632b7ccf35f98d92322207f124659b97cc6.jpg",
    width: 640,
  },
  {
    relPath: "src/img/587b8632b7ccf35f98d92322207f124659b97cc6-2x.jpg",
    width: 1280,
  },
];

const JPEG_OPTIONS = {
  quality: 70,
  mozjpeg: true,
};

async function optimizeImage({ relPath, width }) {
  const inputPath = path.join(ROOT, relPath);
  const buffer = await sharp(inputPath).resize({ width }).jpeg(JPEG_OPTIONS).toBuffer();
  const tempPath = `${inputPath}.tmp`;
  await fs.writeFile(tempPath, buffer);
  await fs.unlink(inputPath);
  await fs.rename(tempPath, inputPath);
  const sizeKb = (buffer.length / 1024).toFixed(1);
  process.stdout.write(`Optimized ${relPath} -> ${width}px (${sizeKb} KB)\n`);
}

async function run() {
  for (const target of targets) {
    await optimizeImage(target);
  }
}

run().catch((error) => {
  process.stderr.write(`${error}\n`);
  process.exitCode = 1;
});
