
export function authPrams(req, res, next) {
    const params = req.query;
    // console.log(params);
    if (params.access_token && params.userId) {
        next();
    } else {
        res.status(500).json({
            message: "missing user id or access token"
        });
    }
}

export function authBody(req, res, next) {
    const body = req.body;
    if (body.access_token && body.userId) {
        next();
    }
    res.status(500).json({
        message: "missing user id or access token"
    });
}

export function authHeaders(req, res, next) {
    const headers = req.headers;
    if (headers.access_token && headers.userId) {
        next();
    }
    res.status(500).json({
        message: "missing user id or access token"
    });
}