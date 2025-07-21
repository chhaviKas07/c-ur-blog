class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
  const queryCopy = { ...this.queryStr };
  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((key) => delete queryCopy[key]);

  // Convert category to regex for case-insensitive filter
  if (queryCopy.category) {
    queryCopy.category = { $regex: queryCopy.category, $options: "i" };
  }
  
// if (queryCopy.ratings && (queryCopy.ratings === "null" || queryCopy.ratings === null)) {
//   delete queryCopy.ratings;
// }
// if (queryCopy.price && (queryCopy.price.gte === "null" || queryCopy.price.lte === "null")) {
//   delete queryCopy.price;
// }
["price", "ecoScore", "ratings"].forEach((key) => {
  if (queryCopy[key]) {
    if (typeof queryCopy[key] === "object") {
      const gte = queryCopy[key]["gte"];
      const lte = queryCopy[key]["lte"];
      const range = {};
      if (gte) range.$gte = Number(gte);
      if (lte) range.$lte = Number(lte);
      if (Object.keys(range).length > 0) queryCopy[key] = range;
    } else if (!isNaN(queryCopy[key])) {
      queryCopy[key] = { $gte: Number(queryCopy[key]) };
    }
  }
});
  
// if (queryStr.eco === "true") {
if (this.queryStr.eco === "true") {
  this.query = this.query.find({ isEcoCertified: true });
}
  // Now apply to query
  this.query = this.query.find(queryCopy);
  return this;
}


// let queryStr = JSON.stringify(queryCopy);
// queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
// this.query = this.query.find(JSON.parse(queryStr));
//   return this;
// }


  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
