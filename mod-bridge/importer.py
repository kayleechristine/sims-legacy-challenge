import logging
import requests
from config import API_BASE_URL, API_KEY

logger = logging.getLogger(__name__)


def import_sim(payload: dict) -> bool:
    url = f'{API_BASE_URL}/api/sims/import'
    headers = {'X-Api-Key': API_KEY, 'Content-Type': 'application/json'}
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        logger.info('Imported sim: %s', payload.get('name'))
        return True
    except requests.RequestException as e:
        logger.error('Failed to import sim: %s', e)
        return False
