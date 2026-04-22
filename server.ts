import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route to fetch and parse available doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const response = await axios.get("https://patanjaliwellness.com/doctor-list.php", {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const $ = cheerio.load(response.data);
      
      const doctors: any[] = [];
      const onLeave: any[] = [];

      // Parse Available Doctors
      $("#availableDoctors .doctor-card").each((_, element) => {
        const name = $(element).find("h3").text().trim();
        const dept = $(element).find(".dept").text().trim();
        const opd = $(element).find(".opd b").text().trim();
        const time = $(element).find(".card-body .time").text().replace(/Time:\s*/i, "").trim();
        const breakTime = $(element).find(".card-body .Break").text().replace(/Break:\s*/i, "").trim();

        if (name) {
          doctors.push({ 
            name, 
            dept, 
            opd, 
            time, 
            breakTime,
            status: "Available" 
          });
        }
      });

      // Parse Doctors on Leave
      $("#leaveDoctors .doctor-card").each((_, element) => {
        const name = $(element).find("h3").text().trim();
        const dept = $(element).find(".dept").text().trim();
        const opd = $(element).find(".opd b").text().trim();
        if (name) {
          onLeave.push({ name, dept, opd, status: "On Leave" });
        }
      });

      res.json({ doctors, onLeave, lastUpdated: new Date().toISOString() });
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: "Failed to fetch live doctor list" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
