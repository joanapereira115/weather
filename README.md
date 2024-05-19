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
```
http://localhost:3000/weather?latitude=<value>&longitude=<value>&start_date=<value>&end_date=<value>
```
