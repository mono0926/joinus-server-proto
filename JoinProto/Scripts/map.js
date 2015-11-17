if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) { return (typeof args[number] != 'undefined'
            ? args[number]
            : match); });
    };
}
var map;
var locations;
var baseUrl;
var targetDate;
var colorTable = [
    'http://maps.google.com/mapfiles/ms/icons/yellow.png',
    'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/red.png',
    'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/blue.png',
    'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/green.png',
    'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/purple.png',
    'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'];
var MapLocation = (function () {
    function MapLocation(id, latitude, longitude, type, time, user) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.time = time;
        this.user = user;
        console.log(this.toString());
    }
    MapLocation.prototype.toString = function () {
        return "{0}: {1}, {2}<br />type: {3}<br />{4}<br />{5}".format(this.id.toString(), this.latitude.toString(), this.longitude.toString(), this.type, this.user.toString(), this.time.toString());
    };
    MapLocation.fromJson = function (j) {
        return new MapLocation(j.Id, j.Latitude, j.Longitude, j.Type, j.Time, User.fromJson(j.User));
    };
    return MapLocation;
})();
var User = (function () {
    function User(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }
    User.prototype.toString = function () {
        return "{0} ({1})".format(this.displayName, this.id.toString());
    };
    User.fromJson = function (j) {
        return new User(j.Id, j.DisplayName);
    };
    return User;
})();
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.65597440083904, 139.6530764476981),
        zoom: 10
    });
    load("hoge");
}
function load(v) {
    locations = [];
    var url = baseUrl + "locations";
    if (targetDate != null && targetDate.length > 0) {
        url = "{0}?date={1}".format(url, targetDate);
    }
    jQuery.getJSON(url, function (ls) {
        for (var i = 0; i < ls.length; i++) {
            var l = MapLocation.fromJson(ls[i]);
            var latlng = new google.maps.LatLng(l.latitude, l.longitude);
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                icon: colorTable[l.user.id % (colorTable.length / 2) * 2 + (l.type == 'significant_change' ? 0 : 1)]
            });
            bindInfoWindow(marker, l.toString());
        }
    });
}
function bindInfoWindow(marker, description) {
    google.maps.event.addListener(marker, 'click', function () {
        new google.maps.InfoWindow({
            content: description
        }).open(map, marker);
    });
}
//# sourceMappingURL=map.js.map