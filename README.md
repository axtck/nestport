# nestport

`docker run -d --name pg-nestport -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -e PGDATA=/var/lib/postgresql/data/pgdata --restart unless-stopped -v $HOME/dockervols/pg-nestport:/var/lib/postgresql/data -p 5433:5432 postgres:14-alpine`
