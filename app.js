let map = L.map('map').setView([5.34, -4.03], 13); // Abidjan par défaut

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let editingIndex = null;

function loadPlaces() {
    const places = JSON.parse(localStorage.getItem('places') || '[]');
    places.forEach((p, i) => {
        addMarker(p, i);
        addToList(p, i);
    });
}

function savePlaces(places) {
    localStorage.setItem('places', JSON.stringify(places));
}

function addMarker(place, index) {
    const marker = L.marker(place.coords).addTo(map)
        .bindPopup(`<b>${place.name}</b><br>${'⭐'.repeat(place.rating)}<br>${place.comment}`);
    markers.push(marker);
}

function refreshList() {
    document.getElementById('placesList').innerHTML = '';
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    loadPlaces();
}

function addToList(place, index) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${place.name}</strong> (${place.type}) - ${'⭐'.repeat(place.rating)}<br>${place.comment}
        <br><button onclick="editPlace(${index})">✏️ Modifier</button>
        <button onclick="deletePlace(${index})">🗑️ Supprimer</button>`;
    document.getElementById('placesList').appendChild(li);
}

function editPlace(index) {
    const places = JSON.parse(localStorage.getItem('places') || '[]');
    const p = places[index];
    document.getElementById('name').value = p.name;
    document.getElementById('type').value = p.type;
    document.getElementById('comment').value = p.comment;
    document.getElementById('rating').value = p.rating;
    editingIndex = index;
    alert("Clique sur la carte pour redéfinir l'emplacement.");
}

function deletePlace(index) {
    let places = JSON.parse(localStorage.getItem('places') || '[]');
    places.splice(index, 1);
    savePlaces(places);
    refreshList();
}

document.getElementById('placeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    map.once('click', function(ev) {
        let places = JSON.parse(localStorage.getItem('places') || '[]');
        const place = {
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            comment: document.getElementById('comment').value,
            rating: parseInt(document.getElementById('rating').value),
            coords: [ev.latlng.lat, ev.latlng.lng]
        };
        if (editingIndex !== null) {
            places[editingIndex] = place;
            editingIndex = null;
        } else {
            places.push(place);
        }
        savePlaces(places);
        refreshList();
        document.getElementById('placeForm').reset();
    });
    alert("Clique sur la carte pour localiser ce lieu.");
});

document.getElementById('locateBtn').addEventListener('click', function() {
    if (!navigator.geolocation) {
        return alert("La géolocalisation n'est pas disponible sur ce navigateur.");
    }
    navigator.geolocation.getCurrentPosition(position => {
        map.setView([position.coords.latitude, position.coords.longitude], 16);
        alert("Position localisée ! Clique sur la carte pour enregistrer l’endroit exact.");
    }, () => alert("Impossible de récupérer la position."));
});

loadPlaces();
