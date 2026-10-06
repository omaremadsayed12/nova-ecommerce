const getClientUrl = () => {
  if (process.env.CLIENT_URL) return process.env.CLIENT_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return null;
};

export const getAllowedClientOrigins = () => [
  process.env.CLIENT_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
].filter(Boolean);

export default getClientUrl;
