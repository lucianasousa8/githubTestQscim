const axios = require("axios");
const { config } = require("./config");

const api = axios.create({
  timeout: 10 * 1000,
});

const successStatus = [200, 201, 204];

// ----------------------------------------------------------------
// filtering urls used for requests
const getFilteredUrls = (req) => {
  const urls = config.urls;

  let rawGatewayIndexes = [];
  let filteredIndexes = [];

  // transforming string into array
  if (typeof req.query.gateway === "string") {
    rawGatewayIndexes = [req.query.gateway];
  }

  // filtering indexes according to length of url Array
  filteredIndexes = rawGatewayIndexes
    ?.map((item) => item - 1)
    .filter((item) => item <= urls.length - 1);

  // filtering urls if there is selected gateways
  return filteredIndexes.length
    ? urls.filter((item, index) => filteredIndexes.includes(index))
    : urls;
};

// ----------------------------------------------------------------
// making request with axios and formmating response
const makeRequest = async (req, baseUrl) => {
  let url = `${baseUrl.url}/${req.params["0"]}`;
  try {
    return await api
      .request({
        url: url,
        method: req.method,
        headers: { Authorization: req.headers.authorization },
      })
      .then((res) => {
        return { url, status: res.status, data: res.data };
      })
      .catch((err) => {
        const status = err.response.status;
        return {
          url,
          type: baseUrl.type,
          status: status,
          error: err.response.data,
        };
      });
  } catch (err) {
    return { url, type: baseUrl.type, status: 500, error: err };
  }
};

// ----------------------------------------------------------------
// format success response
const formatResponse = (results) => {
  // returning list if there is resources at results
  if (results[0]?.Resources) {
    let total = 0;
    let resources = [];
    results.forEach((item) => {
      total += item?.Resources.length;
      resources.push(...item?.Resources);
    });

    return {
      Resources: resources,
      totalResults: total,
      itemsPerPage: total,
      startIndex: 1,
      schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    };
    // returning first object if there are no resources at results
  } else {
    return results[0];
  }
};

// ----------------------------------------------------------------
// function called in each request
const gateway = async (req, res) => {
  const urls = getFilteredUrls(req);

  const promises = urls.map(async (item) => await makeRequest(req, item));
  const requests = await Promise.all(promises);

  let results = [];
  let errors = [];
  requests.forEach((item) => {
    if (!successStatus.includes(item.status)) {
      errors.push(item);
    } else {
      results.push(item.data);
    }
  });

  if (errors.length) {
    res.status(errors[0].status).json({
      message: `Request failed in  ${errors.length} item(s)`,
      errors: errors,
    });
  } else {
    let response = formatResponse(results);
    res.status(200).json(response);
  }
};

// ----------------------------------------------------------------
// function called in each request
const getGatewayList = async (req, res) => {
  const urls = config.urls;

  const response = urls.map((item, index) => ({ ...item, index: index + 1 }));

  res.status(200).json(response);
};

module.exports = { gateway, getGatewayList };
