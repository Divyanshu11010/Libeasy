const EXPIRATION_PERIOD_HOURS = process.env.EXPIRATION_PERIOD_HOURS || 148;
const expiry = new Date(
    new Date().getTime() + EXPIRATION_PERIOD_HOURS * 3600 * 1000
)

export default expiry