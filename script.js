const countryInput = document.getElementById("countryInput");
const searchButton = document.getElementById("searchButton");
const countryGrid = document.getElementById("countryGrid");

const countryDetails = document.createElement("div");
countryDetails.id = "countryDetails";
countryDetails.className = "mt-5";
countryDetails.style.display = "none";
document.querySelector(".container").appendChild(countryDetails);

searchButton.addEventListener("click", async () => {
    const countryName = countryInput.value.trim();
    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }

    try {
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const countries = await countryResponse.json();

        if (countries.status === 404 || countries.message) {
            alert("Country not found.");
            return;
        }

        countryGrid.innerHTML = "";
        countries.forEach(async (country) => {
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${country.latlng[0]}&longitude=${country.latlng[1]}&current_weather=true`);
            const weatherData = await weatherResponse.json();

            const countryCard = document.createElement("div");
            countryCard.className = "col-md-4";

            countryCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p class="card-text"><strong>Region:</strong> ${country.region}</p>
                        <p class="card-text"><strong>Weather:</strong> ${weatherData.current_weather.temperature}°C</p>
                        <button class="btn btn-info" onclick="showDetails('${country.name.common}', '${country.population}', '${country.capital}', '${country.flags.svg}')">More Details</button>
                    </div>
                </div>
            `;

            countryGrid.appendChild(countryCard);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Something went wrong. Please try again.");
    }
});

function showDetails(name, population, capital, flag) {
    countryDetails.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">${name}</h4>
                <p class="card-text"><strong>Population:</strong> ${population}</p>
                <p class="card-text"><strong>Capital:</strong> ${capital}</p>
                <img src="${flag}" alt="${name} flag" class="img-fluid mt-3" style="max-width: 200px;">
            </div>
        </div>
    `;
    countryDetails.style.display = "block";
}
