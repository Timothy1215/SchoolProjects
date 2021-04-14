package com.tim.weatherlist.services;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.weatherlist.models.Creds;
import com.tim.weatherlist.models.User;
import com.tim.weatherlist.repositories.UserRepository;

@Service
public class UserService {
	@Autowired
	UserRepository userRepository;
	
	
	public User getUser(Creds body ) {
		System.out.println(body.getUsername());
		System.out.println(body.getPassword());
		String email = body.getUsername();
		//String password = body.getPassword();
		return userRepository.findByEmail(email);
	}
	
	
	
}
