class HTTPError extends Error
{
    constructor(message,errorcode)
    {
        super(message);
        this.code=errorcode;
    }
}

module.exports = HTTPError;