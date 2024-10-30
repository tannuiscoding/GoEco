from flask import Flask, render_template, request, jsonify
from dataclasses import dataclass
from typing import List, Optional
import requests
import logging
import os
from datetime import datetime

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Configuration
class Config:
    API_KEY = os.getenv("WEATHER_API_KEY", "YOUR_API_KEY")
    WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json"


@dataclass
class WeatherData:
    temperature: float
    wind_speed: float  # in m/s
    rainfall: float  # in mm
    cloud_cover: int  # in percentage
    condition: str
    humidity: int


@dataclass
class EnergySource:
    name: str
    efficiency: float  # Estimated efficiency percentage
    description: str


class WeatherAPIError(Exception):
    # Custom exception for weather API related errors
    pass


def get_weather_data(city: str) -> WeatherData:

    # Fetch weather data from WeatherAPI.com with error handling

    try:
        params = {"key": Config.API_KEY, "q": city, "aqi": "no"}
        response = requests.get(Config.WEATHER_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        return WeatherData(
            temperature=data["current"]["temp_c"],
            wind_speed=data["current"]["wind_kph"] * 0.27778,  # Convert kph to m/s
            rainfall=data["current"].get("precip_mm", 0),
            cloud_cover=data["current"]["cloud"],
            condition=data["current"]["condition"]["text"].lower(),
            humidity=data["current"]["humidity"],
        )
    except requests.RequestException as e:
        logger.error(f"Error fetching weather data: {str(e)}")
        raise WeatherAPIError(f"Failed to fetch weather data: {str(e)}")


def predict_energy_source(
    weather: WeatherData,
    sunshine_hours: int,
    is_near_water: bool = False,
    is_geothermal_region: bool = False,
) -> List[EnergySource]:

    # Predict suitable energy sources with detailed efficiency calculations

    energy_sources = []

    # Solar Energy Assessment
    solar_efficiency = calculate_solar_efficiency(weather, sunshine_hours)
    if solar_efficiency > 30:
        energy_sources.append(
            EnergySource(
                name="Solar Energy",
                efficiency=solar_efficiency,
                description=f"Suitable with {solar_efficiency:.1f}% efficiency based on {sunshine_hours}h sunshine and {weather.cloud_cover}% cloud cover",
            )
        )

    # Wind Energy Assessment
    wind_efficiency = calculate_wind_efficiency(weather.wind_speed)
    if wind_efficiency > 20:
        energy_sources.append(
            EnergySource(
                name="Wind Energy",
                efficiency=wind_efficiency,
                description=f"Viable with {wind_efficiency:.1f}% efficiency at {weather.wind_speed:.1f} m/s wind speed",
            )
        )

    # Hydropower Assessment
    if is_near_water:
        hydro_efficiency = calculate_hydro_efficiency(weather.rainfall)
        energy_sources.append(
            EnergySource(
                name="Hydropower",
                efficiency=hydro_efficiency,
                description=f"Feasible with {hydro_efficiency:.1f}% efficiency given water proximity and {weather.rainfall}mm rainfall",
            )
        )

    # Geothermal Assessment
    if is_geothermal_region:
        energy_sources.append(
            EnergySource(
                name="Geothermal Energy",
                efficiency=85.0,
                description="Highly efficient option in geothermal region",
            )
        )

    return energy_sources


def calculate_solar_efficiency(weather: WeatherData, sunshine_hours: int) -> float:
    # Calculate solar energy efficiency based on weather conditions
    base_efficiency = 40  # Base efficiency for modern solar panels

    # Reduce efficiency based on cloud cover
    cloud_factor = 1 - (weather.cloud_cover / 100) * 0.7
    # Adjust for sunshine hours
    sunshine_factor = min(sunshine_hours / 12, 1)  # Normalize to 12 hours max
    # Temperature adjustment (efficiency drops above 25°C)
    temp_factor = 1 - max(0, (weather.temperature - 25) * 0.004)
    return base_efficiency * cloud_factor * sunshine_factor * temp_factor


def calculate_wind_efficiency(wind_speed: float) -> float:
    # Calculate wind energy efficiency based on wind speed
    if wind_speed < 3:  # Cut-in speed
        return 0
    elif wind_speed > 25:  # Cut-out speed
        return 0
    else:
        # Simplified efficiency curve
        return min(90, wind_speed * 5)


def calculate_hydro_efficiency(rainfall: float) -> float:
    # Calculate hydropower efficiency based on rainfall
    base_efficiency = 70  # Base efficiency for hydropower
    rainfall_factor = min(1 + (rainfall / 100), 1.3)  # Max 30% boost from rainfall
    return base_efficiency * rainfall_factor


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Input validation
        if not request.form.get("city"):
            return jsonify({"error": "City is required"}), 400

        city = request.form["city"]
        try:
            sunshine_hours = int(request.form["sunshine_hours"])
            if not (0 <= sunshine_hours <= 24):
                return (
                    jsonify({"error": "Sunshine hours must be between 0 and 24"}),
                    400,
                )
        except ValueError:
            return jsonify({"error": "Invalid sunshine hours value"}), 400

        is_near_water = request.form.get("is_near_water") == "on"
        is_geothermal_region = request.form.get("is_geothermal_region") == "on"

        # Get weather data
        weather_data = get_weather_data(city)

        # Predict energy sources
        energy_sources = predict_energy_source(
            weather_data, sunshine_hours, is_near_water, is_geothermal_region
        )

        # Formating  response
        response = {
            "timestamp": datetime.now().isoformat(),
            "city": city,
            "weather": {
                "temperature": weather_data.temperature,
                "wind_speed": weather_data.wind_speed,
                "condition": weather_data.condition,
                "cloud_cover": weather_data.cloud_cover,
            },
            "energy_sources": [
                {
                    "name": source.name,
                    "efficiency": source.efficiency,
                    "description": source.description,
                }
                for source in energy_sources
            ],
        }

        if not energy_sources:
            response["message"] = (
                "No optimal energy sources found for the given conditions"
            )

        print(jsonify(response))
        return jsonify(response)

    except WeatherAPIError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == "__main__":
    app.run(debug=True)
