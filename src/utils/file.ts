import * as fs from "fs";

export async function readFile(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, content) => {
      resolve(content);
    });
  });
}

export async function writeFile(path: string, text: string): Promise<void> {
  return new Promise((resolve, reject: any) => {
    fs.writeFile(path, text, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
