package services

import (
	db "AuthInGo/db/repositories"
	"fmt"
)

type UserService interface {
	CreateUser() error
	GetUserById() error
}

type UserServiceImpl struct {
	UserRepository db.UserRepository
}

func NewUserService(_userRepository db.UserRepository) UserService {
	return &UserServiceImpl{
		UserRepository: _userRepository,
	}
}

func (u *UserServiceImpl) GetUserById() error {
	fmt.Println("Fetching user in UserService")
	u.UserRepository.GetById()
	return nil
}

func (u *UserServiceImpl) CreateUser() error {
	fmt.Println("Create user in UserService")
	u.UserRepository.Create()
	return nil
}
