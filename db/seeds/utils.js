const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};
exports.addIdProperty = (dataArr, lookupObj, idKey, propertyKey) => {
  return dataArr.map((item) => {
    return { ...item, [idKey]: lookupObj[item[propertyKey]] };
  });
}
exports.filterValidComments = function (comments) {
  return comments.filter(comment => {
    return comment.article_id !== null && comment.article_id !== undefined
  });
};


