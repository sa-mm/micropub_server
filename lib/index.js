var express = require("express");
var micropub = require("micropub-express");
var logger = require("bunyan-duckling");
var request = require("request");
var bodyParser = require("body-parser");

import handleMicropubDoc from "./micropub_doc_handler";
import { microblogRSS, blogRSS } from "./rss_feed";
import { microblogJSON, blogJSON } from "./json_feed";

var app = express();

// Feeds
app.get("/microblog_rss.xml", microblogRSS);
app.get("/microblog.json", microblogJSON);
app.get("/blog_rss.xml", blogRSS);
app.get("/blog.json", blogJSON);

// Webhook
app.use(bodyParser.json());
app.post("/graphcms_webhook", function(req, res) {
  const { Post: { node } } = req.body.data;
  logger.debug(node, "received a Post");

  request.post(
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: "https://micro.blog/ping",
      body: `url=https://samm-micropub.now.sh/${node.type}.json`
    },
    function(error, response, body) {
      logger.debug(`ping sent for ${node.type} rss`);
    }
  );
});

// Micropub server
// Do some Express magic to support multiple Micropub endpoints in the same application
app.param("targetsite", function(req, res, next, id) {
  // Resolve a token reference from the "targetsite" id and return 404 if you find no match
  if (id === "profile.mcmyler.com") {
    req.targetsite = {
      me: "https://profile.mcmyler.com",
      endpoint: "https://tokens.indieauth.com/token"
    };
    next();
  } else {
    // console.log(req);
    res.sendStatus(404);
  }
});

app.use(
  "/micropub/:targetsite",
  micropub({
    logger: logger, // a logger object that uses the same API as the bunyan module
    userAgent: "samm-micropub/1.0", // a user-agent that will be prepended to the module's own user-agent to indicate
    // to IndieAuth endpoints who it is that makes the verification requests
    tokenReference: function(req) {
      // Find the token reference we added to the request object before and return it
      return req.targetsite;
    },
    // And lastly: Do something with the created micropub document
    handler: handleMicropubDoc
  })
);

// Start the Express server on a port, like port 3000!
app.listen(3002);
