const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
// const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: "70500f3c12823f42248785f4ada5e710-us14",
  server: "us14",
});

app.post("/", (req, res) => {
  const listId = "cae0387040";

  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const newSubscriberData = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  async function run() {
    const response = await mailchimp.lists.batchListMembers(listId, newSubscriberData);
    if (response.error_count ===0) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();

});

app.post("/failure", (req, res) => {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000.");
});


// API KEY
// 70500f3c12823f42248785f4ada5e710-us14

// Audience id
// cae0387040

// URL
// https://us14_SERVER.api.mailchimp.com/3.0/lists/
