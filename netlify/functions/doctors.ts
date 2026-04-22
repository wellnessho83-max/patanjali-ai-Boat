import { Handler } from "@netlify/functions";
import axios from "axios";
import * as cheerio from "cheerio";

export const handler: Handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Support cross-origin if needed
      },
      body: JSON.stringify({ doctors, onLeave, lastUpdated: new Date().toISOString() }),
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch live doctor list" }),
    };
  }
};
