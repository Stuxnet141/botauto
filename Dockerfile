FROM n8nio/n8n:latest

COPY workflow_n8n.json /home/node/workflow_n8n.json

CMD ["n8n", "start", "--tunnel", "--import-workflow", "--workflow", "/home/node/workflow_n8n.json"]
