Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the path route "/weather"
  get "/weather", to: "weather#index"
end
