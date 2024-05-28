const EXPIRATION_PERIOD_HOURS = 1 / 60;
const expiry = new Date(
    new Date().getTime() + EXPIRATION_PERIOD_HOURS * 3600 * 1000
)

export default expiry