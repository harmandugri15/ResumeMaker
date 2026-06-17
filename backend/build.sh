#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running migrations..."
python manage.py migrate

echo "Seeding templates..."
python seed_templates.py

echo "Ingesting knowledge base for AI Review..."
python manage.py ingest_kb
