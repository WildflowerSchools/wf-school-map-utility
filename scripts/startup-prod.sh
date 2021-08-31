#!/bin/sh

echo "Starting server..."
# Start server
exec nginx -g "daemon off;"
