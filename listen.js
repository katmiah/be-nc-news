const express = require("express")
const { PORT = 9090 } = process.env
const app = express()

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });