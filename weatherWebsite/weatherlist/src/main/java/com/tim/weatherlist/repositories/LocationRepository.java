package com.tim.weatherlist.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tim.weatherlist.models.Location;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {

	List<Location> findByUserId(String id);
}
