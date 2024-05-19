# Weather
Code for historical weather application.

## Backend
Ruby backend lives on folder `weather-service`.

### Ruby version
ruby-3.3.1

### System dependencies
* ruby
* rails
* sqlite3

### Database creation
Create tables DailyWeather and HourlyWeather.
```
rails db:migrate
```

### Database initialization
```
rails console
```
To list all data saved in the database:
```
DailyWeather.all
HourlyWeather.all
```

### Deployment instructions
```
cd weather-service
bundle install
rails server
```

### API endpoint
`http://localhost:3000/weather?latitude=`_value_`&longitude=`_value_`&start_date=`_value_`&end_date=`_value_

## Frontend
React frontend lives on folder `weather-app`.

### Deployment instructions
```
cd weather-app
npm i
```

Run the app in the development mode.
```
npm start
```

Build the app for production to the `build` folder.
```
npm run build
```

### API endpoint
Open [http://localhost:3115](http://localhost:3115) to view it in your browser.
