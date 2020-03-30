/**
 * @class Map.js
 * Describe what is a map
 */
class Map {

    /**
    * @param {any} map
    */

    constructor() {}

    render() {

        this.map = L.map('gtMap').setView([46.8181124, 2.4826541], 6);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1IjoiZW56b2NvbnRpbmhvIiwiYSI6ImNrNmkyYjVzdjFnM3IzZW52N21ydmgydG8ifQ.t2TaKZvtBCCrGvyLM2UjJA"
        }).addTo(this.map);

    }

    addMarker(latitude, longitude) {
        L.marker([latitude, longitude]).addTo(this.map);
    }

    getMap() {
        return this.map;
    }

}

export { Map };