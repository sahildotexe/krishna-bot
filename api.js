const express = require("express");
const { MessagingResponse } = require("twilio").twiml;
const complete = require("./bot");

const app = express();
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.post("/whatsapp", async (req, res) => {
  let answer;
  const incomingWhatsappMsg = req.body.Body;
  const twiml = new MessagingResponse();

  try {
    answer = await complete(incomingWhatsappMsg);
    twiml.message(answer);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
