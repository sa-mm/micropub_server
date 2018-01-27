import handleMicropubDoc from "../lib/micropub_doc_handler";

const micropubDoc = {
  properties: {
    name: ["Again"],
    content: [
      {
        html: "<p>But</p>\\n<p>multiline</p>\\n<p>has problems</p>"
      }
    ],
    "mp-slug": ["multiline4"],
    "post-status": ["draft"]
  },
  type: ["h-entry"]
};

handleMicropubDoc(micropubDoc, {});
