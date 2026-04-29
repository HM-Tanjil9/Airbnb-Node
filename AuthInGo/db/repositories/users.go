package db

import (
	"AuthInGo/models"
	"database/sql"
	"fmt"
)

type UserRepository interface {
	GetById() (*models.User, error)
	Create() error
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(_db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		db: _db,
	}
}

func (u *UserRepositoryImpl) Create() error {
	query := "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
	result, err := u.db.Exec(query, "test-user", "test@user.com", "password")
	if err != nil {
		fmt.Println("Error inserting user:", err)
		return err
	}
	rowsAffected, rowErr := result.RowsAffected()
	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}
	if rowsAffected == 0 {
		fmt.Println("No rows were affected, user not created")
		return nil
	}
	fmt.Println("User created successfully, row affected:", rowsAffected)
	return nil
}

func (u *UserRepositoryImpl) GetById() (*models.User, error) {
	fmt.Println("Fetching user in UserRepository")
	// step 1: prepare the query
	query := "SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?"
	// step 2: Execute the query
	row := u.db.QueryRow(query, 1)

	// step 3: Process the result
	user := &models.User{}
	err := row.Scan(&user.Id, &user.UserName, &user.Email, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given id")
			return nil, err
		} else {
			fmt.Println("Error scanning user:", err)
			return nil, err
		}
	}
	fmt.Println("User fetched successfully:", user)
	return user, nil
}
