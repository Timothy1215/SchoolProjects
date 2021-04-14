package com.tim.weatherlist.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection="users")
public class User{
	
	@Id
	private String id;
	
	@Indexed(unique = true)
	private String email;
	
	@JsonIgnore
	private String password;
	
	private String firstName;
	
	private String lastName;
	
	private String username;
	
	public User() {
	}
	
	public String getId() {
		return id;
	}
	
    public void setId(String id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	private User(Builder builder) {
		this.email = builder.email;
		this.password = builder.password;
		this.id = builder.id;
		this.username = builder.username;
		this.firstName = builder.firstName;
		this.lastName = builder.lastName;
	}
	
	public static class Builder{
		private String id;
		private String email;
		private String password;
		private String username;
		private String firstName;
		private String lastName;
		
		public Builder id(String id) {
			this.id = id;
			return this;
		}
		
		public Builder email(String email ) {
        	this.email = email;
        	return this;
        }
		
        public Builder password(String password) {
        	this.password = password;
        	return this;
        }
        
        public Builder username(String username) {
        	this.username = username;
        	return this;
        }
        
        public Builder firstName(String firstName) {
        	this.firstName = firstName;
        	return this;
        }
        
        public Builder lastName(String lastName) {
        	this.lastName = lastName;
        	return this;
        }
        
        public User build() {
        	return new User(this);        	
        }
	}

}
