/**
 * @class Address.js
 * Describe what is a base address for GreenTurismo App
 */

 class Address {

    /**
     * @param {string} roadName
     * @param {string} zipCode
     * @param {string} city
     * @param {number} latitude
     * @param {number} longitude
     */

     constructor(roadName, zipCode, city, latitude, longitude) {
        this.roadName = roadName;
        this.zipCode = zipCode;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
     }

     getRoadName() { return this.roadName; }
     getZipCode() { return this.zipCode; }
     getCity() { return this.city; }
     getLatitude() { return this.latitude; }
     getLongitude() { return this.longitude; }

 }

 export { Address };