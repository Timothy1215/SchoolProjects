package com.tim.weatherlist.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.tim.weatherlist.models.Location;
import com.tim.weatherlist.repositories.LocationRepository;

@Service
public class LocationService {
	@Autowired
	private LocationRepository locationRepository;
	
	public List<Location> getLocations(String id ) {
		return locationRepository.findByUserId(id);
	}
	
	public Location searchLocation(String lat, String lon ) {
		String url = "https://forecast.weather.gov/MapClick.php?lat=" + lat + "&lon=-" + lon +"&FcstType=json";
		WebClient client = WebClient.create(url);
	    Location result = client.get().retrieve().bodyToMono(Location.class).block();
		return result;
	}
	
	public Location addLocation(String id, String lat, String lon ) {
		String url = "https://forecast.weather.gov/MapClick.php?lat=" + lat + "&lon=-" + lon +"&FcstType=json";
		WebClient client = WebClient.create(url);
	    Location result = client.get().retrieve().bodyToMono(Location.class).block();
	    System.out.println(result);
	    result = new Location.Builder()
	    		.userId(id)
	    		.description(result.getDescription())
	    		.temp(result.getTemp())
	    		.weather(result.getWeather())
	    		.name(result.getName())
	    		.build();
	    System.out.println(result);
		return locationRepository.save(result);
	}
	
	public Location removeLocation(String id) {
		Location loc = locationRepository.findById(id).orElse(null);
		locationRepository.deleteById(id);
		return loc;
		
	}
}
