let serviceHealth = true

const getHealth = () => serviceHealth;
const setHealth = (health) => serviceHealth = health;
module.exports = {
    getHealth,
    setHealth
}