const connectToMongo = require("./db");

connectToMongo();

const express = require("express");
const cors = require("cors");
const app = express();
const port = 2800;

app.use(cors());
app.use(express.json());

// available routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/auth", require("./routes/auth/createuser"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`iNotebook backend listening on port ${port}`);
});
