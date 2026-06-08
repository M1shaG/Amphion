### Migration

#### Dowloand
```
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

#### Use

```
export POSTGRESQL_URL='postgres://postgres:password@localhost:5432/example?sslmode=disable'
migrate -database ${POSTGRESQL_URL} -path db/migrations up/down
```

#### Create

```
migrate create -ext sql -dir db/migrations -seq create_name_table
```
