# src/service/customer_csv_upload.py


import pandas as pd
import re
import os
import io
from git import Repo
from src.temp.result import Result
from sqlalchemy.orm import sessionmaker
from sqlalchemy import MetaData, Table, text
from src.infrastructure.database.db_cvd_paef import engine, Customer, CompanyAggregate
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Caminho do repositório
'''
github_folder_path = os.getenv('GITHUB_FOLDER_PATH')
FILES_DIR = '/files_csv'
'''

# Importação do Session
Session = sessionmaker(bind=engine)

def checkCsvStructure(df):
    # Padrões para validação dos campos
    standards = {
        'Nome': r'^[A-Za-zÀ-ÿ\s\.\-\'"]+$',
        'Grupo Cliente': r'^[A-Za-zÀ-ÿ\s/]+$',
        'Perfil': r'^[A-Za-zÀ-ÿ0-9\s&.\-]+$',
        'Documento': r'^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2})$',
        'Valor': r'^\d{1,3}(?:\.\d{3})*(?:,\d{2})?$',
        'Valor Comprovado BRL': r'^\d{1,3}(?:\.\d{3})*(?:,\d{2})?$',
        'Valor Comprovado USD': r'^\d{1,3}(?:\.\d{3})*(?:,\d{2})?$',
        'Valor Comprovado BTC': r'^\d{1,3}(?:\.\d{3})*(?:,\d{2})?$',
        'Data do Ultimo Investimento': r'^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$',
    }

    def checkFunction(value, standards):
        if pd.isna(value):
            return True
        return re.match(standards, str(value)) is not None

    res = {}
    
    for c, standard in standards.items():
        find = df[c].apply(lambda x: checkFunction(x, standard))

        if find.all():
            res[c] = 'Todos os valores estão conforme o padrão!'
        else:
            res[c] = 'Alguns valores não estão conforme o padrão!\n'
            errorStandards = df[c][~find]
            res[c] += f'Valores sem padrão: {errorStandards.tolist()}\n'

    for c, result in res.items():
        print(f'{c}: {result}')

    return all(result.startswith('Todos os valores') for result in res.values())

'''
def uploadToGit(file_path, msg_commit):
    repo = Repo(github_folder_path)
    repo.index.add([file_path])
    repo.index.commit(msg_commit)
    origin = repo.remote(name='origin')
    origin.push()
'''

def clean_value(value):
    if pd.isna(value):
        return 0.0
    value_str = str(value)
    value_str = value_str.replace('.', '')
    clean_value = value_str.replace(',', '.')
    return float(clean_value) if clean_value else 0.0

    
def parse_date(date_str):
    if isinstance(date_str, str):
        try:
            return datetime.strptime(date_str, '%d/%m/%Y')
        except ValueError:
            return None
    return None

def saveToPostgres(df):
    session = Session()

    # Pegando a hora atual
    time = datetime.now()

    try:
        for _, row in df.iterrows():
            clean_document = re.sub(r'[.\-\/]', '', str(row['Documento']))
            clean_invested_value = clean_value(row['Valor'])
            clean_brl_value = clean_value(row['Valor Comprovado BRL'])
            clean_usd_value = clean_value(row['Valor Comprovado USD'])
            clean_btc_value = clean_value(row['Valor Comprovado BTC'])
            latest_investment_date = parse_date(row['Data do Ultimo Investimento'])

            customer = Customer(
                customer_name=row['Nome'],
                customer_document=clean_document,
                group_name=row['Grupo Cliente'],
                company_name=row['Perfil'],
                customer_invested_value=clean_invested_value,
                customer_comproved_invested_brl_value=clean_brl_value,
                latest_investment_date=latest_investment_date,
                up_time=time,
                customer_comproved_invested_usd_value=clean_usd_value,
                customer_comproved_invested_btc_value=clean_btc_value
            )
            session.add(customer)
        
        session.commit()
    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()


def clear_table(table_name):
    metadata = MetaData()
    table = Table(table_name, metadata, autoload_with=engine)
    with engine.connect() as conn:
        conn.execute(table.delete())
        conn.commit()
    print(f"Tabela '{table_name}' limpa com sucesso!")

def aggregate_company_data():
    with engine.connect() as conn:
        try:
            conn.execute(text("""SELECT aggregate_company_data()"""))
            conn.commit()
            print('Aggregation and insertion completed successfully.')
        except Exception as e:
            conn.rollback()
            print(f'An error occurred during the aggregation and insertion process: {e}')

async def handle_upload(req):
    file_key = 'cvd_controle_clientes'

    if (file_key) not in req.files:
        return Result.fail('No file part', 400)
    
    file = req.files[file_key]
    
    if file.filename == '':
        return Result.fail('No selected file', 400)

    try:
        # Leia o arquivo em memória para evitar limpeza de dados
        file_stream = io.StringIO(file.stream.read().decode('utf-8'))
        df = pd.read_csv(file_stream)

        # Verificar a estrutura do CSV
        structure_valid = checkCsvStructure(df)
        if not structure_valid:
            return Result.fail('CSV structure is invalid', 400)

        # Verificar se o diretório existe
        '''
        os.makedirs(github_folder_path + FILES_DIR, exist_ok=True)

        # Salvar o arquivo no diretório do repositório
        file_path = FILES_DIR + "/" + file.filename
        local_path = github_folder_path + file_path
        file.stream.seek(0)
        file.save(local_path)

        # Fazer o commit no git
        uploadToGit(local_path, 'Adicionando novo arquivo CSV')
        '''

        # Limpar a tabela
        clear_table('tb_cvd_paef_customer')

        # Inserir dados no banco de dados
        saveToPostgres(df)

        # Agregar os dados
        aggregate_company_data()

        return Result.ok('File processed and data saved successfully', 200)
    except Exception as e:
        return Result.fail(str(e), 500)
    


