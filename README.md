# Nestport

### Development

Start a Postgres container

`docker run -d --name pg-nestport -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -e PGDATA=/var/lib/postgresql/data/pgdata --restart unless-stopped -v $HOME/dockervols/pg-nestport:/var/lib/postgresql/data -p 5432:5432 postgres:14-alpine`

Create a develoment database

```sql
CREATE DATABASE developmentdb;
```

Clone the repo and install dependencies

```bash
git clone https://github.com/axtck/nestport.git
cd nestport
npm i
```

Copy the `.env.sample` files in `.src/common/environments/` and remove `.sample` from filename, edit environment variables (use db name used for creating db)

Start the server

```bash
npm run start:dev
```

A migration (`./src/database/migrations/0_init.ts`) creates the initial tables
