import { writeFileSync } from "fs";
import gql from "graphql-tag";
const RSS = require("rss");
import commonmark from "commonmark";

import { lokkaClient } from "./graphql_client";

const microblogQuery = `{
  allPosts(last: 20, filter: { isPublished: true, type: "microblog" }) {
    slug
    guid: id
    description: content
    date: dateAndTime
  }
}`;

export const microblogRSS = (req, res) => {
  const microblogFeed = new RSS({
    title: "samm's microblog",
    description: "This is an rss feed for profile.mcmyler.com's microblog",
    feed_url: "https://samm-microblog.now/microblog_rss.xml",
    site_url: "https://profile.mcmyler.com",
    image_url: "http://localhost:5000/graphcms_logo.png",
    managingEditor: "samm",
    webMaster: "samm",
    copyright: "2018 samm",
    language: "en",
    pubDate: Date(),
    ttl: 60
  });

  lokkaClient
    .query(microblogQuery)
    .then(results => {
      console.log(results.allPosts);
      return results.allPosts;
    })
    .then(posts => {
      posts.forEach(({ slug, ...post }) => {
        microblogFeed.item({
          ...post,
          title: "",
          url: `https://profile.mcmyler.com/microblog/${slug}`
        });
      });
    })
    .then(() => {
      return microblogFeed.xml({ indent: true });
    })
    .then(xml => {
      res.set("Content-Type", "application/rss+xml");
      res.send(xml);
    })
    .catch(error => console.log(error));
};

export const blogRSS = (req, res) => {
  const blogFeed = new RSS({
    title: "samm's blog",
    description: "This is an rss feed for profile.mcmyler.com's blog",
    feed_url: "https://samm-microblog.now/blog_rss.xml",
    site_url: "https://profile.mcmyler.com",
    image_url: "http://localhost:5000/graphcms_logo.png",
    managingEditor: "samm",
    webMaster: "samm",
    copyright: "2018 samm",
    language: "en",
    pubDate: Date(),
    ttl: 60
  });

  const blogQuery = `{
      allPosts(last: 20, filter: { isPublished: true, type: "blog" }) {
        guid: id
        title
        description: content
        slug
        date: dateAndTime
        tags
      }
    }`;

  lokkaClient
    .query(blogQuery)
    .then(results => {
      console.log(results.allPosts);
      return results.allPosts;
    })
    .then(posts => {
      posts.forEach(({ slug, ...post }) => {
        blogFeed.item({
          ...post,
          url: `https://profile.mcmyler.com/blog/${slug}`
        });
      });
    })
    .then(() => {
      return blogFeed.xml();
    })
    .then(xml => {
      res.set("Content-Type", "application/rss+xml");
      res.send(xml);
    })
    .catch(err => console.log(err));
};
