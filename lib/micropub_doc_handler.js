import gql from "graphql-tag";
var logger = require("bunyan-duckling");

import client from "./graphql_client";
import { extractContent } from "./content";

const handleMicropubDoc = (micropubDoc, req) => {
  logger.debug(
    { micropubDocument: micropubDoc },
    "Received a Micropub document"
  );

  const { properties } = micropubDoc;
  const nameArr = properties.name;
  const name = nameArr.join("");

  const type = name ? "blog" : "microblog";

  const now = new Date();
  const utcDateString = now.toISOString();

  const slugArr = properties["mp-slug"] || [utcDateString];
  const slug = slugArr.join("");

  const content = extractContent(properties.content || []);

  const isPublished = properties["post-status"]
    ? !properties["post-status"].includes("draft")
    : true;

  const mutation = gql`
    mutation CreateNewPost(
      $title: String
      $content: String!
      $slug: String
      $dateAndTime: DateTime!
      $type: String
      $isPublished: Boolean
    ) {
      newPost: createPost(
        title: $title
        slug: $slug
        content: $content
        dateAndTime: $dateAndTime
        type: $type
        isPublished: $isPublished
      ) {
        id
        title
        slug
        content
        dateAndTime
        type
        isPublished
      }
    }
  `;

  const variables = {
    title: name,
    slug,
    content,
    dateAndTime: utcDateString,
    type,
    isPublished
  };

  client
    .mutate({ mutation, variables })
    .then(({ data: newPost }) => {
      console.log(newPost);
    })
    .catch(error => console.error(error));

  return Promise.resolve()
    .then(function() {
      return { url: "https://profile.mcmyler.com" };
    })
    .catch(err => console.log(err));
};

export default handleMicropubDoc;
