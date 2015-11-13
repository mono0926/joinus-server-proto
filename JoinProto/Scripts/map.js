var map;
var locations;
var MapLocation = (function () {
    function MapLocation(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    return MapLocation;
})();
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.476415, 139.632694),
        zoom: 8
    });
}
function load(v) {
    jQuery.getJSON("http://localhost:1235/api/locations", function (ls) {
        for (var i = 0; i < ls.length; i++) {
            var l = ls[i];
            var latlng = new google.maps.LatLng(l.Latitude, l.Longitude);
            var marker = new google.maps.Marker({ position: latlng, map: map, title: l.DisplayName });
            console.log(marker);
        }
    });
}
//# sourceMappingURL=map.js.map