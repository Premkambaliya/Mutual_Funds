import mongoose from "mongoose";
import dns from "dns";

const USER_DB_URI = process.env.MONGODB_URI_USERS || process.env.MONGODB_URI;
const COMPANY_DB_URI = process.env.MONGODB_URI_COMPANY || process.env.MONGODB_URI;
const USER_DB_NAME = process.env.MONGODB_USER_DB_NAME || "mutualfunds";
const COMPANY_DB_NAME = process.env.MONGODB_COMPANY_DB_NAME || "mutualfund";

if (!USER_DB_URI) {
  throw new Error("Please define MONGODB_URI_USERS (or MONGODB_URI) in .env.local");
}

if (!COMPANY_DB_URI) {
  throw new Error("Please define MONGODB_URI_COMPANY (or MONGODB_URI) in .env.local");
}

let userConnection = null;
let userConnectionPromise = null;
let companyConnection = null;
let companyConnectionPromise = null;

const SRV_DNS_FALLBACK = ["8.8.8.8", "1.1.1.1"];

const shouldRetryWithDnsFallback = (error) => {
  return (
    error?.code === "ECONNREFUSED" &&
    String(error?.syscall || "").includes("querySrv")
  );
};

const withSrvFallback = async (connectFn) => {
  try {
    return await connectFn();
  } catch (error) {
    if (!shouldRetryWithDnsFallback(error)) {
      throw error;
    }

    dns.setServers(SRV_DNS_FALLBACK);
    return connectFn();
  }
};

export const dbConnect = async () => {
  if (userConnection) return userConnection;

  if (!userConnectionPromise) {
    userConnectionPromise = withSrvFallback(() =>
      mongoose.connect(USER_DB_URI, { dbName: USER_DB_NAME })
    )
      .then((mongooseInstance) => {
        userConnection = mongooseInstance.connection;
        console.log(`✅ User DB connected (${USER_DB_NAME})`);
        return userConnection;
      })
      .catch((error) => {
        userConnectionPromise = null;
        console.error("❌ User DB connection failed:", error.message);
        throw error;
      });
  }

  return userConnectionPromise;
};

export const dbConnectCompany = async () => {
  if (companyConnection) return companyConnection;

  if (!companyConnectionPromise) {
    companyConnectionPromise = withSrvFallback(() =>
      mongoose.createConnection(COMPANY_DB_URI, { dbName: COMPANY_DB_NAME }).asPromise()
    )
      .then((conn) => {
        companyConnection = conn;
        console.log(`✅ Company DB connected (${COMPANY_DB_NAME})`);
        return companyConnection;
      })
      .catch((error) => {
        companyConnectionPromise = null;
        console.error("❌ Company DB connection failed:", error.message);
        throw error;
      });
  }

  return companyConnectionPromise;
};

export const getCompanyFundModel = async () => {
  const companyDb = await dbConnectCompany();

  if (companyDb.models.Fund) {
    return companyDb.models.Fund;
  }

  const fundSchema = new mongoose.Schema({
    scheme_code: { type: Number, required: true, unique: true },
    scheme_name: { type: String },
    fund_house: { type: String },
    scheme_type: { type: String },
    scheme_category: { type: String },
    isin: { type: String },
    latest_nav: { type: Number },
    latest_nav_date: { type: String },
    raw_meta: { type: Object },
    last_updated: { type: Date, default: Date.now },
  });

  return companyDb.model("Fund", fundSchema);
};
