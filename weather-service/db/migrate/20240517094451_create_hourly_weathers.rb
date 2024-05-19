class CreateHourlyWeathers < ActiveRecord::Migration[7.1]
  def change
    create_table :hourly_weathers, primary_key: [:latitude, :longitude, :date, :time] do |t|
      t.date :date
      t.time :time
      t.float :latitude
      t.float :longitude
      t.integer :weather_code
      t.float :temperature
      t.float :apparent_temperature
      t.float :rain
      t.float :snow
      t.float :wind_speed
      t.integer :wind_direction
      t.boolean :is_day

      t.timestamps
    end
  end
end
