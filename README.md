
<p align="center">
  <img src="static/images/logo.png" alt="Logo" width="150px" height="150px" style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);" />
</p>

# GoEco

**GoEco** is a web application that solves the issue of energy sources. This website is going to help people in finding which renewable energy source is best for their location.


![GoEco](static/images/output.png)


<!--line-->
<img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" />

### Features
- Real-time weather data integration using the [WeatherAPI](https://www.weatherapi.com/) to assess conditions like temperature, wind speed, cloud cover, and rainfall.
- Customized recommendations for renewable energy sources, including solar, wind, hydro, and geothermal, based on weather data and location attributes.
- Intuitive user interface for entering location details and viewing recommendations.


## TechStack

- HTML
- CSS
- Python
- Flask
- WeatherAPI

<!--line-->
<img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" />

## Setup and Installation

### Prerequisites
1. **Python 3.7+**
2. **Flask**: Install Flask via `pip install Flask`
3. **WeatherAPI Key**: Sign up for an API key at [WeatherAPI](https://www.weatherapi.com/) and set it as an environment variable (`WEATHER_API_KEY`).

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/GoEco.git
   cd GoEco

2. Install required packages
	```bash
   pip install -r./requirements.txt

3. Set up the API Key
	```bash
	API_KEY = os.getenv("WEATHER_API_KEY", "YOUR_API_KEY")

4. Run the Flask application
	```bash
	python app.py

5. Open your browser and go to http://127.0.0.1:5000 to access the application.

## Usage

1. Enter Location and Preferences
   - On the homepage, enter the city name and sunshine hours.
   - Optionally, check if the location is near a water source or in a geothermal region.

2. Submit Form
   - Click "Find Renewable Energy Sources" to get recommendations.

3. View Results
   - The application will display current weather data and recommended renewable energy sources with efficiency estimates.

### License

This project is licensed under the MIT License.