require 'httparty'
require 'date'

class WeatherController < ApplicationController
    def index
      # get all the parameters
      latitude = params[:latitude]
      longitude = params[:longitude]
      start_date = params[:start_date]
      end_date = params[:end_date]

      # make sure all the parameters have a value
      if latitude.blank? || longitude.blank? || start_date.blank? || end_date.blank?
        render json: {}
      else

        # build the array with all the expected dates between the start and end dates passed
        start_date_dt = Date.parse(start_date)
        end_date_dt = Date.parse(end_date)
        date_range = (start_date_dt..end_date_dt)
        date_array = date_range.to_a.map(&:to_s)

        # retrieve and clean the data from the database
        db_daily = DailyWeather.where({latitude: latitude, longitude:longitude}).where(date:date_range)
        db_daily_data = db_daily.all
        db_hourly = HourlyWeather.where({latitude: latitude, longitude:longitude}).where(date:date_range)
        db_hourly_data = db_hourly.all
        db_daily_data = clear_data(db_daily_data, "daily")
        db_hourly_data = clear_data(db_hourly_data, "hourly")
        
        # calculate the dates that doesn't exist in the database
        db_date_array = get_date_range(db_daily_data)
        missing_dates = date_array - db_date_array

        # if there are info missing
        if !missing_dates.empty?
          
          result = {daily: [], hourly: []}
          # fetch the api for the missing dates range and save to the database
          api_data = fetch_data_from_external_api(latitude, longitude, missing_dates.first, missing_dates.last)
          saved_data = save_data_to_database(api_data, db_date_array, latitude, longitude)
          # join the database info with the fetched data and sort by date and time
          saved_data[:daily].concat(db_daily_data)
          saved_data[:hourly].concat(db_hourly_data)
          result[:daily] = saved_data[:daily].sort_by { |item| item["date"] }
          result[:hourly] = saved_data[:hourly].sort_by { |item| "#{item["date"]} #{item["time"]}" }
          
          render json: result
        # if all the data existed in the database, retrieve it
        else
          render json: {daily: db_daily_data, hourly: db_hourly_data}
        end
      end

    end

    private

    # get the range dates existing in the provided data
    def get_date_range(data)
      result = []
      if !data.empty?
        data.each do |info|
          result << info["date"]
        end
      end
      return result.sort
    end

    # fetch data from the external API Open-Meteo Historical Weather
    def fetch_data_from_external_api(latitude, longitude, start_date, end_date)
      api_data = HTTParty.get("https://archive-api.open-meteo.com/v1/archive?latitude=#{latitude}&longitude=#{longitude}&start_date=#{start_date}&end_date=#{end_date}&hourly=temperature_2m,apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,wind_direction_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,snowfall_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=GMT")
      if api_data.success?
        return JSON.parse(api_data.body)
      else
        return {}
      end
    end

    # save the retrieved data from the external API into the database
    # only save new data
    def save_data_to_database(data, already_saved, lat, lng)

      result = {daily: [], hourly: []}
      
      daily_parsed_data = parse_data("daily", data, lat, lng)
      hourly_parsed_data = parse_data("hourly", data, lat, lng)

      if !daily_parsed_data.nil?
        daily_parsed_data.each do |daily|
          if !already_saved.include?(daily["date"])
            daily_weather_data = DailyWeather.new(daily)
            daily_weather_data.save
            result[:daily] << daily
          end
        end
      end

      if !hourly_parsed_data.nil?
        hourly_parsed_data.each do |hourly|
          if !already_saved.include?(hourly["date"])
            hourly_weather_data = HourlyWeather.new(hourly)
            hourly_weather_data.save
            result[:hourly] << hourly
          end
        end
      end

      return result

    end

    # map data retrieved from the external API to the database model
    # clear the time fields "time" (from HourlyWeather), and "sunrise" and "sunset" (from DailyWeather) to only return hours and minutes
    def parse_data(from, data, lat, lng)
      attribute_mapping = {
        "temperature_2m_max" => "max_temp",
        "temperature_2m_min" => "min_temp",
        "rain_sum" => "rain",
        "snowfall_sum" => "snow",
        "wind_speed_10m_max" => "wind_speed",
        "wind_direction_10m_dominant" => "wind_direction",
        "temperature_2m" => "temperature",
        "wind_speed_10m" => "wind_speed",
        "wind_direction_10m" => "wind_direction",
        "snowfall" => "snow"
      } 

      if data.empty? 
        return
      end

      attributes = data[from].keys - ["time"]

      parsed_data = data[from]["time"].map.with_index do |date, i|
        if from == "daily"
          hash = { "date" => date }
        elsif from == "hourly"
          only_date, only_time = date.split("T")
          hash = { "date" => only_date }
          hash["time"] = Time.parse(only_time).strftime("%H:%M")
        end
        attributes.each do |attr|
          hash[attr] = data[from][attr][i]
        end
        hash["latitude"] = lat
        hash["longitude"] = lng
        if from == "daily"
          only_date, only_time = hash["sunrise"].split("T")
          hash["sunrise"] = Time.parse(only_time).strftime("%H:%M")
          only_date, only_time = hash["sunset"].split("T")
          hash["sunset"] = Time.parse(only_time).strftime("%H:%M")
        end
        mapped_hash = hash.transform_keys { |key| attribute_mapping[key] || key }
        mapped_hash
      end

      return parsed_data
    end

    # clear the data retrieved from the database:
    # remove fields "created_at" and "updated_at"
    # clear the time fields "time" (from HourlyWeather), and "sunrise" and "sunset" (from DailyWeather) to only return hours and minutes
    def clear_data(data, type)
      discard_keys = ["created_at", "updated_at"]
      result = []

      data.each do |entry|
        obj = entry.as_json.except(*discard_keys)
        
        if type == "hourly"
          obj["time"] = entry[:time].strftime("%H:%M")
        elsif type ==="daily"
          obj["sunrise"] = entry[:sunrise].strftime("%H:%M")
          obj["sunset"] = entry[:sunset].strftime("%H:%M")
        end

        result << obj
      end
      return result
    end
end