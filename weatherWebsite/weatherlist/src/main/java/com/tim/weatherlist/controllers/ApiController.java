package com.tim.weatherlist.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.weatherlist.models.User;
import com.tim.weatherlist.models.Creds;
import com.tim.weatherlist.models.Location;
import com.tim.weatherlist.services.LocationService;
import com.tim.weatherlist.services.UserService;;

@RestController
@RequestMapping("/api/v1")
public class ApiController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private LocationService locationService;
	
	@RequestMapping(value="/login", method=RequestMethod.POST)
	public User attemptLogin( @RequestBody Creds cred ) {
		return userService.getUser(cred);
	}
	
	@RequestMapping(value="/locations/{uid}", method=RequestMethod.GET)
	public List<Location> getUserLocations( @PathVariable String uid ) {
		return locationService.getLocations(uid);
	}
	
	@RequestMapping(value="/locations", method=RequestMethod.GET)
	public Location searchLocation(@RequestParam(name = "lat") String lat, @RequestParam(name = "lon") String lon) {
		return locationService.searchLocation(lat, lon);
	}
	
	@RequestMapping(value="/locations/{uid}", method=RequestMethod.POST)
	public Location createLocation( @PathVariable String uid, @RequestParam(name = "lat") String lat, @RequestParam(name = "lon") String lon) {
		return locationService.addLocation(uid, lat, lon);
	}
	
	@RequestMapping(value="/locations/{lid}", method=RequestMethod.DELETE)
	public Location deleteLocation(@PathVariable String lid) {
		return locationService.removeLocation(lid);
	}
}
