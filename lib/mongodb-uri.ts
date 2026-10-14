export function getMongoDbUri(): string {
  if (process.env.NODE_ENV === "production") {
    const uri = process.env.MONGODB_URI_PRO?.trim();

    if (!uri) {
      throw new Error("MONGODB_URI_PRO is missing");
    }

    return uri;
  }

  const uri = (process.env.MONGODB_URI_DEV ?? process.env.MONGODB_URI)?.trim();

  if (!uri) {
    throw new Error(
      "MONGODB_URI_DEV is missing. Set MONGODB_URI_DEV or MONGODB_URI for development."
    );
  }

  return uri;
}
