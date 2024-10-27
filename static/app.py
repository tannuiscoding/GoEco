from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

API_KEY = '57a709f613134439a7a144335240110'  # WeatherAPI key

# Function to get weather data from WeatherAPI.com
def get_weather_data(city):
    try:
        url = f'http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}&aqi=no'
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError if the status is not 200
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return None  # Return None in case of an error



# Function to predict energy source
def predict_energy_source(weather_data, sunshine_hours, is_near_water=False, is_geothermal_region=False):
    wind_speed = weather_data['current']['wind_kph'] * 0.27778  # Convert kph to m/s
    rainfall = weather_data['current'].get('precip_mm', 0)  # Get rainfall in mm
    condition = weather_data['current']['condition']['text']  # Weather condition

    resources= []

    # Example logic to predict energy source based on weather conditions and sunshine hours
    if sunshine_hours > 5:
        resources.append("Solar Energy")
    if is_near_water:
        resources.append(" Hydropower")
    if is_geothermal_region:
        resources.append(" Geothermal Energy")
    if wind_speed > 4:
        resources.append(" Wind Energy")
    if(len(resources)==0):
        return "No optimal energy source found"
    
    return resources

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    city = request.form['city']
    sunshine_hours = int(request.form['sunshine_hours']) 
    is_near_water = request.form.get('is_near_water') == 'on'
    is_geothermal_region = request.form.get('is_geothermal_region') == 'on'

    # Get the weather data for the specified city
    weather_data = get_weather_data(city)
    
    # Check if weather data is valid
    if not weather_data:
        return jsonify({'error': 'Could not fetch weather data. Please try again later.'})

    # Predict the energy source based on the weather and geographical data
    energy_source = predict_energy_source(weather_data, sunshine_hours, is_near_water, is_geothermal_region)
    
    return jsonify({'energy_source': energy_source})


if __name__ == '__main__':
    app.run(debug=True)


