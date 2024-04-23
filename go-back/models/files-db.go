package models

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"
)

type DBModel struct {
	DB *sql.DB
}

// Get returns one movie and error, if any
func (m *DBModel) Get(id int) (*File, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, title, description,file_path, file_hash, created_at, updated_at from files where id = $1
	`

	row := m.DB.QueryRowContext(ctx, query, id)

	var file File

	err := row.Scan(
		&file.ID,
		&file.Title,
		&file.Description,
		&file.FilePath,
		&file.FileHash,
		&file.CreatedAt,
		&file.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// get genres, if any
	query = `select
				ft.id, ft.file_id, ft.type_id, t.type_name
			from
				file_types ft
				left join types t on (t.id = ft.type_id)
			where
				ft.file_id = $1
	`

	rows, _ := m.DB.QueryContext(ctx, query, id)
	defer rows.Close()

	types := make(map[int]string)
	for rows.Next() {
		var ft FileType
		err := rows.Scan(
			&ft.ID,
			&ft.FileID,
			&ft.TypeID,
			&ft.Type.TypeName,
		)
		if err != nil {
			return nil, err
		}
		types[ft.ID] = ft.Type.TypeName
	}

	file.FileType = types

	return &file, nil
}

// All returns all movies and error, if any
func (m *DBModel) All(types ...int) ([]*File, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	where := ""
	if len(types) > 0 {
		where = fmt.Sprintf(`where id in (select file_id from file_types where type_id = %d)`, types[0])
	}

	query := fmt.Sprintf(`select id, title, description,file_path, file_hash, created_at, updated_at from files %s order by title`, where)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []*File

	for rows.Next() {
		var file File
		err := rows.Scan(
			&file.ID,
			&file.Title,
			&file.Description,
			&file.FilePath,
			&file.FileHash,
			&file.CreatedAt,
			&file.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genreQuery := `select
				ft.id, ft.file_id, ft.type_id, t.type_name
			from
				file_types ft
				left join types t on (t.id = ft.type_id)
			where
				ft.file_id = $1
	`

		genreRows, _ := m.DB.QueryContext(ctx, genreQuery, file.ID)
		//defer genreRows.Close()

		types := make(map[int]string)
		for genreRows.Next() {
			var ft FileType
			err := genreRows.Scan(
				&ft.ID,
				&ft.FileID,
				&ft.TypeID,
				&ft.Type.TypeName,
			)
			if err != nil {
				return nil, err
			}
			types[ft.ID] = ft.Type.TypeName
		}
		genreRows.Close()

		file.FileType = types
		files = append(files, &file)
	}

	return files, nil
}

func (m *DBModel) TypesAll() ([]*Type, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, type_name, created_at, updated_at from types order by type_name`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var types []*Type

	for rows.Next() {
		var t Type
		err := rows.Scan(
			&t.ID,
			&t.TypeName,
			&t.CreatedAt,
			&t.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		types = append(types, &t)

	}
	return types, nil
}

func (m *DBModel) InsertFile(file File) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `insert into files(title, description, file_path, file_hash, created_at, updated_at) 
values ($1,$2,$3,$4,$5,$6)`

	_, err := m.DB.ExecContext(ctx, stmt,
		file.Title,
		file.Description,
		file.FilePath,
		file.FileHash,
		file.CreatedAt,
		file.UpdatedAt,
	)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (m *DBModel) UpdateFile(file File) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `update files set title = $1, description = $2, file_path = $3, file_hash = $4, created_at = $5, updated_at = $6 where id = $7`

	_, err := m.DB.ExecContext(ctx, stmt,
		file.Title,
		file.Description,
		file.FilePath,
		file.FileHash,
		file.CreatedAt,
		file.UpdatedAt,
		file.ID,
	)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (m *DBModel) DeleteFile(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := "delete from files where id = $1"

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}
	return nil
}
