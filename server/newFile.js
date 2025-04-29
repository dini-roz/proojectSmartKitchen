const { index } = require(".");

//index.use("/api/auth",require("./router/authRoutes"))
index.use("/api/auth", require("./routes/authRoutes"));
