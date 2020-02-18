/**
 * @class ChargeTerminal.js
 * Describe what a charge terminal is
 */
class ChargeTerminal {

    /**
     * @param {string} name
     * @param {Address} address
     * @param {number} plugNumber
     */

     constructor(name, address, plugNumber) {
        this.name = name;
        this.address = address;
        this.plugNumber = plugNumber;
     }

     getName() { return this.name; }
     getAddress() { return this.address; }
     getPlugNumber() { return this.plugNumber; }

}

export { ChargeTerminal };