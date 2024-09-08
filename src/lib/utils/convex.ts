import { api } from '../../../convex/_generated/api'
import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '' // Set a default value if the environment variable is undefined
const convex = new ConvexHttpClient(convexUrl);

export { convex, api }
