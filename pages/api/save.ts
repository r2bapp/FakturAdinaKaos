// File: pages/api/save.ts
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const filePath = path.join(process.cwd(), 'data', 'orders.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const newOrder = req.body;

    // Baca data lama
    let existing = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      existing = JSON.parse(fileData || '[]');
    }

    // Tambah & simpan
    existing.push(newOrder);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    res.status(200).json({ message: 'Invoice saved successfully.' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
