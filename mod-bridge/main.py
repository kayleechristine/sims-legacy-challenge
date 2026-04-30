import json
import logging
import time
from pathlib import Path

from config import WATCH_DIR
from importer import import_sim

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)


def process_file(path: Path) -> None:
    try:
        payload = json.loads(path.read_text())
        if import_sim(payload):
            path.rename(path.with_suffix('.imported'))
    except (json.JSONDecodeError, OSError) as e:
        logger.error('Error processing %s: %s', path, e)


def watch(directory: Path) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    logger.info('Watching %s', directory)
    seen = set()
    while True:
        for f in directory.glob('*.json'):
            if f not in seen:
                seen.add(f)
                process_file(f)
        time.sleep(2)


if __name__ == '__main__':
    watch(Path(WATCH_DIR))
