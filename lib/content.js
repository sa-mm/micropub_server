import { map, filter, has, isObject, isString } from "lodash";

const isHtml = obj => {
  return has(obj, "html");
};

export const extractContent = contentArr => {
  const objects = filter(contentArr, isObject);
  const html = map(filter(objects, isHtml), obj => obj.html);
  const plainText = filter(contentArr, isString);
  return [...html, ...plainText].join(" ");
};
