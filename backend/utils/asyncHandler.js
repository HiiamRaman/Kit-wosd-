export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log("\n\n\n\n", err?.response?.data || err?.response || err);
    res.status(500).json({ message: "Internal Server Error" });
  });
};
