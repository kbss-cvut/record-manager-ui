FROM ghcr.io/kbss-cvut/s-pipes/s-pipes-engine:latest

RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

CMD ["/start.sh"]
