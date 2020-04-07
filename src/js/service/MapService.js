import { ChargeTerminal } from '../class/ChargeTerminal.js';
import { Map } from '../class/Map.js';

/**
 * @class
 * A service that provide needed data for the map
 */
class MapService {

    /**
    * @param {ChargeTerminal[]} chargeTerminalList
    * @param {Map} map
    * @param {string} apiEntryPoint
    */

    constructor() {
        this.chargeTerminalList = new Array();
        this.map = new Map(this.chargeTerminalList);
    }

    setEntryPoint(entryPoint) {
        this.apiEntryPoint = entryPoint;
    }

    loadMapDataFrom(url) {
        return new Promise(function(resolve, reject){
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.onload = function(){
                
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(Error("Impossible de charger les données. Code d'erreur: " + request.statusText));
                }

            };
            request.onerror = function() {
                reject(Error("Erreur réseau. Code d'erreur: " + request.statusText));
            };
            request.send();
        });
    }

    setPointDeRechargeList(list) {
        this.chargeTerminalList = list;
    }

    getPointDeRechargeList(id) {
        return this.chargeTerminalList[id];
    }

    getPointDeRechargeListSize() {
        return this.chargeTerminalList.length;
    } 

    getMap() {
        return this.map;
    }

    // TODO some functions to sort the list

}

export { MapService };


