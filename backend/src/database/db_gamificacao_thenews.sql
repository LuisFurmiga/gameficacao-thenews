-- backend/src/database/db_gamificacao_thenews.sql
-- Para executar o postgre em um terminal, digite:
-- & "C:\Program Files\PostgreSQL\17\bin\postgres.exe" "-D" "C:\Program Files\PostgreSQL\17\data"
--psql -U postgres -f src/database/db_gamificacao_thenews.sql

-- Criar banco de dados (se ainda não existir)
CREATE DATABASE gamificacao_thenews;

-- Criar usuário administrador
CREATE USER luisfurmiga WITH SUPERUSER CREATEDB CREATEROLE LOGIN PASSWORD 'luissql';


-- Garantir que o usuário tenha acesso total à base de dados
GRANT ALL PRIVILEGES ON DATABASE gamificacao_thenews TO luisfurmiga;

-- Usar o banco de dados
\c gamificacao_thenews;

-- Garantir que o usuário tenha acesso total a todas as tabelas e objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO luisfurmiga;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO luisfurmiga;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO luisfurmiga;

-- Tabela de leitores (Reader)
CREATE TABLE readers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de newsletters (Newsletter)
CREATE TABLE newsletters (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de streaks (Sequência de leituras)
CREATE TABLE streaks (
    id SERIAL PRIMARY KEY,
    reader_id INT NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_opened_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reader_id) REFERENCES readers(id) ON DELETE CASCADE
);

-- Tabela de registros de abertura (Openings)
CREATE TABLE openings (
    id SERIAL PRIMARY KEY,
    reader_id INT NOT NULL,
    newsletter_id INT NOT NULL,
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_channel VARCHAR(255),
    FOREIGN KEY (reader_id) REFERENCES readers(id) ON DELETE CASCADE,
    FOREIGN KEY (newsletter_id) REFERENCES newsletters(id) ON DELETE CASCADE
);
