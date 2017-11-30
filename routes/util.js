Util = {};
Util.getQuery = function (query) {
    return {
        oldest: query.oldest === undefined ? new Date('2015-12-12T17:00:00Z') : new Date(req.query.oldest),
        newest: query.newest === undefined ? new Date() : new Date(req.query.newest),
        limit: query.limit === undefined ? 10 : parseInt(query.limit),
        skip: query.skip === undefined ? 0 : parseInt(query.skip)
    }
}

// get token out of header
Util.getToken = function (headers) {
    if (!headers || !headers.authorization) {
        return null;
    }
    var parted = headers.authorization.split(' ');
    if (parted.length !== 2) {
        return null;
    }
    return parted[1];
};

module.exports = Util;