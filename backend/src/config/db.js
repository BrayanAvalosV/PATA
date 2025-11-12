import mongoose from "mongoose";
import { config } from "dotenv";
config();

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI no está definido en .env");
  process.exit(1);
}

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  });

export default mongoose;
