import { put, del } from "@vercel/blob";
import fs from "fs";
import path from "path";

interface StorageProvider {
  saveFile: (filename: string, data: Buffer | Blob) => Promise<string>;
  deleteFile: (fileUrl: string) => Promise<void>;
}

class LocalStorageProvider implements StorageProvider {
  private PUBLIC_DIR = path.join(process.cwd(), "public");
  private UPLOADS_DIR = path.join(this.PUBLIC_DIR, "uploads");

  constructor() {
    if (!fs.existsSync(this.UPLOADS_DIR)) {
      fs.mkdirSync(this.UPLOADS_DIR, { recursive: true });
    }
  }

  async saveFile(filename: string, data: Buffer | Blob): Promise<string> {
    const uniqueFilename = `${Date.now()}-${filename}`;
    const filePath = path.join(this.UPLOADS_DIR, uniqueFilename);

    if (data instanceof Blob) {
      const buffer = Buffer.from(await data.arrayBuffer());
      await fs.promises.writeFile(filePath, buffer);
    } else {
      await fs.promises.writeFile(filePath, data);
    }

    return `/uploads/${uniqueFilename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl.startsWith("/uploads/")) return;

    const filename = fileUrl.split("/uploads/")[1];
    const filePath = path.join(this.UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

class VercelStorageProvider implements StorageProvider {
  async saveFile(filename: string, data: Buffer | Blob): Promise<string> {
    const blob = data instanceof Blob ? data : new Blob([data]);
    const { url } = await put(filename, blob, { access: "public" });
    return url;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    await del(fileUrl);
  }
}

const storage: StorageProvider =
  process.env.NODE_ENV === "development"
    ? new LocalStorageProvider()
    : new VercelStorageProvider();

export default storage;
