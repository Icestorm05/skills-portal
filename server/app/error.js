module.exports = class Error {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}