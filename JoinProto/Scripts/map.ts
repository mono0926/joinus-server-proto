interface String {
    format(...replacements: string[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, (match, number) => (typeof args[number] != 'undefined'
            ? args[number]
            : match));
    };
}

var map;
var locations: MapLocation[];
var baseUrl: string;
var colorTable = [
    'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'];

class MapLocation {
    constructor(public id: number, public latitude: number, public longitude: number, public type: string, public user: User) {
        console.log(this.toString());
    }
    toString() {
        return "{0}: {1}, {2}<br />type: {3}<br />{4}".format(
            this.id.toString(),
            this.latitude.toString(),
            this.longitude.toString(),
            this.type,
            this.user.toString());
    }
    static fromJson(j: any): MapLocation {
        return new MapLocation(j.Id, j.Latitude, j.Longitude, j.Type, User.fromJson(j.User));
    }
}

class User {
    constructor(public id: number, public displayName: string) { }

    toString() {
        return "{0} ({1})".format(this.displayName, this.id.toString());
    }

    static fromJson(j: any): User {
        return new User(j.Id, j.DisplayName);
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.476415, 139.632694),
        zoom: 8
    });
    load("hoge");
}

function load(v: string) {
    jQuery.getJSON(baseUrl + "locations", (ls) => {

        for (var i = 0; i < ls.length; i++) {
            var l = MapLocation.fromJson(ls[i]);
            var latlng = new google.maps.LatLng(l.latitude, l.longitude);
            var marker = new google.maps.Marker({
                position: latlng,
                map: map, title: l.type,
                icon: colorTable[l.user.id % colorTable.length]
            });
            google.maps.event.addListener(marker, 'click', event => {
                new google.maps.InfoWindow({
                    content: l.toString()
                    
                }).open(marker.getMap(), marker);
            });
            console.log(marker);
        }
    });
}

