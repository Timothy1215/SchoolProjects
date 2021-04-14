package com.tim.weatherlist.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tim.weatherlist.models.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

	
	User findByEmail(String email);
//  Boolean existsByUsername(String username);
//  Boolean existsByEmail(String email);
    //Collection<User> findByEmailAndPassword(String email, String password);
}
