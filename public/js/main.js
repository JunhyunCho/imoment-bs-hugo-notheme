import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";

console.log(sites);


let map, popup, Popup;
let pinLocations;

function preloadImage(url) {
    const img = new Image();
    img.src = url;
}

preloadImage('blue_pin.png');


var myCarousel = document.querySelector('#myCarousel');
var carousel = new bootstrap.Carousel(myCarousel, {
    interval: 1000,
    wrap: false
});
//add eventListener to carousel
myCarousel.addEventListener('slide.bs.carousel', function (event) {
    //get the index of the slide
    var index = event.to;
    //get the slide itself
    //console.log(event.relatedTarget.id);
    map.panTo(pinLocations[index].position);
    pinLocations[index].marker.dropMarkerAnimation();


});


/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// Initialize and add the map
async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
    );
    map = new Map(document.getElementById("map"), {
        zoom: 10.5,
        center: { lat: 37.56717, lng: 126.98190 },
        disableDefaultUI: true,
        gestureHandling: "greedy",
        mapId: "bf275fc383452ffe",
    });


    pinLocations = sites;


    // Create an info window to share between markers.
    const infoWindow = new InfoWindow({
        maxWidth: 200,
        pixelOffset: new google.maps.Size(0, -10) // 위치를 약간 위로 조정
    });

    //add map event listner when map is clicked or moved
    map.addListener("drag", () => {
        infoWindow.close();
        console.log("map dragged");
    });

    map.addListener("click", () => {
        infoWindow.close();
        console.log("map clicked");

    });

    // Create the markers.
    const markers = pinLocations.map(({ position, title }, i) => {
        //pinLocations.forEach(({ position, title }, i) => {
        const pin = new PinElement({
            glyph: `${i + 1}`,
        });

        const marker = new AdvancedMarkerElement({
            position,
            map,
            title: `${title}`,
            // title: `${i + 1}. ${title}`,
            //content: pin.element,
            content: buildContent(pinLocations[i]), //custom pin. html. pinLocations[i] is sites[] and it has markdown contents, title and position

        });

        function buildContent(property) {
            const content = document.createElement("div");
            var temp_address = "../.." + property.link + "pin.png";

            const circle_radius = 22;

            // content.innerHTML = `
            //     <svg width="${circle_radius * 2}" height="${circle_radius * 2}">
            //         <circle cx="${circle_radius}" cy="${circle_radius}" r="${circle_radius}" fill="#2050B0" />
            //     </svg>
            // `;

            content.innerHTML = `
                <div class="icon">
                    <img src="blue_pin.png" alt="${property.title}" style="width: 30px;" />
                </div>
            `;

            return content;
        }

        pinLocations[i].marker = marker;

        // Add a click listener for each marker, and set up the info window.
        marker.addListener("click", ({ domEvent, latLng }) => {
            const contentString =
                '<div id="content" style="color:black ">' +
                `<a href="${pinLocations[i].link}" style="text-decoration:none; color:inherit; ">` +
                `<h6 class="mb-0">${marker.title}</h6>` +
                "</a>" +
                "</div>";

            console.log(pinLocations[i]);
            infoWindow.close();
            infoWindow.setContent(contentString);
            infoWindow.open(marker.map, marker);

            //console.log("Marker clicked", target, latLng.toJSON());
            //move center of the map to latLng
            map.panTo(latLng);
            //slide carousel card to the right index
            carousel.to(i);
            //console.log("carousel index", i);

            /*
            //if popup is not null
            if (popup)
                popup.setMap(null);

            popup = new Popup(
                new google.maps.LatLng(latLng),
                //convert contentString to DOM element
                new DOMParser().parseFromString(contentString, "text/html").body
                //document.getElementById("content"),
            );
            popup.setMap(map);
            */
        });

        //add marker animation
        dropMarkerAnimation();


        function dropMarkerAnimation() {
            const intersectionObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("breath");
                        intersectionObserver.unobserve(entry.target);
                    }
                }
            });

            const content = marker.content;

            content.style.opacity = "0";
            content.addEventListener("animationend", (event) => {
                content.classList.remove("breath");
                content.style.opacity = "1";

                //content.style.setProperty("--delay-time", 5 + "s");
                //intersectionObserver.observe(content);
            });

            content.style.setProperty("--delay-time", 0.2 + "s");
            intersectionObserver.observe(content);
        }
        marker.dropMarkerAnimation = dropMarkerAnimation;

        return marker;

    });

    //renderer for marker clusters

    const renderer = {
        render: ({ count, position }) =>
            new google.maps.Marker({
                icon: {
                    url: 'blue_pin.png',
                    scaledSize: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15)
                },
                label: { text: String(count), color: "white", fontSize: "10px" },
                position,
                // adjust zIndex to be above other markers
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            }),
    };

    const onClusterClickHandler = (event, cluster, map) => {

        const markers = cluster.markers;
        console.log(`Cluster clicked with ${markers.length} markers`);

        const bounds = new google.maps.LatLngBounds();
        for (const marker of markers) {
            bounds.extend(marker.position);
        }

        // Get the current bounds' corners
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const expandValue = 0.0005;
        // Create new corners for the expanded bounds
        const newNe = { lat: ne.lat() + expandValue, lng: ne.lng() + expandValue };
        const newSw = { lat: sw.lat() - expandValue, lng: sw.lng() - expandValue };

        // Set the map's bounds to the expanded bounds
        bounds.extend(newNe);
        bounds.extend(newSw);

        map.fitBounds(bounds);
        // const targetZoom = map.getZoom() + 5;  // Adjust the target zoom level as needed
        // const targetCenter = bounds.getCenter();

        // smoothZoom(map, targetZoom, targetCenter);

    };

    const smoothZoom = (map, targetZoom, targetCenter) => {
        const currentZoom = map.getZoom();
        if (currentZoom !== targetZoom) {
            google.maps.event.addListenerOnce(map, 'zoom_changed', () => {
                smoothZoom(map, targetZoom, targetCenter);
            });
            setTimeout(() => map.setZoom(currentZoom + (targetZoom > currentZoom ? 1 : -1)), 80);  // Adjust the timeout value to change the speed of the zoom
        } else {
            map.panTo(targetCenter);  // This will move the map to the new center smoothly
        }
    };





    const markerCluster = new MarkerClusterer({
        markers,
        map,
        renderer,
        onClusterClick: onClusterClickHandler
    });


    // Add the click event listener
    //markerCluster.addListener("click", onClusterClickHandler);


    // google.maps.event.addListener(markerCluster, 'click', function (cluster) {
    //     //map.setCenter(cluster.getCenter());  // center the map on the clicked cluster
    //     //map.setZoom(20);  // set the zoom level to 10
    //     console.log("cluster clicked");
    // });


    // not used
    class Popup extends google.maps.OverlayView {
        position;
        containerDiv;
        constructor(position, content) {
            console.log(content);
            super();
            this.position = position;
            content.classList.add("popup-bubble");

            // This zero-height div is positioned at the bottom of the bubble.
            const bubbleAnchor = document.createElement("div");

            bubbleAnchor.classList.add("popup-bubble-anchor");
            bubbleAnchor.appendChild(content);
            // This zero-height div is positioned at the bottom of the tip.
            this.containerDiv = document.createElement("div");
            this.containerDiv.classList.add("popup-container");
            this.containerDiv.appendChild(bubbleAnchor);
            // Optionally stop clicks, etc., from bubbling up to the map.
            Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
        }
        /** Called when the popup is added to the map. */
        onAdd() {
            this.getPanes().floatPane.appendChild(this.containerDiv);
        }
        /** Called when the popup is removed from the map. */
        onRemove() {
            if (this.containerDiv.parentElement) {
                this.containerDiv.parentElement.removeChild(this.containerDiv);
            }
        }
        /** Called each frame when the popup needs to draw itself. */
        draw() {
            const divPosition = this.getProjection().fromLatLngToDivPixel(
                this.position,
            );
            // Hide the popup when it is far out of view.
            const display =
                Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
                    ? "block"
                    : "none";

            if (display === "block") {
                this.containerDiv.style.left = divPosition.x + "px";
                this.containerDiv.style.top = divPosition.y + "px";
            }

            if (this.containerDiv.style.display !== display) {
                this.containerDiv.style.display = display;
            }
        }
    }



}

initMap();




