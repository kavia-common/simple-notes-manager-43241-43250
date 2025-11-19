#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-notes-manager-43241-43250/note_taking_frontend
npm run lint
ESLINT_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

