import app from "./index.js";
import dotenv from "dotenv";

dotenv.config();  // Load local .env variables

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Server running locally on http://localhost:${port}`);
});
