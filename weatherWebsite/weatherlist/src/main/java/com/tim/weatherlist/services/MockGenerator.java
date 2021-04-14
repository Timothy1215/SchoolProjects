package com.tim.weatherlist.services;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import com.tim.weatherlist.models.Location;
import com.tim.weatherlist.models.User;
import com.tim.weatherlist.repositories.LocationRepository;
import com.tim.weatherlist.repositories.UserRepository;

@Service
public class MockGenerator {
//	@Bean
//	PasswordEncoder getEncoder() {
//	    return new BCryptPasswordEncoder();
//	}
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private LocationRepository locationRepository;
	
//	@Autowired
//	PasswordEncoder encoder;
	
	private List<User> mockUsers(){
		
//		String tomPass = this.encoder.encode("123");
//		String suePass = this.encoder.encode("abc");
//		String finPass = this.encoder.encode("xyz");
		
		return Arrays.asList(
				new User.Builder().email("tom@uwlax.edu").password("123").firstName("tom").lastName("sawyer").username("tom.sawyer").build(),
				new User.Builder().email("sue@uwlax.edu").password("abc").firstName("sue").lastName("smith").username("sue.smith").build(),
				new User.Builder().email("fin@uwlax.edu").password("xyz").firstName("fin").lastName("wolfhard").username("fin.wolfhard").build())
		.stream()
		.map( user -> {
			return userRepository.save(user);
		}).collect( Collectors.toList());
		
	}
	
	private List<Location> mockLocations(List<User> user){
		String url = "https://forecast.weather.gov/MapClick.php?lat=43.5&lon=-89&FcstType=json";
		WebClient client = WebClient.create(url);
	    Location result = client.get().retrieve().bodyToMono(Location.class).block();
	    
		return Arrays.asList(
				new Location.Builder().userId(user.get(0).getId().toString()).description(result.getDescription()).temp(result.getTemp()).weather(result.getWeather()).name(result.getName()).build(),
				new Location.Builder().userId(user.get(1).getId().toString()).description("Gresham Park GA").temp("63").weather("Overcast").name("Atlanta, Hartsfield - Jackson Atlanta International Airport").build(),
				new Location.Builder().userId(user.get(2).getId().toString()).description("5 Miles ESE Chicago IL").temp("43").weather("Mostly Cloudy").name("Chicago, Chicago Midway Airport").build())
		.stream()
		.map( location -> {
			return locationRepository.save(location);
		}).collect( Collectors.toList());
	}
	
	@PostConstruct
	private void mockData() {
		List<Location> locations = this.locationRepository.findAll();
		if(locations.isEmpty()) {
			mockLocations(mockUsers());
		}
	}
}
