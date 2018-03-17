
class Utility {
    static isoToTwoD(point){
        let cartoPoint = {};
        cartoPoint.x = (2 * point.x + point.y) / 2;
        cartoPoint.y = (2 * point.y - point.y) / 2;
        return cartoPoint;
    }
    static twoDToIso(point){
        let isoPoint = {};
        isoPoint.x = point.x - point.y;
        isoPoint.y = (point.x + point.y) / 2;
        return isoPoint;
    }
}

module.exports = Utility;