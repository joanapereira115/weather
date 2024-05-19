class CreateDailyWeathers < ActiveRecord::Migration[7.1]
  def change
    create_table :daily_weathers, primary_key: [:latitude, :longitude, :date] do |t|
      t.date :date
      t.float :latitude
      t.float :longitude
      t.integer :weather_code
      t.float :max_temp
      t.float :min_temp
      t.time :sunrise
      t.time :sunset
      t.float :rain
      t.float :snow
      t.float :wind_speed
      t.integer :wind_direction

      t.timestamps
    end
  end
end
