// SEARCH.JS
// TEAM 48 - GOVHACK 2013 
// RELEASED UNDER CREATIVE COMMONS LICENSE


var searchparams = null
var lat, long
var pg = 1
var donesearch = false
var num = 0
var map
var mapOptions
var rightid = 0
var geocoder = new google.maps.Geocoder();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var markersArray = [];
google.maps.visualRefresh = true;

function receiver() {

}

function pagenext(pg) {
    $.ajax({
        url: "http://govhack.atdw.com.au/productsearchservice.svc/products?key=278965474541&out=json&latlong=" + lat + "," + long + " &dist=" + searchparams + "&pge=" + pg,
        dataType: 'json'
    }).done(function (data) {
        console.log(data)
        num += data.products.length
        document.getElementById('numerator').innerHTML = num
        for (var i = 0; i < data.products.length; i++) {
            document.getElementById('short').innerHTML += "<div class='result'><img src='" + data.products[i].productImage +
            "' alt='product image' /><div class='resultDetails'><div class='title'>"
            + data.products[i].productName + "</div><div class='details'>" + data.products[i].productCategoryId + "<p>"
            + data.products[i].distanceToLocation + "Km<p> Map route </p></div><div class='more' onclick='showMore(  &quot;" + data.products[i].productId + "&quot; )'> > </div></div></div>"
        }

    });
}

function getPictures(data) {

    var pictures = new Array();

    for (var i = 0; i < data.length; i++) {
        pictures[i] = data[i].serverPath
    }

    return pictures
}

function getCatagories(data) {

    var catagories = new Array();

    /*for (var i = 0; i < data.length; i++) {
        catagories[i] = data[i].productTypeDescription
    }*/

    return catagories
}

function showMore(id) {

    document.getElementById('load').style.display = 'block'

    $.ajax({
        url: "http://govhack.atdw.com.au/productsearchservice.svc/product?key=278965474541&out=json&productid=" + id,
        dataType: 'json'
    }).done(function (data) {
        document.getElementById('load').style.display = 'none'
        // log data out
        console.log(data)
        rightid++

        var output = ""

        // store data in local variables
        var name = data.productName
        var area = data.areaName
        var city = data.cityName
        var description = data.productDescription
        var children = data.childrenCataredForFlag
        var childrenText = data.childrenCateredForText
        var disabled = data.disabledAccessFlag
        var disabledText = data.disabledAccessText
        var freeEntry = data.freeEntryFlag
        var pictures = data.multimedia
        try {
            var open = data.openTimes[0].openTimeText
        }
        catch (err) {
            console.log(err)
        }
        var catagories = data.varticalClassifications

        addMap( data.addresses[0].geocodeGdaLatitude, data.addresses[0].geocodeGdaLongitude, rightid, name)
        //add to window if not null
        output += "<div class='moreInfo' id='" + rightid + "'><div class='title'>" + data.productName + " <div class='map' onclick='removeMap(" + rightid + "); getElementById(&quot;" + rightid + "&quot;).style.display = &quot;none&quot;'>Remove</div></div><div class='body'><div class='imageCol'>"

        for (var i = 0; i < pictures.length; i++) {
            if (pictures[i].attributeIdMultimediaContent == "IMAGE")
                output += "<img src='" + pictures[i].serverPath + "' alt='picture of the venue' width='150px'/>"
        }

        output += "</div><div class='description'>"

        if (area != undefined && description != null)
            output += "<div class='title'>Area</div><div class='text'>" + area + "</div>"

        if (city != undefined && city != null)
            output += "<div class='title'>City</div><div class='text'>" + city + "</div>"

        if (childrenText != undefined && childrenText != null)
            output += "<div class='title'>Children</div><div class='text'>" + childrenText + "</div>"

        if (disabledText != undefined && disabledText != null)
            output += "<div class='title'>Universal Access</div><div class='text'>" + disabledText + "</div>"

        if (open != undefined && open != null)
            output += "<div class='title'>Times</div><div class='text'>" + open + "</div>"

        if (description != undefined && description != null)
            output += "<div class='title'>Description</div><div class='text'>" + description + "</div>"

        if (catagories != undefined) {
            output += "<div class='title'>Catagories</div><div class='text'>"
            for (var i = 0; i < catagories.length; i++) {
                output += catagories[i].productTypeDescription + "<p>"
            }
            output += "</div>"
        }

        output += "</div>"
        document.getElementById('long').innerHTML += output
    });
}

// not today potato
/*function getDirections() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var places = {}
    for (var i = 0; i < markersArray.length; i++) {
        if (markersArray[i] != null && markersArray[i] != undefined) {
            alert(markersArray[i].position)
            places[i].position = markersArray[i].position
        }
    }

    var request = {
        origin: new google.maps.LatLng(places[0].position.jb, places[0].position.kb),
        destination: new google.maps.LatLng(places[places.length].position.jb, places[places.length].position.kb),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });

    directionsDisplay.setMap(map)
}*/


function addMap(latitude, longitude, id, title, name) {
    
    mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map.setOptions(mapOptions)
    
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: name,
        position: new google.maps.LatLng(latitude, longitude)
    });

    markersArray.push(marker)

    var lat = latitude
    var lng = longitude
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                
                //alert(results[1].formatted_address);
                //infowindow.open(map, marker);
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    })
    
}

function showMap() {
    google.maps.event.trigger(map, "resize")
    map.setCenter(mapOptions.center);
    document.getElementById('map').style.visibility = 'visible'
}

function removeMap(id) {
    markersArray[id-1].setMap(null)
    map.setOptions(mapOptions)
}

function geosearch(position) {

    console.log(position.coords.latitude + ", " + position.coords.longitude)
    console.log(searchparams)

    lat = position.coords.latitude
    long = position.coords.longitude

    $.ajax({
        url: "http://govhack.atdw.com.au/productsearchservice.svc/products?key=278965474541&out=json&latlong=" + lat + "," + long + " &dist=" + searchparams + "&size=25",
        dataType: 'json'
    }).done(function (data) {
        console.log(data)
        document.getElementById('load').style.display = 'none'
        num += data.products.length
        document.getElementById('showing').style.display = 'block'
        document.getElementById('numerator').innerHTML = num
        document.getElementById('denominator').innerHTML = data.numberOfResults

        document.getElementById('short').innerHTML = ""
        for (var i = 0; i < data.products.length; i++) {
            document.getElementById('short').innerHTML += "<div class='result'><img src='" + data.products[i].productImage +
            "' alt='product image' /><div class='resultDetails'><div class='title'>"
            + data.products[i].productName + "</div><div class='details'>" + data.products[i].productCategoryId + "<p>"
            + data.products[i].distanceToLocation + "Km<p> Map route </p></div><div class='more' onclick='showMore(  &quot;" + data.products[i].productId + "&quot; )'> > </div></div></div>"
        }

    });
}

function search(params) {

    document.getElementById('load').style.display = 'block'

    var option = document.getElementById('filter').value
    num = 0
    if (option == 1) {
        searchparams = params
        navigator.geolocation.getCurrentPosition(geosearch)
        donesearch = true
    }
    else if (option == 2) {
        searchparams = params
        navigator.geolocation.getCurrentPosition(catsearch)
        donesearch = true
    }
}

function catsearch(position) {

    console.log(position.coords.latitude + ", " + position.coords.longitude)
    console.log(searchparams)

    lat = position.coords.latitude
    long = position.coords.longitude

    $.ajax({
        url: "http://govhack.atdw.com.au/productsearchservice.svc/products?key=278965474541&out=json&latlong=" + lat + "," + long + " &cats=" + searchparams + "&size=25",
        dataType: 'json'
    }).done(function (data) {
        console.log(data)
        document.getElementById('load').style.display = 'none'
        num += data.products.length
        document.getElementById('showing').style.display = 'block'
        document.getElementById('numerator').innerHTML = num
        document.getElementById('denominator').innerHTML = data.numberOfResults

        document.getElementById('short').innerHTML = ""
        for (var i = 0; i < data.products.length; i++) {
            document.getElementById('short').innerHTML += "<div class='result'><img src='" + data.products[i].productImage +
            "' alt='product image' /><div class='resultDetails'><div class='title'>"
            + data.products[i].productName + "</div><div class='details'>" + data.products[i].productCategoryId + "<p>"
            + data.products[i].distanceToLocation + "Km<p> Map route </p></div><div class='more' onclick='showMore(  &quot;" + data.products[i].productId + "&quot; )'> > </div></div></div>"
        }

    });
}

$(document).ready(function () {
    $('#short').scroll(function () {
        if ($('#short').scrollTop() + $('#short').height() >= ((10 * pg) * 80)) {
            if (donesearch) {
                pg++
                pagenext(pg)
            }
        }
    })

    if (document.getElementById('q').innerHTML != null && document.getElementById('q').innerHTML != undefined && document.getElementById('q').innerHTML != '') {
        search(document.getElementById('q').innerHTML)
    }

    mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $('#filter').change(function () {
        var filter = document.getElementById('filter').value

        if (filter == 2) {
            document.getElementById('field').innerHTML = "<select id='params'><option value='ACCOMM'>Accomodation</option><option value='ATTRACTION'>Attraction</option><option value='EVENT'>Event</option><option value='HIRE'>Hire</option><option value='JOURNEY'>Journey</option><option value='RESTAURANT'>Restaurant</option><option value='TOUR'>Tour</option><option value='TRANSPORT'>Transport</option></select>"
        }

        if (filter == 1) {
            document.getElementById('field').innerHTML = "<input type='text' placeholder='Distance Kms' id='params' onkeypress='if (event.keyCode==13){search(this.value)}'>"
        }
    })

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
});
