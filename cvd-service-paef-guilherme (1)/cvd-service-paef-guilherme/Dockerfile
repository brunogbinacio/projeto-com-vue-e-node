# Usar uma imagem base oficial do Python
FROM python:3.9

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o arquivo de requisitos para o diretório de trabalho
COPY pyproject.toml .

# Instalar o Poetry
RUN pip install --upgrade pip
RUN pip install poetry

# Instalar dependências
RUN poetry install --no-root

# Copiar o conteúdo do projeto para o diretório de trabalho
COPY . .

# Expor a porta em que a aplicação vai rodar (ajuste conforme necessário)
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["poetry", "run", "python", "index.py"]