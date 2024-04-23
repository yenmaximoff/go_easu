package models

import (
	"database/sql"
	"time"
)

// Models is the wrapper for database
type Models struct {
	DB DBModel
}

// NewModels returns models with db pool
func NewModels(db *sql.DB) Models {
	return Models{
		DB: DBModel{DB: db},
	}
}

// Movie is the type for movies
type File struct {
	ID          int            `json:"id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	FilePath    string         `json:"file_path"`
	FileHash    string         `json:"file_hash"`
	CreatedAt   time.Time      `json:"-"`
	UpdatedAt   time.Time      `json:"-"`
	FileType    map[int]string `json:"types"`
}

// Genre is the type for genre
type Type struct {
	ID        int       `json:"id"`
	TypeName  string    `json:"type_name"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

// MovieGenre is the type for movie genre
type FileType struct {
	ID        int       `json:"-"`
	FileID    int       `json:"-"`
	TypeID    int       `json:"-"`
	Type      Type      `json:"type"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type User struct {
	ID       int
	Email    string
	Password string
}
