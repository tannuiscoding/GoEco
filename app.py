from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = 'api_key'

# Function to get weather data from OpenWeatherMap
def get_weather_data(city):
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    response = requests.get(url)
    data = response.json()
    return data

# Function to predict energy source
def predict_energy_source(weather_data, is_near_water=False, is_geothermal_region=False):
    wind_speed = weather_data['wind']['speed']
    sunlight_hours = 6  # Assume a value or fetch from data
    rainfall = weather_data.get('rain', {}).get('1h', 0)  # Get rainfall, if available

    if sunlight_hours > 5:
        return "Solar Energy"
    elif wind_speed > 10:
        return "Wind Energy"
    elif is_near_water and rainfall > 50:
        return "Hydropower"
    elif is_geothermal_region:
        return "Geothermal Energy"
    else:
        return "No optimal renewable energy source found"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    city = request.form['city']
    is_near_water = request.form.get('is_near_water') == 'on'
    is_geothermal_region = request.form.get('is_geothermal_region') == 'on'

    weather_data = get_weather_data(city)

    energy_source = predict_energy_source(weather_data, is_near_water, is_geothermal_region)
    
    return jsonify({'energy_source': energy_source})

if __name__ == '__main__':
    app.run(debug=True)
