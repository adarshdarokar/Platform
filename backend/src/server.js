import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connecDB } from "./lib/db.js";
import cors from "cors";
import {serve} from "inngest/express"

const app = express();
const __dirname = path.resolve();

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is working" });
});

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL,
   credentials: true
   }));


app.use("/api/inngest", serve({client:inngest, functions }))


app.get("/book", (req, res) => {
  res.status(200).json({ msg: "book api is working" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log("server is running on port:", ENV.PORT);
  connecDB();
});

const startServer = async () => {
  try {
    await connecDB();
    app.listen(ENV.PORT, () => {
      console.log("server is running on port:", ENV.PORT);
    });
  } catch (error) {
    console.log("💀❌error starting the server:", error);
  }
};
