
const myMap = {
	locations: [],
	places: [],
	map: {},
	markers: {},


	// The Map
	makeMap() {
		this.map = L.map('map', {
		center: this.locations,
		zoom: 11,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '13',
		}).addTo(this.map)


		// My Location Marker
		const marker = L.marker(this.locations)
		marker.addTo(this.map).bindPopup('<p1><b>You are here</b><br></p1>').openPopup()
	},

	// Other markers
	addMarkers() {
		for (var i = 0; i < this.places.length; i++) {
		this.markers = L.marker([
			this.places[i].lat,
			this.places[i].long,
		])
			.bindPopup(`<p1>${this.places[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

// Find Location
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

window.onload = async () => {
	const coords = await getCoords()
	myMap.locations = coords
	myMap.makeMap()
}

// Foursquare stuff
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3hwTXlpNEYtk4Eq7HvGlLoMr+39MJ7r7kBsoT05mJZ1k='
		}
	}
	
	let lat = myMap.locations[0]
	let lon = myMap.locations[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&ll=${lat}%2C${lon}&limit=10`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let places = parsedData.results
	return places
}

function processBusinesses(data) {
	let places = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return places
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.places = processBusinesses(data)
	myMap.addMarkers()
})


// My locations: 35.87938638707893, -78.70187081166753
// API Key: fsq3obKOs4jNjC0nm7uRS9F35q2Jzwkh5e0LS3cJ7qtJT4E=