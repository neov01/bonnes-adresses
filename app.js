let map = L.map('map').setView([5.34, -4.03], 13); // Abidjan par défaut

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];

function loadPlaces() {
    const places = JSON.parse(localStorage.getItem('places') || '[]');
    places.forEach(p => {
        addMarker(p);
        addToList(p);
    });
}

function addMarker(place) {
    const marker = L.marker(place.coords).addTo(map)
        .bindPopup(`<b>${place.name}</b><br>${'⭐'.repeat(place.rating)}<br>${place.comment}`);
    markers.push(marker);
}

function addToList(place) {
    const li = document.createElement('li');
    li.textContent = `${place.name} (${place.type}) - ${'⭐'.repeat(place.rating)} : ${place.comment}`;
    document.getElementById('placesList').appendChild(li);
}

document.getElementById('placeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    map.once('click', function(ev) {
        const place = {
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            comment: document.getElementById('comment').value,
            rating: parseInt(document.getElementById('rating').value),
            coords: [ev.latlng.lat, ev.latlng.lng]
        };
        let places = JSON.parse(localStorage.getItem('places') || '[]');
        places.push(place);
        localStorage.setItem('places', JSON.stringify(places));
        addMarker(place);
        addToList(place);
        document.getElementById('placeForm').reset();
    });
    alert("Clique sur la carte pour localiser ce lieu.");
});

loadPlaces();
