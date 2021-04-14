package com.tim.weatherlist.models;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="locations")
public class Location {

	@Id
	private String id;

	private String userId;
	
	private String name;
	
	
	private String description;
	
	
	private String weather;
	
	
	private String temp;
	
	public Location() {
	}
	

	@JsonProperty("currentobservation")
	private void setWeatherFromCurrent(Map<String,Object> data){
		this.name = (String)data.get("name");
		this.temp = (String)data.get("Temp");
		this.weather = (String)data.get("Weather");
    }
	
	@JsonProperty("location")
	private void setWeatherFromData(Map<String,Object> data){
		this.description = (String)data.get("areaDescription");
    }
	
	public String getId() {
		return id;
	}
	
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
    	return name;
    }
    
    public void setName(String name) {
    	this.name = name;
    }
    
    public String getUserId() {
    	return userId;
    }
    
    public void setUserId(String userId) {
    	this.userId = userId;
    }
    
	public String getDescription() {
		return description;
	}
	
    public void setDescription(String description) {
        this.description = description;
    }
    
	public String getWeather() {
		return weather;
	}
	
    public void setWeather(String weather) {
        this.weather = weather;
    }
    
	public String getTemp() {
		return temp;
	}
	
    public void setTemp(String temp) {
        this.temp = temp;
    }
	
	private Location(Builder builder) {
		this.description = builder.description;
		this.id = builder.id;
		this.weather = builder.weather;
		this.temp = builder.temp;
		this.userId = builder.userId;
		this.name = builder.name;
	}
	
	
	
    
    
    public static class Builder{
		private String id;
		private String description;
		private String weather;
		private String temp;
		private String userId;
		private String name;
		
		public Builder id(String id) {
			this.id = id;
			return this;
		}
		
		public Builder name(String name) {
			this.name = name;
			return this;
		}
		
		public Builder userId(String userId) {
			this.userId = userId;
			return this;
		}
		
		public Builder description(String description ) {
        	this.description = description;
        	return this;
        }
		
        public Builder weather(String weather) {
        	this.weather = weather;
        	return this;
        }
        
        public Builder temp(String temp) {
        	this.temp = temp;
        	return this;
        }
        
        public Location build() {
        	return new Location(this);        	
        }
	}
}
