import commonmark from "commonmark";

import { lokkaClient } from "./graphql_client";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

const microblogQuery = `{
  allPosts(last: 20, filter: { isPublished: true, type: "microblog" }) {
    slug
    id
    content
    date: dateAndTime
  }
}`;

export const microblogJSON = (req, res) => {
  const microblog = {
    version: "https://jsonfeed.org/version/1",
    user_comment:
      "This is a microblog feed. You can add this to your feed reader using the following URL: https://example.org/microblog_feed.json",
    title: "samm's microblog",
    home_page_url: "https:/profile.mcmyler.com",
    feed_url: "https:/profile.mcmyler.com/microblog.json",
    author: {
      name: "Sam McMyler",
      url: "https:/profile.mcmyler.com",
      avatar: "https:/profile.mcmyler.com/avatar.png"
    },
    items: []
  };

  lokkaClient
    .query(microblogQuery)
    .then(results => {
      console.log(results.allPosts);
      return results.allPosts;
    })
    .then(posts => {
      microblog.items = posts.map(({ slug, id, content, date }) => {
        const url = `https://profile.mcmyler.com/microblog/${slug}`;
        const parsed = reader.parse(content);
        const html = writer.render(parsed);
        return {
          id,
          url,
          content_html: html,
          date_published: date
        };
      });
      return microblog;
    })
    .then(obj => res.json(obj))
    .catch(err => console.log(err));
};

const blogQuery = `{
  allPosts(last: 20, filter: { isPublished: true, type: "blog" }) {
    id
    title
    content
    slug
    date: dateAndTime
    tags
  }
}`;

export const blogJSON = (req, res) => {
  const blog = {
    version: "https://jsonfeed.org/version/1",
    user_comment:
      "This is a blog feed. You can add this to your feed reader using the following URL: https://profile.mcmyler.com/blog.json",
    title: "samm's microblog",
    home_page_url: "https:/profile.mcmyler.com",
    feed_url: "https:/profile.mcmyler.com/blog.json",
    author: {
      name: "Sam McMyler",
      url: "https:/profile.mcmyler.com",
      avatar: "https:/profile.mcmyler.com/avatar.png"
    },
    items: []
  };

  lokkaClient
    .query(blogQuery)
    .then(results => {
      console.log(results.allPosts);
      return results.allPosts;
    })
    .then(posts => {
      blog.items = posts.map(({ id, title, content, slug, date, tags }) => {
        const url = `https://profile.mcmyler.com/blog/${slug}`;
        const parsed = reader.parse(content);
        const html = writer.render(parsed);

        return {
          id,
          url,
          tags,
          content_html: html,
          date_published: date
        };
      });
      return blog;
    })
    .then(blog => res.json(blog))
    .catch(err => console.log(err));
};
